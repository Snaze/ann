import math from "../../../../../node_modules/mathjs/dist/math";
import { assert } from "../../../../utils/Assert";
import ArrayUtils from "../../../../utils/ArrayUtils";

/**
 * This is the standard vanilla weight update rule for backpropagation.
 *
 * Stochastic Gradient Descent
 */
class SGD {

    /**
     * This is the constructor for SGD.
     * @param layerIndex {Number} This is the layer index of the current node.
     * @param nodeIndex {Number} This is the node index of the current node.
     * @param includeBias {Boolean} This specifies whether or not a bias input is being used.
     * @param edgeStore {EdgeStore} This is the edge store which holds all the NN weights.
     * @param activationFunction {Object} This is the activation function to be used.
     */
    constructor(layerIndex, nodeIndex, includeBias, edgeStore, activationFunction) {
        this._layerIndex = layerIndex;
        this._nodeIndex = nodeIndex;
        this._includeBias = includeBias;
        this._edgeStore = edgeStore;
        this._activationFunction = activationFunction;
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
        // TODO: Refactor this common code back into NeuralNetworkNode
        let nodeValues = null, currOutput = null, nextLayerErrorsOrTargetValue = null;
        let currentError = null, errorArray = [], allWeightDeltas = [];
        let derivative, temp, gradient;

        let outputEdges = this._edgeStore.getOutputEdges(this._layerIndex, this._nodeIndex);
        let outgoingWeights = ArrayUtils.select(outputEdges, (edge) => edge.prevWeight);
        let inputEdges = this._edgeStore.getInputEdges(this._layerIndex, this._nodeIndex);

        for (let i = 0; i < prevInputs.length; i++) {

            allWeightDeltas[i] = [];

            nodeValues = prevInputs[i];
            currOutput = outputs[i];
            nextLayerErrorsOrTargetValue = nextLayerErrorsMiniBatch[i];

            assert(!this._includeBias || nodeValues[nodeValues.length - 1] === 1.0);
            assert(nodeValues.length === inputEdges.length, "Weight length and node length need to match");

            derivative = this._activationFunction.derivative(currOutput);

            if (nextLayerErrorsOrTargetValue instanceof Array) {
                temp = math.dot(nextLayerErrorsOrTargetValue, outgoingWeights);
            } else {
                temp = math.subtract(nextLayerErrorsOrTargetValue, currOutput);
            }

            currentError = math.multiply(derivative, temp);

            for (let w_i = 0; w_i < inputEdges.length; w_i++) {
                gradient = currentError * nodeValues[w_i];
                allWeightDeltas[i][w_i] = -1 * learningRate * gradient;
            }

            errorArray[i] = currentError;
        }

        let weightDeltas = math.mean(allWeightDeltas, 0);
        return {
            errorArray: errorArray,
            weightDeltas: weightDeltas
        };
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

export default SGD;