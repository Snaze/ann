import math from "../../../../../node_modules/mathjs/dist/math";
import { assert } from "../../../../utils/Assert";
import ArrayUtils from "../../../../utils/ArrayUtils";

/**
 * This is the Adam weight update rule for backpropagation.
 *
 * Adam
 */
class RMSProp {

    /**
     * This is the constructor for Adam.
     * @param layerIndex {Number} This is the layer index of the current node.
     * @param nodeIndex {Number} This is the node index of the current node.
     * @param includeBias {Boolean} This specifies whether or not a bias input is being used.
     * @param edgeStore {EdgeStore} This is the edge store which holds all the NN weights.
     * @param activationFunction {Object} This is the activation function to be used.
     * @param gradientDecay {Number} This is the decay factor for the gradient.
     * @param squaredGradientDecay {Number} This is the decay factor for the gradient.
     * @param errorFactor {Number} This factor is used simply to avoid divide by zero errors.
     */
    constructor(layerIndex, nodeIndex, includeBias, edgeStore, activationFunction,
                gradientDecay=0.9, squaredGradientDecay=0.999, errorFactor=1e-8) {
        assert (gradientDecay >= 0 && gradientDecay <= 1, "0 <= gradientDecay <= 1");
        assert (squaredGradientDecay >= 0 && squaredGradientDecay <= 1, "0 <= squaredGradientDecay <= 1");

        this._layerIndex = layerIndex;
        this._nodeIndex = nodeIndex;
        this._includeBias = includeBias;
        this._edgeStore = edgeStore;
        this._activationFunction = activationFunction;
        this._gradientDecay = gradientDecay;
        this._inverseGradientDecay = (1.0 - this._gradientDecay);
        this._squaredGradientDecay = squaredGradientDecay;
        this._inverseSquaredGradientDecay = (1.0 - this._squaredGradientDecay);
        this._errorFactor = errorFactor;
        this._gradient = null;
        this._gradientSquared = null;

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
        assert (this._layerIndex > 0, "No need to backpropagate for input node");

        let nodeValues = null, currOutput = null, nextLayerErrorsOrTargetValue = null;
        let currentError = null, errorArray = [], allWeightDeltas = [];
        let derivative, temp, gradient;

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

        let currentGradient = math.mean(gradientCache, 0);
        let m_t = this.gradient.map(function (m_t_minus_1, index) {
            return this.gradientDecay * m_t_minus_1 +
                this.inverseGradientDecay * currentGradient[index];
        }.bind(this));

        let v_t = this.gradientSquared.map(function (v_t_minus_1, index) {
            return this.squaredGradientDecay * v_t_minus_1 +
                    this.inverseSquaredGradientDecay * Math.pow(currentGradient[index], 2);
        }.bind(this));

        let mHat_t = m_t.map(function (mT) {
            return mT / this.inverseGradientDecay;
        }.bind(this));

        let vHat_t = v_t.map(function (vT) {
            return vT / this.inverseSquaredGradientDecay;
        }.bind(this));

        let weightDeltas = mHat_t.map(function(currMHatT, index) {
            return -(learningRate / (Math.sqrt(vHat_t[index]) + this.errorFactor)) * currMHatT;
        }.bind(this));

        this._gradient = m_t;
        this._gradientSquared = v_t;

        return {
            errorArray: errorArray,
            weightDeltas: weightDeltas
        };
    }

    /**
     * The decay factor for the gradient calculation
     * @returns {Number}
     */
    get gradientDecay() {
        return this._gradientDecay;
    }

    /**
     * The squared decay factor for the gradient calculation
     * @returns {Number}
     */
    get squaredGradientDecay() {
        return this._squaredGradientDecay;
    }

    /**
     * This is (1 - gradientDecay)
     * @returns {Number}
     */
    get inverseGradientDecay() {
        return this._inverseGradientDecay;
    }

    /**
     * This is (1 - squaredGradientDecay)
     * @returns {Number}
     */
    get inverseSquaredGradientDecay() {
        return this._inverseSquaredGradientDecay;
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
     * This is the previous Gradient used to find the weight deltas
     *
     * @returns {Array}
     */
    get gradient() {
        if (this._gradient === null) {
            this._gradient = ArrayUtils.create1D(this.numInputEdges, 0);
        }

        return this._gradient;
    }

    /**
     * This is the previous Squared Gradient used to find weight deltas
     * @returns {Array}}
     */
    get gradientSquared() {
        if (this._gradientSquared === null) {
            this._gradientSquared = ArrayUtils.create1D(this.numInputEdges, 0);
        }

        return this._gradientSquared;
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