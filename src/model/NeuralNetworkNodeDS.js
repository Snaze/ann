import DataSourceBase from "./DataSourceBase";
import { assert } from "../utils/Assert";
import NeuralNetworkNode from "./ai/ann/NeuralNetworkNode";

class NeuralNetworkNodeDS extends DataSourceBase {

    constructor(neuralNetworkNode) {
        super();

        this._neuralNetworkNode = neuralNetworkNode;
        this._callbackRef = (e) => this._callbackRef(e);
        this._neuralNetworkNode.callback = this._callbackRef;

        this._activationInput = this._neuralNetworkNode.activationInput; // should I clone this?
        this._output = this._neuralNetworkNode.output;
        this._error = this._neuralNetworkNode.error;
        this._layerIndex = this._neuralNetworkNode.layerIndex;
        this._nodeIndex = this._neuralNetworkNode.nodeIndex;
        this._feedForwardExecuting = false;
        this._backPropExecuting = false;
    }

    _callback(e) {
        assert (e.source === this._neuralNetworkNode);

        this.activationInput = this._neuralNetworkNode.activationInput; // should I clone this?
        this.output = this._neuralNetworkNode.output;
        this.error = this._neuralNetworkNode.error;
        this.layerIndex = this._neuralNetworkNode.layerIndex;
        this.nodeIndex = this._neuralNetworkNode.nodeIndex;

        this.feedForwardExecuting = e.type === NeuralNetworkNode.EVENT_FEED_FORWARD_START;
        this.backPropExecuting = e.type === NeuralNetworkNode.EVENT_BACK_PROP_START;
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
}

export default NeuralNetworkNodeDS;