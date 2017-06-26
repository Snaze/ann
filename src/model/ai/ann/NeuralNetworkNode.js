import { assert } from "../../../utils/Assert";
import ActivationFunctions from "./ActivationFunctions";
import math from "../../../../node_modules/mathjs/dist/math";
import ArrayUtils from "../../../utils/ArrayUtils";
import randgen from "../../../../node_modules/randgen/lib/randgen";
import MathUtil from "../MathUtil";

class NeuralNetworkNode {

    constructor(layerIndex,
                nodeIndex,
                edgeStore,
                numWeights,
                nodesInNextLayer,
                includeBias=true,
                activationFunction=ActivationFunctions.sigmoid) {

        this._layerIndex = layerIndex;
        this._nodeIndex = nodeIndex;
        this._edgeStore = edgeStore;
        this._numWeights = numWeights;
        this._includeBias = includeBias;
        this._activationFunction = activationFunction;
        this._output = null;
        this._error = null;
        this._learningRate = 1.0;
        this._prevInputs = null;
        this._nodesInNextLayer = nodesInNextLayer;

        if (includeBias) {
            this._numWeights++;
            this._nodesInNextLayer++;
        }

        // this._weights = NeuralNetworkNode.createRandomWeights(this._numWeights, this._activationFunction,
        //                                                         this._numWeights, this._nodesInNextLayer);
        // this._prevWeights = this._weights.slice(0);
        this._weightDeltas = NeuralNetworkNode.createArrayWithValue(this._numWeights, 0);
    }

    static createArrayWithValue(length, value=0) {
        let toRet = [];
        toRet.length = length;
        toRet.fill(value);
        return toRet;
    }

    static createClippedRandomWeight(mean, std, minVal, maxVal) {
        let toRet = randgen.rnorm(mean, std);

        return MathUtil.clip(toRet, minVal, maxVal);
    }

    /**
     *
     * I never thought I would spend so much time fiddling with these weights.
     *
     * https://stats.stackexchange.com/questions/229885/whats-the-recommended-weight-initialization-strategy-when-using-the-elu-activat
     * https://stats.stackexchange.com/questions/47590/what-are-good-initial-weights-in-a-neural-network
     *
     * @param numToCreate
     * @param activationFunction
     * @param fanInCount
     * @param fanOutCount
     * @returns {Array}
     */
    static createRandomWeights(numToCreate, activationFunction, fanInCount, fanOutCount) {
        let toRet = [];

        let randomNum = null;
        let randomWeight = null;
        // let classics = [ActivationFunctions.sigmoid, ActivationFunctions.tanh];

        for (let i = 0; i < numToCreate; i++) {

            switch (activationFunction) {
                case ActivationFunctions.relu:
                    randomNum = math.sqrt(math.divide(12, math.add(fanInCount, fanOutCount)));
                    randomWeight = MathUtil.getRandomArbitrary(-randomNum, randomNum);
                    break;
                case ActivationFunctions.tanh:

                    // randomNum = NeuralNetworkNode.createClippedRandomWeight(0, 0.5, -1, 1);
                    // randomWeight = math.divide(randomNum, math.sqrt(math.divide(2.0, numToCreate)));
                    randomNum = math.sqrt(math.divide(6, math.add(fanInCount, fanOutCount)));
                    randomWeight = MathUtil.getRandomArbitrary(-randomNum, randomNum);
                    break;
                case ActivationFunctions.sigmoid:
                    randomNum = math.multiply(4, math.sqrt(math.divide(6, math.add(fanInCount, fanOutCount))));
                    randomWeight = MathUtil.getRandomArbitrary(-randomNum, randomNum);
                    break;
                default:
                    throw new Error("Unknown Activation Function");
            }

            toRet.push(randomWeight);
        }

        return toRet;
    }

    get numWeights() {
        return this._numWeights;
    }

    get weights() {
        let edges = this._edgeStore.getInputEdges(this._layerIndex, this._nodeIndex);
        return ArrayUtils.select(edges, (edge) => edge.weight);
    }

    set weights(value) {
        assert (value.length === this._numWeights);

        let edges = this._edgeStore.getInputEdges(this._layerIndex, this._nodeIndex);
        ArrayUtils.update(edges, (item, index) => item.weight = value[index]);
    }

    get prevWeights() {
        let edges = this._edgeStore.getInputEdges(this._layerIndex, this._nodeIndex);
        return ArrayUtils.select(edges, (edge) => edge.prevWeight);
    }

    get includeBias() {
        return this._includeBias;
    }

    get activationFunction() {
        return this._activationFunction;
    }

    get output() {
        return this._output;
    }

    get error() {
        return this._error;
    }

    get weightDeltas() {
        return this._weightDeltas;
    }

    get learningRate() {
        return this._learningRate;
    }

    set learningRate(value) {
        this._learningRate = value;
    }

    get layerIndex() {
        return this._layerIndex;
    }

    get nodeIndex() {
        return this._nodeIndex;
    }

    get edgeStore() {
        return this._edgeStore;
    }

    static calculateError(expected, actual) {
        return math.chain(0.5).multiply(math.pow(math.subtract(expected, actual),2)).done();
    }

