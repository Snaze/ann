import NeuralNetworkNode from "./NeuralNetworkNode";
import ActivationFunctions from "./ActivationFunctions";
import { assert } from "../../../utils/Assert";
import math from "../../../../node_modules/mathjs/dist/math";
import ArrayUtils from "../../../utils/ArrayUtils";
import MathUtil from "../MathUtil";

class NeuralNetwork {

    constructor(nodesPerLayer,
                includeBias=true,
                activationFunction=ActivationFunctions.sigmoid,
                learningRate=1.0) {
        this._nodesPerLayer = nodesPerLayer;
        this._includeBias = includeBias;
        this._activationFunction = activationFunction;
        this._learningRate = learningRate;
        this._nodes = NeuralNetwork.createNodes(nodesPerLayer, includeBias, activationFunction, learningRate);
        this._output = null;
        this._epoch = 0;
        this._totalError = 0;
        this._normalizationData = null;
        this._debug = true;
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

    static createNodes(nodesPerLayer, includeBias, activationFunction, learningRate) {

        let toRet = [];
        let layerNum = 0;
        let prevNumNodes = nodesPerLayer[0];

        nodesPerLayer.forEach(function (numNodes) {

            toRet[layerNum] = [];

            for (let nodeIndex = 0; nodeIndex < numNodes; nodeIndex++) {
                let toSet = new NeuralNetworkNode(prevNumNodes, includeBias, activationFunction);
                toSet.learningRate = learningRate;
                toRet[layerNum][nodeIndex] = toSet;
            }

            layerNum++;
            prevNumNodes = numNodes;
        });

        return toRet;
    }

    normalizeColumn(colData, saveNormalizationData=false) {
        let mean = math.mean(colData);
        let stdDev = math.std(colData);
        if (stdDev === 0) {
            stdDev = 1e-6;
        }

        let data = this.normalizeColumnWithMeanAndStdDev(colData, mean, stdDev);

        return {
            data: data,
            mean: mean,
            std: stdDev
        };
    }

    normalizeColumnWithMeanAndStdDev(colData, mean, stdDev) {
        return math.chain(colData).subtract(mean).divide(stdDev).done();
    }

    normalize(dataSet, saveNormalizationData=false) {

        if (saveNormalizationData) {
            this._normalizationData = [];
        }

        let width = ArrayUtils.width(dataSet);
        let height = ArrayUtils.height(dataSet);
        let toRet = ArrayUtils.create(height, width, 0);

        ArrayUtils.forEachColumn(dataSet, function (column, columnIndex) {
            let toSet = null;
            if (saveNormalizationData) {
                toSet = this.normalizeColumn(column);

                this._normalizationData.push({
                    mean: toSet.mean,
                    std: toSet.std,
                });

                ArrayUtils.setColumn(toRet, toSet.data, columnIndex);
            } else {
                let normalizationData = this._normalizationData[columnIndex];
                let mean = normalizationData.mean;
                let std = normalizationData.std;

                toSet = this.normalizeColumnWithMeanAndStdDev(column, mean, std);

                ArrayUtils.setColumn(toRet, toSet, columnIndex);
            }

        }.bind(this));

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


    train(inputs, expectedOutputs,
          miniBatchSize=10, normalizeInputs=true,
          maxEpochs=null, minError=null,
          minWeightDelta=null, cacheMinError=false) {
        assert (inputs.length === expectedOutputs.length, "inputs.length must equals expectedOutputs.length");

        if (normalizeInputs) {
            inputs = this.normalize(inputs, true);
        }

        let range = ArrayUtils.range(inputs.length);
        let shuffledRange;
        let miniBatchIndices = null;
        let miniBatchInputs = null;
        let miniBatchOutputs = null;
        let maxErrorForEpoch;
        let currentError = null;
        let prevWeights = null;
        let currWeights;
        let weightDelta = null;
        let minErrorWeights = null;
        let minErrorValue = Number.POSITIVE_INFINITY;
        let minErrorEpoch = this._epoch;

        while (true) {

            shuffledRange = ArrayUtils.shuffle(range);
            maxErrorForEpoch = Number.NEGATIVE_INFINITY;

            for (let i = 0; i < shuffledRange.length; i += miniBatchSize) {
                miniBatchIndices = ArrayUtils.take(shuffledRange, miniBatchSize, i);
                miniBatchInputs = ArrayUtils.select(inputs, miniBatchIndices);
                miniBatchOutputs = ArrayUtils.select(expectedOutputs, miniBatchIndices);

                let miniBatchPredictedOutputs = this.feedForward(miniBatchInputs);
                // this.feedForward(miniBatchInputs);
                this.backPropagate(miniBatchOutputs);

                currentError = NeuralNetwork.calculateMaxErrorForMiniBatch(miniBatchOutputs, miniBatchPredictedOutputs);

                maxErrorForEpoch = math.max(maxErrorForEpoch, currentError);
            }

            if (cacheMinError && maxErrorForEpoch < minErrorValue) {
                minErrorValue = maxErrorForEpoch;
                minErrorEpoch = this._epoch;
                minErrorWeights = this.getWeights();
            }

            this.log(`maxError = ${maxErrorForEpoch}`);
            this.log(`epoch = ${this._epoch}`);

            this._epoch++;

            if (maxEpochs !== null && maxEpochs < this._epoch) {
                break;
            }

            if (minError !== null && maxErrorForEpoch < minError) {
                break;
            }

            currWeights = ArrayUtils.flatten(this.getWeights());

            if (minWeightDelta !== null && prevWeights !== null)
            {
                weightDelta = MathUtil.distance(prevWeights, currWeights);

                this.log(`weightDelta = ${weightDelta}`);

                if (weightDelta < minWeightDelta) {
                    break;
                }
            }

            prevWeights = currWeights;
        }

        if (minErrorWeights !== null) {
            this.log(`setting weights found at error = ${minErrorValue} found at epoch ${minErrorEpoch}`);
            this.setWeights(minErrorWeights);
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

        return this._output;
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

        // This contains all the outgoing weight values mapped to each node
        let nextOutgoingWeights = null;
        let thisOutgoingWeights = null;

        for (let layerIndex = lastLayerIndex; layerIndex >= 0; layerIndex--) {
            thisLayerErrors = [];
            thisOutgoingWeights = [];

            for (let nodeIndex = 0; nodeIndex < this._nodes[layerIndex].length; nodeIndex++) {
                let node = this._nodes[layerIndex][nodeIndex];

                // This updates the weights of the node
                if (layerIndex === lastLayerIndex) {
                    let expectedOutputCol = ArrayUtils.getColumn(expectedOutputs, nodeIndex);
                    thisLayerErrors[nodeIndex] = node.backPropagateOutputNode(expectedOutputCol);
                } else {
                    thisLayerErrors[nodeIndex] = node.backPropagateHiddenNode(nextLayerErrors,
                        nextOutgoingWeights[nodeIndex]);
                }

                // This consolidates the weights into outgoing weights of the previous layer
                for (let prevNodeIndex = 0; prevNodeIndex < node.prevWeights.length; prevNodeIndex++) {

                    if (!thisOutgoingWeights[prevNodeIndex]) {
                        thisOutgoingWeights[prevNodeIndex] = [];
                    }

                    thisOutgoingWeights[prevNodeIndex][nodeIndex] = node.prevWeights[prevNodeIndex];
                }
            }

            nextOutgoingWeights = thisOutgoingWeights;
            nextLayerErrors = ArrayUtils.transpose(thisLayerErrors);

            this._totalError += math.sum(math.mean(math.abs(nextLayerErrors), 0));
        }

        return this._totalError;
    }

    get epochs() {
        return this._epoch;
    }

    get totalError() {
        return this._totalError;
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