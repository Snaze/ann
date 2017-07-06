import { assert } from "../../../utils/Assert";
import ActivationFunctions from "./ActivationFunctions";
import math from "../../../../node_modules/mathjs/dist/math";
import ArrayUtils from "../../../utils/ArrayUtils";
import LearningRate from "./LearningRate";
import SGD from "./backprop/SGD";
// import RMSProp from "./backprop/RMSProp";

const event_feed_forward_start = 0;
const event_feed_forward_complete = 1;
const event_back_prop_start = 2;
const event_back_prop_complete = 3;

class NeuralNetworkNode {

    static get EVENT_FEED_FORWARD_START() { return event_feed_forward_start; }
    static get EVENT_FEED_FORWARD_COMPLETE() { return event_feed_forward_complete; }
    static get EVENT_BACK_PROP_START() { return event_back_prop_start; }
    static get EVENT_BACK_PROP_COMPLETE() { return event_back_prop_complete; }

    constructor(layerIndex,
                nodeIndex,
                edgeStore,
                numWeights,
                includeBias=true,
                activationFunction=ActivationFunctions.sigmoid,
                callback=null,
                backProp=null) {

        this._layerIndex = layerIndex;
        this._nodeIndex = nodeIndex;
        this._edgeStore = edgeStore;
        this._numWeights = numWeights;
        this._includeBias = includeBias;
        this._activationFunction = activationFunction;
        this._output = null;
        this._activationInput = null;
        this._error = null;
        this._learningRate = new LearningRate(1.0, 0.01, 100);
        this._prevInputs = null;
        this._callback = callback;

        if (includeBias) {
            this._numWeights++;
        }

        this._weightDeltas = ArrayUtils.create1D(this._numWeights, 0);
        this._backProp = backProp;
        if (this._backProp === null) {
            this._backProp = new SGD(layerIndex, nodeIndex, includeBias, edgeStore, activationFunction);
            // this._backProp = new RMSProp(layerIndex, nodeIndex, includeBias, edgeStore, activationFunction);
        }
    }

    static createArrayWithValue(length, value=0) {
        let toRet = [];
        toRet.length = length;
        toRet.fill(value);
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

    get activationInput() {
        return this._activationInput;
    }

    get error() {
        return this._error;
    }

    get weightDeltas() {
        return this._weightDeltas;
    }

    /**
     *
     * @returns {null|LearningRate}
     */
    get learningRate() {
        return this._learningRate;
    }

    /**
     *
     * @param value {null|LearningRate}
     */
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

    get callback() {
        return this._callback;
    }

    set callback(value) {
        this._callback = value;
    }

    get prevInputs() {
        return this._prevInputs;
    }

    static calculateError(expected, actual) {
        return math.chain(0.5).multiply(math.pow(math.subtract(expected, actual),2)).done();
    }

    _executeCallback(type) {
        if (!!this._callback) {
            this._callback({
                type: type,
                source: this
            });
        }
    }

    /**
     * This will feedForward the network and give you a prediction
     *
     * @param nodeValueMiniBatch 2D array of node inputs
     *
     * @returns {null|Array} array of outputs.
     */
    feedForward(nodeValueMiniBatch) {

        this._executeCallback(NeuralNetworkNode.EVENT_FEED_FORWARD_START);

        if (this._layerIndex === 0) {
            this._output = ArrayUtils.getColumn(nodeValueMiniBatch, this._nodeIndex);
            this._prevInputs = nodeValueMiniBatch;

            this._executeCallback(NeuralNetworkNode.EVENT_FEED_FORWARD_COMPLETE);
            return this._output;
        }

        this._output = [];
        this._activationInput = [];
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

            this._activationInput[i] = activationInput;
            this._output[i] = this._activationFunction.output(activationInput);
        }

        this._prevInputs = nodeValueMiniBatch;

        this._executeCallback(NeuralNetworkNode.EVENT_FEED_FORWARD_COMPLETE);

        return this._output;
    }

    /**
     * This should be called to backPropagate.
     *
     * @param nextLayerErrorsMiniBatch {Array} This should be an array consisting of the target values or errors.
     * @param epoch {Number} This should be the current epoch number.
     *
     * @returns The error of this node.
     */
    backPropagate(nextLayerErrorsMiniBatch, epoch=0) {

        assert (this._prevInputs.length === nextLayerErrorsMiniBatch.length,
            "Inputs and nextLayerErrorsOrTargetValue MiniBatch lengths need to match");

        this._executeCallback(NeuralNetworkNode.EVENT_BACK_PROP_START);

        if (this._layerIndex === 0) {
            this._error = ArrayUtils.create1D(this._prevInputs.length, 0);
            this._executeCallback(NeuralNetworkNode.EVENT_BACK_PROP_COMPLETE);
            return this._error;
        }

        let learningRate = this.learningRate.getLearningRate(epoch);
        let result = this._backProp.getWeightDeltas(this._prevInputs, this._output,
            nextLayerErrorsMiniBatch, learningRate);

        let errorArray = result.errorArray;
        this._weightDeltas = result.weightDeltas;

        this.weights = math.subtract(this.weights, this._weightDeltas);
        this._error = errorArray;

        this._executeCallback(NeuralNetworkNode.EVENT_BACK_PROP_COMPLETE);

        return this._error;
    }
}

export default NeuralNetworkNode;