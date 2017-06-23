import { assert } from "../../../utils/Assert";
import ActivationFunctions from "./ActivationFunctions";
import math from "../../../../node_modules/mathjs/dist/math";
import ArrayUtils from "../../../utils/ArrayUtils";
import MathUtil from "../MathUtil";
import randgen from "../../../../node_modules/randgen/lib/randgen";

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

        this._weights = NeuralNetworkNode.createRandomWeights(this._numWeights, this._activationFunction);
        this._prevWeights = this._weights.slice(0);
        this._weightDeltas = NeuralNetworkNode.createArrayWithValue(this._numWeights, 0);
    }

    static createArrayWithValue(length, value=0) {
        let toRet = [];
        toRet.length = length;
        toRet.fill(value);
        return toRet;
    }

    static getSigmoidRandom() {
        let toRet = randgen.rnorm(0.5, 0.5);

        if (toRet <= 0) {
            toRet = 0.0001;
        }

        if (toRet >= 1) {
            toRet = 0.9999;
        }

        return toRet;
    }

    static getTanhRandom() {
        let toRet = randgen.rnorm(0, 1);

        if (toRet <= -1) {
            toRet = -0.9999;
        }

        if (toRet >= 1) {
            toRet = 0.9999;
        }

        return toRet;
    }

    static createRandomWeights(numToCreate, activationFunction) {
        let toRet = [];

        for (let i = 0; i < numToCreate; i++) {
            let randomNum = 0.25;
            if (activationFunction === ActivationFunctions.sigmoid) {
                randomNum = NeuralNetworkNode.getSigmoidRandom();
            } else if (activationFunction === ActivationFunctions.tanh) {
                randomNum = NeuralNetworkNode.getTanhRandom();
            } else {
                throw new Error("Unknown activation function");
            }

            // let randomWeight = math.divide(randomNum, math.sqrt(math.divide(2.0, numToCreate)));

            toRet.push(randomNum);
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
        // this._weightDeltas = math.sum(allWeightDeltas);

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
        // this._weightDeltas = math.sum(allWeightDeltas);
        ArrayUtils.copyInto(this._weights, this._prevWeights);
        this._weights = math.add(this._weights, this._weightDeltas);
        this._error = errorArray;

        return this._error;
    }
}

export default NeuralNetworkNode;