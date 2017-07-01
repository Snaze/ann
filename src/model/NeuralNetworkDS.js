import DataSourceBase from "./DataSourceBase";
import NeuralNetwork from "./ai/ann/NeuralNetwork";
import NeuralNetworkNodeDS from "./NeuralNetworkNodeDS";
import ArrayUtils from "../utils/ArrayUtils";

class NeuralNetworkDS extends DataSourceBase {

    constructor(neuralNetwork) {
        super();

        this._nnCallbackRef = (e) => this._nnCallback(e);
        this._updateFromSourceRef = (e) => this._updateFromSource(e);

        this._neuralNetwork = neuralNetwork;
        this._neuralNetworkOriginalCallback = this._neuralNetwork.callback;
        this._neuralNetwork.callback = this._nnCallbackRef;
        this._nodes = NeuralNetworkDS.createNeuralNetworkNodes(neuralNetwork);

        this._totalError = neuralNetwork.totalError;
        this._epochs = neuralNetwork.epochs;
        this._nodesPerLayer = neuralNetwork.nodesPerLayer;
        this._includeBias = neuralNetwork.includeBias;
        this._weights = neuralNetwork.getWeights();

        this._callbackFunctions = {};
        this._callbackFunctions[NeuralNetwork.NEURAL_NETWORK_FEED_FORWARD_COMPLETE] = this._updateFromSourceRef;
        this._callbackFunctions[NeuralNetwork.NEURAL_NETWORK_EPOCH_COMPLETE] = this._updateFromSourceRef;
        this._callbackFunctions[NeuralNetwork.NEURAL_NETWORK_BACK_PROP_COMPLETE] = this._updateFromSourceRef;
        this._callbackFunctions[NeuralNetwork.NEURAL_NETWORK_TRAINING_COMPLETE] = this._updateFromSourceRef;
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
        if (!!this._neuralNetworkOriginalCallback) {
            this._neuralNetworkOriginalCallback(e);
        }

        if (!!this._callbackFunctions[e.type]) {
            // Limit the updates
            if (e.type === NeuralNetwork.NEURAL_NETWORK_EPOCH_COMPLETE) {

                this._callbackFunctions[e.type](e.source);
                ArrayUtils.traverse2D(this._nodes, (node) => node.backPropComplete());
            }

            // console.log("!!this._callbackFunctions[e.type]");
        } else {
            throw new Error("Unknown Neural Network Event");
        }


        // console.log("_nnCallback callback");
    }

    _updateFromSource(nn) {
        this._totalError = nn.totalError;
        this._epochs = nn.epochs;
        this._nodesPerLayer = nn.nodesPerLayer;
        this._includeBias = nn.includeBias;
        this._weights = nn.getWeights();
        this._raiseOnChangeCallbacks("_neuralNetwork", null, this.neuralNetwork);
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

    /**
     *
     * @param nnParameter {NeuralNetworkParameter}
     */
    train(nnParameter) {

        let originalCallback = this.neuralNetwork.callback;

        this.neuralNetwork.callback = function (e) {
            if (e.type === NeuralNetwork.NEURAL_NETWORK_TRAINING_COMPLETE) {
                this.stop();

                if (!!originalCallback) {
                    // TODO: WHOA THIS IS WHACK - Add an add / remove handler for this event on the NN object
                    originalCallback(e);
                    this.neuralNetwork.callback = originalCallback;
                }
            } else {
                originalCallback(e);
            }
        }.bind(this);

        this.neuralNetwork.train(nnParameter);
        ArrayUtils.traverse2D(this._nodes, (item) => item.start());
    }

    stop() {
        this._neuralNetwork.stopTimer();

        ArrayUtils.traverse2D(this._nodes, (item) => item.stop());
    }

    getNeuralNetworkNode(layerIndex, nodeIndex) {
        return this._nodes[layerIndex][nodeIndex];
    }
}

export default NeuralNetworkDS;