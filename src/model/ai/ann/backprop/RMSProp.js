import math from "../../../../../node_modules/mathjs/dist/math";
import { assert } from "../../../../utils/Assert";
import ArrayUtils from "../../../../utils/ArrayUtils";

/**
 * This is the RMSProp weight update rule for backpropagation.
 *
 * RMSProp
 */
class RMSProp {

    /**
     * This is the constructor for RMSProp.
     * @param layerIndex {Number} This is the layer index of the current node.
     * @param nodeIndex {Number} This is the node index of the current node.
     * @param includeBias {Boolean} This specifies whether or not a bias input is being used.
     * @param edgeStore {EdgeStore} This is the edge store which holds all the NN weights.
     * @param activationFunction {Object} This is the activation function to be used.
     * @param forgetFactor {Number} This number affects how much of the running average to keep.  Larger = more.
     * @param errorFactor {Number} This factor is used simply to avoid divide by zero errors.
     */
    constructor(layerIndex, nodeIndex, includeBias, edgeStore, activationFunction, forgetFactor=0.9,
                errorFactor=1e-8) {
        assert (forgetFactor >= 0 && forgetFactor <= 1, "0 <= forgetFactor <= 1");

        this._layerIndex = layerIndex;
        this._nodeIndex = nodeIndex;
        this._includeBias = includeBias;
        this._edgeStore = edgeStore;
        this._activationFunction = activationFunction;
        this._forgetFactor = forgetFactor;
        this._errorFactor = errorFactor;
        this._meanSquare = null;

    }

    /**
     * This will retrieve the weight deltas for 1 iteration of back propagation.
     *
     * @param prevInputs {Array} This should be a mini-batch of the previous input.
     * @param outputs {Array} THis should be the previous outputs.
     * @param nextLayerErrorsMiniBatch {Array} This should be the errors for each node
     * in the next layer.
     * @param learningRate {Number} This should be the current learning rate.
     * @returns {{errorArray: Array, weightDeltas: Array}}
     */
    getWeightDeltas(prevInputs, outputs, nextLayerErrorsMiniBatch, learningRate) {
        assert (this._layerIndex > 0, "No need to backpropagate for input node");

        let nodeValues = null, currOutput = null, nextLayerErrorsOrTargetValue = null;
        let currentError = null, errorArray = [], allWeightDeltas = [];
        let derivative, temp, gradient, currentMeanSquared;

        let outputEdges = this._edgeStore.getOutputEdges(this._layerIndex, this._nodeIndex);
        let outgoingWeights = ArrayUtils.select(outputEdges, (edge) => edge.prevWeight);
        let numInputEdges = this.numInputEdges;
        let gradientCache = ArrayUtils.create(prevInputs.length, numInputEdges);

        for (let i = 0; i < prevInputs.length; i++) {

            allWeightDeltas[i] = [];

            nodeValues = prevInputs[i];
            currOutput = outputs[i];
            nextLayerErrorsOrTargetValue = nextLayerErrorsMiniBatch[i];

            assert(!this._includeBias || nodeValues[nodeValues.length - 1] === 1.0);
            assert(nodeValues.length === numInputEdges, "Weight length and node length need to match");

            derivative = this._activationFunction.derivative(currOutput);

            if (nextLayerErrorsOrTargetValue instanceof Array) {
                temp = math.dot(nextLayerErrorsOrTargetValue, outgoingWeights);
            } else {
                temp = math.subtract(nextLayerErrorsOrTargetValue, currOutput);
            }

            currentError = math.multiply(derivative, temp);

            for (let w_i = 0; w_i < numInputEdges; w_i++) {
                gradient = currentError * nodeValues[w_i];
                gradientCache[i][w_i] = gradient;
            }

            errorArray[i] = currentError;
        }

        let totalGradient = math.mean(gradientCache, 0);
        let firstPart = math.multiply(this.forgetFactor, this.meanSquare);
        let invertedForgetFactor = 1 - this.forgetFactor;
        let gradientSquared = totalGradient.map((item) => item * item);
        currentMeanSquared = math.add(firstPart, math.multiply(invertedForgetFactor, gradientSquared));
        let weightDeltas = currentMeanSquared.map(function (item, index) {
            return -0.001 * (totalGradient[index] / Math.sqrt(item + this.errorFactor))
        }.bind(this));

        this._meanSquare = currentMeanSquared;

        return {
            errorArray: errorArray,
            weightDeltas: weightDeltas
        };
    }

    /**
     * This is the forget factor used in the equation
     * MeanSquare(w, t) = ForgetFactor * MeanSquare(w, t-1) + (1 - ForgetFactor) * gradient_w_i
     * @returns {Number}
     */
    get forgetFactor() {
        return this._forgetFactor;
    }

    /**
     * This is simply a number that is added to the denominator if its zero (to prevent divide by zero
     * error.
     * @returns {Number}
     */
    get errorFactor() {
        return this._errorFactor;
    }

    /**
     * This returns the number of input edges.
     *
     * @return {Number}
     */
    get numInputEdges() {
        return this._edgeStore.getInputEdges(this._layerIndex, this._nodeIndex).length;
    }

    /**
     * This is the MeanSquare error used to find the weight deltas
     *
     * @returns {Array}
     */
    get meanSquare() {
        if (this._meanSquare === null) {
            this._meanSquare = ArrayUtils.create1D(this.numInputEdges, 0);
        }

        return this._meanSquare;
    }

    /**
     * This is the layer index.
     * @returns {Number}
     */
    get layerIndex() {
        return this._layerIndex;
    }

    /**
     * This is the node index.
     * @returns {Number}
     */
    get nodeIndex() {
        return this._nodeIndex;
    }

    /**
     * This specifies if a bias is used.
     * @returns {Boolean}
     */
    get includeBias() {
        return this._includeBias;
    }

    /**
     * This is the EdgeStore
     * @returns {EdgeStore}
     */
    get edgeStore() {
        return this._edgeStore;
    }

    /**
     * This is the activation function.
     * @returns {Object}
     */
    get activationFunction() {
        return this._activationFunction;
    }
}

export default RMSProp;