import NeuralNetworkNode from "./NeuralNetworkNode";
import ActivationFunctions from "./ActivationFunctions";
import { assert } from "../../../utils/Assert";
import math from "../../../../node_modules/mathjs/dist/math";
import ArrayUtils from "../../../utils/ArrayUtils";
import MathUtil from "../MathUtil";
import moment from "../../../../node_modules/moment/moment";
import Normalizer from "./Normalizer";
import EdgeStore from "./EdgeStore";
import WeightInitializer from "./WeightInitializer";
// import NeuralNetworkParameter from "./NeuralNetworkParameter";

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

    // TODO: you really should have passed a single object into this thing containing the parameters
    // (all these classes really).
    constructor(nodesPerLayer,
                includeBias=true,
                activationFunction=ActivationFunctions.sigmoid,
                learningRate=1.0,
                weightInitializationType=WeightInitializer.COMPRESSED_NORMAL,
                callback=null) {
        this._nodesPerLayer = nodesPerLayer;
        this._includeBias = includeBias;
        this._activationFunction = activationFunction;
        this._learningRate = learningRate;
        this._edgeStore = new EdgeStore(nodesPerLayer, includeBias, activationFunction, weightInitializationType);
        this._output = null;
        this._epoch = 0;
        this._totalError = 0;
        this._normalizer = new Normalizer(activationFunction);
        this._inputsNormalized = false;
        this._debug = true;
        this._callback = callback;

        this._trainingParameter = null;
        this._prevWeights = [];
        this._minErrorWeights = null;
        this._minErrorValue = Number.POSITIVE_INFINITY;
        this._minErrorEpoch = this._epoch;
        this._epochInProgress = false;
        this._trainInterval = null;
        this._timerTickRef = (e) => this._timerTick(e);
        this._nodeCallbackRef = (e) => this._nodeCallback(e);

        this._nodes = NeuralNetwork.createNodes(nodesPerLayer, includeBias,
            activationFunction, learningRate, this._edgeStore, this._nodeCallbackRef);
    }

    get nodesPerLayer() {
        return this._nodesPerLayer;
    }

    setWeights(weights) {
        weights.forEach(function (weightLayer, layerIndex) {
            weightLayer.forEach(function (nodeWeights, nodeIndex) {
                this._nodes[layerIndex][nodeIndex].weights = nodeWeights;
            }.bind(this));
        }.bind(this));
    }

    getWeights() {
        let toRet = [];

        this._nodes.forEach(function (layer, layerIndex) {
            toRet[layerIndex] = [];

            layer.forEach(function (node, nodeIndex) {
                toRet[layerIndex][nodeIndex] = node.weights.slice(0);
            });
        });

        return toRet;
    }

    static createNodes(nodesPerLayer, includeBias, activationFunction,
                       learningRate, edgeStore, callback=null) {

        let toRet = [];
        let prevNumNodes = 0;
        // nodesPerLayer = ArrayUtils.removeByIndex(nodesPerLayer, 0);

        let nextLayerSize;

        for (let layerIdx = 0; layerIdx < nodesPerLayer.length; layerIdx++) {
            let numNodes = nodesPerLayer[layerIdx];
            let bias = layerIdx === 0 ? false : includeBias;

            toRet[layerIdx] = [];
            if (nodesPerLayer.length > (layerIdx + 1)) {
                nextLayerSize = nodesPerLayer[(layerIdx + 1)];
            } else {
                nextLayerSize = 1;
            }

            for (let nodeIndex = 0; nodeIndex < numNodes; nodeIndex++) {
                let toSet = new NeuralNetworkNode(layerIdx, nodeIndex, edgeStore, prevNumNodes,
                    nextLayerSize, bias, activationFunction);
                toSet.learningRate = learningRate;
                toRet[layerIdx][nodeIndex] = toSet;
            }

            prevNumNodes = numNodes;
        }

        return toRet;
    }

    /**
     * This will calculate the error based on the output nodes.
     *
     * @param expectedArray A 1D array of values that correspond to each output node.
     * @param actualArray A 1D array of values corresponding to the actual output
     */
    static calculateError(expectedArray, actualArray) {

        assert (expectedArray.length === actualArray.length);

        let toRet = 0;

        for (let i = 0; i < expectedArray.length; i++) {
            toRet += NeuralNetworkNode.calculateError(expectedArray[i], actualArray[i]);
        }

        return toRet;
    }

    static calculateMaxErrorForMiniBatch(expectedMiniBatch, actualMiniBatch) {

        assert (expectedMiniBatch.length === actualMiniBatch.length);
        assert (expectedMiniBatch.length > 0);

        let maxError = Number.NEGATIVE_INFINITY;
        let currentError = null;

        for (let i = 0 ; i < expectedMiniBatch.length; i++) {
            currentError = NeuralNetwork.calculateError(expectedMiniBatch[i], actualMiniBatch[i]);

            maxError = math.max(maxError, currentError);
        }

        return maxError;
    }

    log(toLog) {
        if (!!console && this._debug) {
            console.log(toLog);
        }
    }

    /**
     *
     * @param trainingParameter {NeuralNetworkParameter} All the params to train with.
     * @returns {number} Ignore this value.  It's for the unit tests. TODO: clean this up.
     */
    train(trainingParameter) {

        assert (trainingParameter.inputs.length === trainingParameter.expectedOutputs.length, "inputs.length must equals expectedOutputs.length");

        // this._inputs = inputs;
        // this._expectedOutputs = expectedOutputs;
        this._trainingParameter = trainingParameter;
        this._minErrorWeights = null;
        this._minErrorValue = Number.POSITIVE_INFINITY;
        this._minErrorEpoch = this._epoch;
        this._epoch = 0;
        this._inputsNormalized = this._trainingParameter.normalizeInputs;

        if (this._trainingParameter.normalizeInputs) {
            this._trainingParameter.inputs = this._normalizer.normalize(this._trainingParameter.inputs, true);
        }

        let startTime = moment();
        let error = this.trainOne(trainingParameter);
        let endTime = moment();

        if (trainingParameter.maxEpochs <= this._epoch) {
            this.stopTimer(NeuralNetwork.NEURAL_NETWORK_TRAINING_COMPLETE);
            return error;
        }

        let duration = moment.duration(endTime.diff(startTime));
        let milliSecDuration = duration.asMilliseconds() + 200; // + 200 for buffer
        // let milliSecDuration = 5000;
        this.log(`Training at every ${milliSecDuration}ms interval`);

        error = 0;

        this.stopTimer();
        this._trainInterval = setInterval(function (e) {
            error = this._timerTickRef(trainingParameter);
        }.bind(this), milliSecDuration);

        return error;
    }

    stopTimer(type=null) {
        if (this._trainInterval !== null) {
            clearInterval(this._trainInterval);
            this._trainInterval = null;
        }

        if (this._minErrorWeights !== null) {
            this.log(`setting weights found at error = ${this._minErrorValue} found at epoch ${this._minErrorEpoch}`);
            this.setWeights(this._minErrorWeights);
            this._minErrorWeights = null;
        }

        if (!!this._callback && type !== null) {
            this._callback({
                type: type,
                source: this
            });
        }
    }

    /**
     *
     * @param trainParameter {NeuralNetworkParameter}
     * @returns {*}
     * @private
     */
    _timerTick(trainParameter) {
        if (this._epochInProgress) {
            return;
        }
        let startTime = moment();

        this._epochInProgress = true;
        let maxErrorForEpoch;

        try {
            let maxEpochs = trainParameter.maxEpochs;
            let minError = trainParameter.minError;
            let minWeightDelta = trainParameter.minWeightDelta;

            let currWeights;
            let weightDelta = null;

            maxErrorForEpoch = this.trainOne(trainParameter);

            this.log(`maxError = ${maxErrorForEpoch}`);
            this.log(`epoch = ${this._epoch}`);

            if (minWeightDelta !== null)
            {
                currWeights = ArrayUtils.flatten(this.getWeights());

                if (this._prevWeights !== null) {
                    weightDelta = MathUtil.distance(this._prevWeights, currWeights);

                    this.log(`weightDelta = ${weightDelta}`);

                    if (weightDelta < minWeightDelta) {
                        this.stopTimer(NeuralNetwork.NEURAL_NETWORK_TRAINING_COMPLETE);
                        return;
                    }
                }

                this._prevWeights = currWeights;
            }

            if ((minError !== null && maxErrorForEpoch <= minError) ||
                (maxEpochs !== null && maxEpochs <= this._epoch)) {

                this.stopTimer(NeuralNetwork.NEURAL_NETWORK_TRAINING_COMPLETE);

            }

        } catch (e) {
            if (!!console) {
                console.log(e);
            }
        } finally {
            this._epochInProgress = false;
        }

        let endTime = moment();
        let duration = moment.duration(endTime.diff(startTime));
        let milliSecDuration = duration.asMilliseconds();
        this.log(`TimerTick took ${milliSecDuration}ms`);

        return maxErrorForEpoch;
    }

    /**
     *
     * @param trainingData {NeuralNetworkParameter}
     * @returns {Number}
     */
    trainOne(trainingData) {
        let inputs = trainingData._inputs;
        let expectedOutputs = trainingData._expectedOutputs;

        let miniBatchSize = trainingData.miniBatchSize;
        let cacheMinError = trainingData.cacheMinError;

        let range = ArrayUtils.range(inputs.length);
        let shuffledRange = ArrayUtils.shuffle(range);
        let miniBatchIndices = null;
        let miniBatchInputs = null;
        let miniBatchOutputs = null;
        let maxErrorForEpoch = Number.NEGATIVE_INFINITY;
        let currentError = null;

        assert (inputs.length === expectedOutputs.length, "inputs.length must equals expectedOutputs.length");

        for (let i = 0; i < shuffledRange.length; i += miniBatchSize) {
            miniBatchIndices = ArrayUtils.take(shuffledRange, miniBatchSize, i);
            miniBatchInputs = ArrayUtils.selectByIndices(inputs, miniBatchIndices);
            miniBatchOutputs = ArrayUtils.selectByIndices(expectedOutputs, miniBatchIndices);

            let miniBatchPredictedOutputs = this.feedForward(miniBatchInputs);
            this.backPropagate(miniBatchOutputs);

            currentError = NeuralNetwork.calculateMaxErrorForMiniBatch(miniBatchOutputs, miniBatchPredictedOutputs);

            maxErrorForEpoch = math.max(maxErrorForEpoch, currentError);
        }

        if (maxErrorForEpoch < this._minErrorValue) {
            this._minErrorValue = maxErrorForEpoch;
            this._minErrorEpoch = this._epoch;

            if (cacheMinError) {
                this._minErrorWeights = this.getWeights();
            }
        }

        this._epoch++;

        if (!!this._callback) {
            this._callback({
                type: NeuralNetwork.NEURAL_NETWORK_EPOCH_COMPLETE,
                source: this
            });
        }

        return maxErrorForEpoch;
    }

    feedForward(inputMiniBatch) {

        let prevLayerOutput = inputMiniBatch;
        let layer = null;
        let node = null;
        let layerOutput = null;

        for (let layerIndex = 0; layerIndex < this._nodes.length; layerIndex++) {
            layer = this._nodes[layerIndex];
            layerOutput = [];

            for (let nodeIndex = 0; nodeIndex < layer.length; nodeIndex++) {
                node = layer[nodeIndex];

                layerOutput[nodeIndex] = node.feedForward(prevLayerOutput);
            }

            prevLayerOutput = ArrayUtils.transpose(layerOutput);
        }

        this._output = prevLayerOutput;

        if (!!this._callback) {
            this._callback({
                type: NeuralNetwork.NEURAL_NETWORK_FEED_FORWARD_COMPLETE,
                source: this
            });
        }

        return this._output;
    }

    predict(inputMiniBatch) {
        if (this._inputsNormalized) {
            inputMiniBatch = this._normalizer.normalize(inputMiniBatch);
        }

        return this.feedForward(inputMiniBatch);
    }

    /**
     * This should be used to backPropagate which makes the NN learn.
     *
     * @param expectedOutputs An array representing what the actual value of the Neural Network should be.
     */
    backPropagate(expectedOutputs) {

        this._totalError = 0;
        let lastLayerIndex = (this._nodes.length - 1);

        // This is the error for each node in the next layer.
        let nextLayerErrors = null;
        let thisLayerErrors = null;

        for (let layerIndex = lastLayerIndex; layerIndex >= 0; layerIndex--) {
            thisLayerErrors = [];

            for (let nodeIndex = 0; nodeIndex < this._nodes[layerIndex].length; nodeIndex++) {
                let node = this._nodes[layerIndex][nodeIndex];

                // This updates the weights of the node
                if (layerIndex === lastLayerIndex) {
                    let expectedOutputCol = ArrayUtils.getColumn(expectedOutputs, nodeIndex);
                    thisLayerErrors[nodeIndex] = node.backPropagateOutputNode(expectedOutputCol);
                } else {

                    thisLayerErrors[nodeIndex] = node.backPropagateHiddenNode(nextLayerErrors);
                }
            }

            nextLayerErrors = ArrayUtils.transpose(thisLayerErrors);

            this._totalError += math.sum(math.abs(math.mean(nextLayerErrors, 0)));
        }

        if (!!this._callback) {
            this._callback({
                type: NeuralNetwork.NEURAL_NETWORK_BACK_PROP_COMPLETE,
                source: this
            });
        }

        return this._totalError;
    }

    get epochs() {
        return this._epoch;
    }

    get totalError() {
        return this._totalError;
    }

    get callback() {
        return this._callback;
    }

    set callback(value) {
        this._callback = value;
    }

    get includeBias() {
        return this._includeBias;
    }



    /**
     * Iterates over all the nodes.
     *
     * @param theFunction Function with the following signature theFunction(node, nodeIndex, layerIndex);
     */
    iterateOverNodes(theFunction) {
        this._nodes.forEach(function (layer, layerIndex) {
            layer.forEach(function (node, nodeIndex) {
                theFunction (node, nodeIndex, layerIndex);
            });
        });
    }
}

export default NeuralNetwork;