import NeuralNetworkNode from "./NeuralNetworkNode";
import ActivationFunctions from "./ActivationFunctions";
// import { assert } from "../../../utils/Assert";
import math from "../../../../node_modules/mathjs/dist/math";
import Array2D from "../../../../node_modules/array2d/dist/Array2D.min";

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
        this._backPropagateEpoch = 0;
        this._totalError = 0;

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

            prevLayerOutput = Array2D.transpose(layerOutput);
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
                    thisLayerErrors[nodeIndex] = node.backPropagateOutputNode(expectedOutputs[nodeIndex]);
                } else {
                    thisLayerErrors[nodeIndex] = node.backPropagateHiddenNode(nextLayerErrors,
                        nextOutgoingWeights[nodeIndex]);
                }

                // This consolidates the weights into outgoing weights of the previous layer
                for (let prevNodeIndex = 0; prevNodeIndex < node.weights.length; prevNodeIndex++) {

                    if (!thisOutgoingWeights[prevNodeIndex]) {
                        thisOutgoingWeights[prevNodeIndex] = [];
                    }

                    thisOutgoingWeights[prevNodeIndex][nodeIndex] = node.weights[prevNodeIndex];
                }
            }

            nextOutgoingWeights = thisOutgoingWeights;
            nextLayerErrors = Array2D.transpose(thisLayerErrors);

            this._totalError += math.sum(math.mean(math.abs(nextLayerErrors), 0));
        }

        this._backPropagateEpoch++;
        return this._totalError;
    }

    get epochs() {
        return this._backPropagateEpoch;
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