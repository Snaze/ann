import { assert } from "../../../../utils/Assert";
import ArrayUtils from "../../../../utils/ArrayUtils";
// import MathUtil from "../../MathUtil";
// import moment from "../../../../../node_modules/moment/moment";
// import Normalizer from "../Normalizer";
// import WeightInitializer from "../WeightInitializer";
// import Layer from "./Layer";
import { Matrix, Vector } from "vectorious";


const neural_network_feed_forward_complete = 0;
const neural_network_back_prop_complete = 1;
const neural_network_epoch_complete = 2;
const neural_network_training_complete = 3;
const all = [
    neural_network_feed_forward_complete,
    neural_network_back_prop_complete,
    neural_network_epoch_complete,
    neural_network_training_complete
];

class NeuralNetwork {

    static get NEURAL_NETWORK_FEED_FORWARD_COMPLETE() { return neural_network_feed_forward_complete; }
    static get NEURAL_NETWORK_BACK_PROP_COMPLETE() { return neural_network_back_prop_complete; }
    static get NEURAL_NETWORK_EPOCH_COMPLETE() { return neural_network_epoch_complete; }
    static get NEURAL_NETWORK_TRAINING_COMPLETE() { return neural_network_training_complete; }
    static get ALL_CALLBACKS() { return all; }

    /**
     * The Constructor for the Neural Network.
     *
     * @param normalizer {Normalizer} This class is responsible for normalization.
     * @param callback {Function} This should be a callback that gets fired at certain points in the NN
     * lifecycle.
     * @param weightInitializer {WeightInitializer} WeightInitializer to initialization network
     * @param includeBias {boolean} true to include bias input into layer.
     * @constructor
     */
    constructor(normalizer,
                weightInitializer,
                includeBias=true,
                callback=null) {
        this._normalizer = normalizer;
        this._weightInitializer = weightInitializer;
        this._includeBias = includeBias;
        this._callback=callback;
        this._layers = [];
        this._weights = null;

        this._epoch = 0;
    }

    /**
     * This will add a layer to this NN
     * @param layer {Layer} the layer you wish to add.
     * @returns {NeuralNetwork} this object (builder pattern)
     */
    addLayer(layer) {
        // layer.hasBias = false;
        //
        // let prevIndex = this._layers.length - 1;
        // if (prevIndex >= 0) {
        //     this._layers[prevIndex].hasBias = this.includeBias;
        // }

        layer.hasBias = this.includeBias;

        this._layers.push(layer);

        return this;
    }

    /**
     * Remove the layer located at the index
     * @param index {Number} the index you wish to remove.
     */
    removeLayer(index) {
        this._layers = ArrayUtils.removeByIndex(this._layers, index);
        return this;
    }

    /**
     * Use this method to feedForward the network.
     *
     * n = # of inputs / # of incoming weights per node
     * m = # of records in mini-batch
     * r = # of nodes in next layer / # of error values in next layer / # of outgoing weights
     * p = # of nodes in current layer / "this._numNodes"
     *
     * @param inputMiniBatch {Array} This should be a (m x n) 2D Array containing the
     * normalized miniBatch for this layer.
     * @returns {*|null}
     */
    feedForward(inputMiniBatch) {

        let miniBatchMatrix = new Matrix(inputMiniBatch);
        // let originalWidth = miniBatchMatrix.shape[1];
        let currentLayer, currentWeights;

        let prevLayerOutput = miniBatchMatrix;

        for (let i = 0; i < this.layers.length; i++) {
            currentLayer = this.layers[i];
            currentWeights = this.weights[i];

            prevLayerOutput = currentLayer.feedForward(currentWeights, prevLayerOutput);
        }

        return prevLayerOutput.toArray();
    }

