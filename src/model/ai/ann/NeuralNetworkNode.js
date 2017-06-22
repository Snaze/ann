import { assert } from "../../../utils/Assert";
import ActivationFunctions from "./ActivationFunctions";
import math from "../../../../node_modules/mathjs/dist/math";
import ArrayUtils from "../../../utils/ArrayUtils";

class NeuralNetworkNode {

    constructor(numWeights,
                includeBias=true,
                activationFunction=ActivationFunctions.sigmoid) {

        this._numWeights = numWeights;
        this._includeBias = includeBias;
        this._activationFunction = activationFunction;
        this._output = null;
        this._error = null;
        this._learningRate = 1.0;
        this._prevInputs = null;

        if (includeBias) {
            this._numWeights++;
        }

        this._weights = NeuralNetworkNode.createRandomWeights(this._numWeights);
        this._prevWeights = this._weights.slice(0);
        this._weightDeltas = NeuralNetworkNode.createArrayWithValue(this._numWeights, 0);
    }

    static create2DArrayWithValue(height, width, value=0) {

        let toRet = [];

        for (let y = 0; y < height; y++) {
            toRet[y] = [];

            for (let x = 0; x < width; x++) {
                toRet[y][x] = value;
            }
        }

        return toRet;
    }

    static createArrayWithValue(length, value=0) {
        let toRet = [];
        toRet.length = length;
        toRet.fill(value);
        return toRet;
    }

    static createRandomWeights(numToCreate) {
        let toRet = [];

        for (let i = 0; i < numToCreate; i++) {
            let randomWeight = math.floor(math.random() * numToCreate) / math.sqrt(numToCreate);
            toRet.push(randomWeight);
            // toRet.push(0);
        }

        return toRet;
    }

    get numWeights() {
        return this._numWeights;
    }

    get weights() {
        return this._weights;
    }

    set weights(value) {
        assert (value.length === this._numWeights);

        this._weights = value;
    }

    get prevWeights() {
        return this._prevWeights;
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

        this._output = [];
        let nodeValues = null;

        for (let i = 0; i < nodeValueMiniBatch.length; i++) {
            nodeValues = nodeValueMiniBatch[i];

            if (this.includeBias && (nodeValues.length + 1) === this.weights.length) {
                nodeValues.push(1.0);
            }

            assert (!this.includeBias || nodeValues[nodeValues.length - 1] === 1.0);
            assert (nodeValues.length === this.weights.length, "Weight length and node length need to match");

            let dotProduct = math.dot(nodeValues, this._weights);
            this._output[i] = this._activationFunction.output(dotProduct);
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

            for (let w_i = 0; w_i < this._weights.length; w_i++) {
                allWeightDeltas[i][w_i] = math.chain(this._learningRate)
                                                .multiply(currentError)
                                                .multiply(nodeValues[w_i])
                                                .done();
            }

            errorArray[i] = currentError;
        }

        this._weightDeltas = math.mean(allWeightDeltas, 0);

        ArrayUtils.copyInto(this._weights, this._prevWeights);
        this._weights = math.add(this._weights, this._weightDeltas);
        // this._error = math.mean(errorArray, 0);
        this._error = errorArray;

        return this._error;
    }

    /**
     * This should be called to backPropagate if this node is hidden.
     *
     * @param nextLayerErrorsMiniBatch This should be an array consisting of the error for each node of the next layer.
     * @param outgoingWeights This should be an array consisting of the weight edges exiting this node.
     * propagated.
     *
     * @returns The error of this node.
     */
    backPropagateHiddenNode(nextLayerErrorsMiniBatch, outgoingWeights) {

        assert (this._prevInputs.length === nextLayerErrorsMiniBatch.length,
            "Inputs and nextLayerErrors MiniBatch lengths need to match");

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

            for (let w_i = 0; w_i < this._weights.length; w_i++) {
                allWeightDeltas[i][w_i] = math.chain(this._learningRate)
                    .multiply(currentError)
                    .multiply(nodeValues[w_i])
                    .done();
            }

            errorArray[i] = currentError;
        }

        this._weightDeltas = math.mean(allWeightDeltas, 0);
        ArrayUtils.copyInto(this._weights, this._prevWeights);
        this._weights = math.add(this._weights, this._weightDeltas);
        this._error = errorArray;

        return this._error;
    }
}

export default NeuralNetworkNode;