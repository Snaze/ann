import DataSourceBase from "./DataSourceBase";
import { assert } from "../utils/Assert";
// import ArrayUtils from "../utils/ArrayUtils";
import NeuralNetworkNode from "./ai/ann/NeuralNetworkNode";
import math from "../../node_modules/mathjs/dist/math";

class NeuralNetworkNodeDS extends DataSourceBase {

    constructor(neuralNetworkNode) {
        super();

        this._neuralNetworkNode = neuralNetworkNode;
        this._callbackRef = (e) => this._callback(e);
        this._neuralNetworkNode.callback = this._callbackRef;

        this._activationInput = this._neuralNetworkNode.activationInput; // should I clone this?
        this._output = this._neuralNetworkNode.output;
        this._error = this._neuralNetworkNode.error;
        this._layerIndex = this._neuralNetworkNode.layerIndex;
        this._nodeIndex = this._neuralNetworkNode.nodeIndex;
        this._feedForwardExecuting = false;
        this._backPropExecuting = false;
        this._animating = false;
        this._prevInputs = this._neuralNetworkNode.prevInputs;
        this._weights = this._neuralNetworkNode.weights;
        this._activationFunction = this._neuralNetworkNode.activationFunction;
    }

    // TODO: This thing is going to fire a lot.  You may want to make this more performant.
    _callback(e) {
        assert (e.source === this._neuralNetworkNode);

        // Limit the updates
        if (e.type !== NeuralNetworkNode.EVENT_BACK_PROP_COMPLETE) {
            return;
        }

        this._activationInput = this._neuralNetworkNode.activationInput; // should I clone this?
        this._output = this._neuralNetworkNode.output;
        this._error = this._neuralNetworkNode.error;
        this._layerIndex = this._neuralNetworkNode.layerIndex;
        this._nodeIndex = this._neuralNetworkNode.nodeIndex;
        this._prevInputs = this._neuralNetworkNode.prevInputs;
        this._weights = this._neuralNetworkNode.weights;
        this._activationFunction = this._neuralNetworkNode.activationFunction;

        this._feedForwardExecuting = e.type === NeuralNetworkNode.EVENT_FEED_FORWARD_START;
        this._backPropExecuting = e.type === NeuralNetworkNode.EVENT_BACK_PROP_START;

        // console.log("NeuralNetworkNodeDS callback");
    }

    get activationInput() {
        return this._activationInput;
    }

    set activationInput(value) {
        this._setValueAndRaiseOnChange("_activationInput", value);
    }

    get output() {
        return this._output;
    }

    set output(value) {
        this._setValueAndRaiseOnChange("_output", value);
    }

    get error() {
        return this._error;
    }

    set error(value) {
        this._setValueAndRaiseOnChange("_error", value);
    }

    get layerIndex() {
        return this._layerIndex;
    }

    set layerIndex(value) {
        this._setValueAndRaiseOnChange("_layerIndex", value);
    }

    get nodeIndex() {
        return this._nodeIndex;
    }

    set nodeIndex(value) {
        this._setValueAndRaiseOnChange("_nodeIndex", value);
    }

    get feedForwardExecuting() {
        return this._feedForwardExecuting;
    }

    set feedForwardExecuting(value) {
        this._setValueAndRaiseOnChange("_feedForwardExecuting", value);
    }

    get backPropExecuting() {
        return this._backPropExecuting;
    }

    set backPropExecuting(value) {
        this._setValueAndRaiseOnChange("_backPropExecuting", value);
    }

    get animating() {
        return this._animating;
    }

    set animating(value) {
        this._setValueAndRaiseOnChange("_animating", value);
    }

    get prevInputs() {
        return this._prevInputs;
    }

    set prevInputs(value) {
        this._setValueAndRaiseOnChange("_prevInputs", value);
    }

    get weights() {
        return this._weights;
    }

    set weights(value) {
        this._setValueAndRaiseOnChange("_weights", value);
    }

    get activationFunction() {
        return this._activationFunction;
    }

    set activationFunction(value) {
        this._setValueAndRaiseOnChange("_activationFunction", value);
    }

    get maxActivationInput() {
        if (!this.activationInput || this.activationInput.length < 0) {
            return null;
        }

        return math.max(math.ceil(math.abs(this.activationInput)));
    }

    start() {
        this.animating = true;
    }

    stop() {
        this.animating = false;
    }

    getActivationInputEquation(index, numDigits=4) {
        if (!this.prevInputs || !this.prevInputs[index] || !this.weights) {
            return "";
        }

        if (this.weights.length === 0) {
            assert (this.layerIndex === 0, "weights can only be of length 0 on input layer");
            return this.prevInputs[index][this.nodeIndex].toFixed(numDigits).toString();
        }

        assert (this.prevInputs[index].length === this.weights.length, "Lengths need to match");

        let temp = [];

        this.prevInputs[index].forEach(function (prevInput, i) {
            let toAdd = prevInput.toFixed(numDigits).toString() + " * " + this.weights[i].toFixed(numDigits).toString();
            temp.push(toAdd);
        }.bind(this));

        return temp.join(" + ");
    }

    backPropComplete() {
        this._raiseOnChangeCallbacks("_neuralNetworkNode", null, this._neuralNetworkNode);
    }
}

export default NeuralNetworkNodeDS;