    /**
     * This will feedForward the network and give you a prediction
     *
     * @param nodeValueMiniBatch 2D array of node inputs
     *
     * @returns {null|Array} array of outputs.
     */
    feedForward(nodeValueMiniBatch) {

        if (this._layerIndex === 0) {
            this._output = ArrayUtils.getColumn(nodeValueMiniBatch, this._nodeIndex);
            this._prevInputs = nodeValueMiniBatch;
            return this._output;
        }

        this._output = [];
        let nodeValues = null;
        let activationInput;

        for (let i = 0; i < nodeValueMiniBatch.length; i++) {
            nodeValues = nodeValueMiniBatch[i];

            if (this.includeBias && (nodeValues.length + 1) === this.weights.length) {
                nodeValues.push(1.0);
            }

            assert (!this.includeBias || nodeValues[nodeValues.length - 1] === 1.0);
            assert (nodeValues.length === this.weights.length, "Weight length and node length need to match");
            activationInput = math.dot(nodeValues, this.weights);

            this._output[i] = this._activationFunction.output(activationInput);
        }

        this._prevInputs = nodeValueMiniBatch;

        return this._output;
    }

    /**
     * If this is an output node you want to call this to backpropagate a single iteration
     *
     * @param targetValuesMiniBatch This should be the desired output of the node.
     * @returns {*|Number|null} Returns the error.
     */
    backPropagateOutputNode(targetValuesMiniBatch) {

        assert (this._prevInputs.length === targetValuesMiniBatch.length,
            "Inputs and Target MiniBatch lengths need to match");

        let nodeValues = null;
        let currOutput = null;
        let targetValue = null;
        let currentError = null;
        let errorArray = [];
        let allWeightDeltas = [];

        for (let i = 0; i < this._prevInputs.length; i++) {

            allWeightDeltas[i] = [];

            nodeValues = this._prevInputs[i];
            currOutput = this.output[i];
            targetValue = targetValuesMiniBatch[i];

            assert (!this.includeBias || nodeValues[nodeValues.length - 1] === 1.0);
            assert (nodeValues.length === this.weights.length, "Weight length and node length need to match");

            currentError = this.activationFunction.outputError(targetValue, currOutput);

            for (let w_i = 0; w_i < this.weights.length; w_i++) {
                allWeightDeltas[i][w_i] = math.chain(-1 * this.learningRate)
                                                .multiply(currentError)
                                                .multiply(nodeValues[w_i])
                                                .done();
            }

            errorArray[i] = currentError;
        }

        this._weightDeltas = math.mean(allWeightDeltas, 0);
        // this._weightDeltas = math.sum(allWeightDeltas);

        // ArrayUtils.copyInto(this.weights, this.prevWeights);
        this.weights = math.subtract(this.weights, this._weightDeltas);
        // this._error = math.mean(errorArray, 0);
        this._error = errorArray;

        return this._error;
    }

    /**
     * This should be called to backPropagate if this node is hidden.
     *
     * @param nextLayerErrorsMiniBatch This should be an array consisting of the error for each node of the next layer.
     * @param outgoingWeights This should be an array consisting of the weight edges exiting this node.
     * propagated.  This is optional now.
     *
     * @returns The error of this node.
     */
    backPropagateHiddenNode(nextLayerErrorsMiniBatch, outgoingWeights=null) {

        assert (this._prevInputs.length === nextLayerErrorsMiniBatch.length,
            "Inputs and nextLayerErrors MiniBatch lengths need to match");

        if (this._layerIndex === 0) {
            // this._weightDeltas = [];
            // this._weightDeltas = math.sum(allWeightDeltas);
            // ArrayUtils.copyInto(this.weights, this._prevWeights);
            // this.weights = math.subtract(this.weights, this._weightDeltas);
            this._error = ArrayUtils.create1D(this._prevInputs.length, 0);

            return this._error;
        }

        if (outgoingWeights === null) {
            let outputEdges = this._edgeStore.getOutputEdges(this._layerIndex, this._nodeIndex);
            outgoingWeights = ArrayUtils.select(outputEdges, (edge) => edge.prevWeight);
        }

        let nodeValues = null;
        let currOutput = null;
        let nextLayerErrors = null;
        let currentError = null;
        let errorArray = [];
        let allWeightDeltas = [];

        for (let i = 0; i < this._prevInputs.length; i++) {

            allWeightDeltas[i] = [];

            nodeValues = this._prevInputs[i];
            currOutput = this.output[i];
            nextLayerErrors = nextLayerErrorsMiniBatch[i];

            assert(!this.includeBias || nodeValues[nodeValues.length - 1] === 1.0);
            assert(nodeValues.length === this.weights.length, "Weight length and node length need to match");

            currentError = this.activationFunction.hiddenError(nextLayerErrors, outgoingWeights, currOutput);

            for (let w_i = 0; w_i < this.weights.length; w_i++) {
                allWeightDeltas[i][w_i] = math.chain(-1 * this._learningRate)
                    .multiply(currentError)
                    .multiply(nodeValues[w_i])
                    .done();
            }

            errorArray[i] = currentError;
        }

        this._weightDeltas = math.mean(allWeightDeltas, 0);
        // this._weightDeltas = math.sum(allWeightDeltas);
        // ArrayUtils.copyInto(this.weights, this._prevWeights);
        this.weights = math.subtract(this.weights, this._weightDeltas);
        this._error = errorArray;

        return this._error;
    }
}

export default NeuralNetworkNode;