    /**
     * Use this network to back propagate the network.
     *
     * n = # of inputs / # of incoming weights per node
     * m = # of records in mini-batch
     * r = # of nodes in next layer / # of error values in next layer / # of outgoing weights
     * p = # of nodes in current layer / "this._numNodes"
     *
     * @param expectedOutputs {Array} This should be a (m x p) Array representing
     * the expected outputs of the last layer in the network.  Note that (p === r) in this case.
     */
    backPropagate(expectedOutputs) {

        let expectedOutputsMatrix = new Matrix(expectedOutputs);
        let totalError = 0,
            lastLayerIndex = this._layers.length - 1,
            inputWeights = null,
            nextLayerErrors = expectedOutputsMatrix,
            newWeights = ArrayUtils.create1D(this.weights.length, null);
        let currLayer, outputWeights;

        for (let layerIndex = lastLayerIndex; layerIndex >= 0; layerIndex--) {
            currLayer = this.layers[layerIndex];

            outputWeights = null;

            if (inputWeights !== null) {
                outputWeights = inputWeights.transpose(); // HMMMMMMMMM
            }

            inputWeights = this.weights[layerIndex];

            newWeights[layerIndex] = currLayer.backProp(inputWeights, outputWeights, nextLayerErrors, this.epoch);
            nextLayerErrors = currLayer.errors;
        }

        this._weights = newWeights;

        this._fireCallback(NeuralNetwork.NEURAL_NETWORK_BACK_PROP_COMPLETE);

        return totalError;
    }

    /**
     * This will create the weights to be used in this neural network.
     *
     * It will return an Array of Matrix objects, where each Matrix object
     * is of size (n x p).
     *
     * n = # of inputs / # of incoming weights per node
     * p = # of nodes in current layer / "this._numNodes"
     *
     * @private
     */
    _createWeights() {
        assert (this._layers.length >= 2, "You must have at least 2 layers");

        let toRet = [null];
        let prevNodes = this._layers[0].numNodes;
        let currNodes, totalNodes, currArray, currVector, currMatrix, currLayer;

        for (let i = 1; i < this._layers.length; i++) {
            currLayer = this._layers[i];
            currNodes = currLayer.numNodes;

            if (currLayer.hasBias) {
                prevNodes++;
            }

            totalNodes = prevNodes * currNodes;

            currArray = [];

            for (let i = 0; i < totalNodes; i++) {
                currArray[i] = this._weightInitializer.createRandomWeight(prevNodes, currNodes);
            }

            currVector = new Vector(currArray);
            currMatrix = new Matrix(currVector, {shape: [prevNodes, currNodes]});
            toRet[i] = currMatrix;
            prevNodes = currNodes;
        }

        return toRet;
    }

    /**
     * This will return the weights for all layers of the neural network.  Think of these
     * as input weights for the corresponding layer.  Note that the first layer has no weights
     * so it's weight value is null.
     *
     * @returns {Array} An array of Matrix types
     */
    get weights() {
        if (this._weights === null) {
            this._weights = this._createWeights();
        }

        return this._weights;
    }

    /**
     * This will set the Array of weights objects.
     *
     * @param value {Array} These are the weights to set.  Note that the first weight must be null (for the input
     * layer).
     */
    set weights(value) {
        assert (value[0] === null, "First weights matrix must be null");

        let toSet = [null];

        for (let i = 1; i < value.length; i++) {
            toSet[i] = new Matrix(value[i]);
        }

        this._weights = toSet;
    }

    /**
     * This will return all the layers of this network.  Do not modify this array directly.
     * @returns {Array}
     */
    get layers() {
        return this._layers;
    }

    /**
     * This returns the current epoch number.
     * @returns {number} The current epoch number.
     */
    get epoch() {
        return this._epoch;
    }

    /**
     * This sets the current epoch number
     * @param value {number} The current epoch number.
     */
    set epoch(value) {
        this._epoch = value;
    }

    /**
     * This specifies whether or not this NN should include a bias term with a 1 value for all layers
     * @returns {boolean}
     */
    get includeBias() {
        return this._includeBias;
    }

    /**
     * This specifies whether or not this NN should include a bias term with a 1 value for all layers
     * @param value {boolean}
     */
    set includeBias(value) {
        this._includeBias = value;
    }

    /**
     * This method will fire the callback.
     * @param type {Number} Use one of the static props at the top of this class NEURAL_NETWORK_FEED_FORWARD_*
     * @private
     */
    _fireCallback(type) {
        if (!!this._callback) {
            this._callback({
                type: type,
                source: this
            });
        }
    }


}

export default NeuralNetwork;