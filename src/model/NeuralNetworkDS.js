import DataSourceBase from "./DataSourceBase";
import NeuralNetwork from "./ai/ann/NeuralNetwork";
import NeuralNetworkNodeDS from "./NeuralNetworkNodeDS";

class NeuralNetworkDS extends DataSourceBase {

    constructor(neuralNetwork) {
        super();

        this._neuralNetwork = neuralNetwork;
        this._neuralNetwork.callback = this._nnCallbackRef;
        this._nodes = NeuralNetworkDS.createNeuralNetworkNodes(neuralNetwork);
        this._nnCallbackRef = (e) => this._nnCallback(e);
        this._totalError = neuralNetwork.totalError;
        this._epochs = neuralNetwork.epochs;
        this._nodesPerLayer = neuralNetwork.nodesPerLayer;
        this._includeBias = neuralNetwork.includeBias;
        this._weights = neuralNetwork.getWeights();

        this._callbackFunctions = {};
        this._callbackFunctions[NeuralNetwork.NEURAL_NETWORK_FEED_FORWARD_COMPLETE] = this._updateFromSource;
        this._callbackFunctions[NeuralNetwork.NEURAL_NETWORK_EPOCH_COMPLETE] = this._updateFromSource;
        this._callbackFunctions[NeuralNetwork.NEURAL_NETWORK_BACK_PROP_COMPLETE] = this._updateFromSource;
        this._callbackFunctions[NeuralNetwork.NEURAL_NETWORK_TRAINING_COMPLETE] = this._updateFromSource;
    }

    static createNeuralNetworkNodes(nn) {
        let toRet = [];

        nn.iterateOverNodes(function (node, nodeIndex, layerIndex) {
            if (typeof(toRet[layerIndex]) === "undefined") {
                toRet[layerIndex] = [];
            }

            toRet[layerIndex][nodeIndex] = new NeuralNetworkNodeDS(node);
        });

        return toRet;
    }

    get neuralNetwork() {
        return this._neuralNetwork;
    }

    _nnCallback(e) {
        if (!!this._callbackFunctions[e.type]) {
            this._callbackFunctions[e.type](e.source);
        } else {
            throw new Error("Unknown Neural Network Event");
        }
    }

    _updateFromSource(nn) {
        this.totalError = nn.totalError;
        this.epochs = nn.epochs;
        this.nodesPerLayer = nn.nodesPerLayer;
        this.includeBias = nn.includeBias;
        this.weights = nn.getWeights();
    }

    get totalError() {
        return this._totalError;
    }

    set totalError(value) {
        this._setValueAndRaiseOnChange("_totalError", value);
    }

    get epochs() {
        return this._epochs;
    }

    set epochs(value) {
        this._setValueAndRaiseOnChange("_epochs", value);
    }

    get nodes() {
        return this._nodes;
    }

    get nodesPerLayer() {
        return this._nodesPerLayer;
    }

    set nodesPerLayer(value) {
        this._setValueAndRaiseOnChange("_nodesPerLayer", value);
    }

    get includeBias() {
        return this._includeBias;
    }

    set includeBias(value) {
        this._setValueAndRaiseOnChange("_includeBias", value);
    }

    get weights() {
        return this._weights;
    }

    set weights(value) {
        this._setValueAndRaiseOnChange("_weights", value);
    }
}

export default NeuralNetworkDS;