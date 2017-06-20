import NeuralNetworkNode from "./NeuralNetworkNode";
import ActivationFunctions from "./ActivationFunctions";
import { assert } from "../../../utils/Assert";

class NeuralNetwork {

    constructor(nodesPerLayer, includeBias=true, activationFunction=ActivationFunctions.sigmoid) {
        this._nodesPerLayer = nodesPerLayer;
        this._includeBias = includeBias;
        this._activationFunction = activationFunction;
        this._nodes = NeuralNetwork.createNodes(nodesPerLayer, includeBias, activationFunction);
        this._output = null;
        this._feedForwardEpoch = 0;
        this._backPropagateEpoch = 0;
    }

    setWeights(weights) {
        weights.forEach(function (weightLayer, layerIndex) {
            weightLayer.forEach(function (nodeWeights, nodeIndex) {
                this._nodes[layerIndex][nodeIndex].weights = nodeWeights;
            }.bind(this));
        }.bind(this));
    }

    static createNodes(nodesPerLayer, includeBias, activationFunction) {

        let toRet = [];
        let layerNum = 0;
        let prevNumNodes = nodesPerLayer[0];

        nodesPerLayer.forEach(function (numNodes) {

            toRet[layerNum] = [];

            for (let nodeIndex = 0; nodeIndex < numNodes; nodeIndex++) {
                toRet[layerNum][nodeIndex] = new NeuralNetworkNode(prevNumNodes, includeBias, activationFunction);
            }

            layerNum++;
            prevNumNodes = numNodes;
        });

        return toRet;
    }

    feedForward(input) {

        assert (this._feedForwardEpoch === this._backPropagateEpoch, "You must feedForward then backprop");

        let prevLayerOutput = input;

        this._nodes.forEach(function (layer) {

            let layerOutput = [];

            layer.forEach(function (node, nodeIndex) {
                layerOutput[nodeIndex] = node.feedForward(prevLayerOutput);
            });

            prevLayerOutput = layerOutput;
        });

        this._output = prevLayerOutput;
        this._feedForwardEpoch++;

        return this._output;
    }

    /**
     * This should be used to backPropagate which makes the NN learn.
     *
     * @param expectedOutputs An array representing what the actual value of the Neural Network should be.
     */
    backPropagate(expectedOutputs) {

        assert ((this._backPropagateEpoch + 1) === this._feedForwardEpoch,
            "You are calling backProp and feedForward out of sync");

        let lastLayerIndex = (this._nodes.length - 1);

        // This is the error for each node in the next layer.
        let nextLayerErrors = null;
        let thisLayerErrors = null;

        // This contains all the outgoing weight values mapped to each node
        let nextOutgoingWeights = null;
        let thisOutgoingWeights = null;

        for (let layerIndex = lastLayerIndex; layerIndex >= 0; layerIndex--) {
            thisLayerErrors = [];

            for (let nodeIndex = 0; nodeIndex < this._nodes[layerIndex].length; nodeIndex++) {
                let node = this._nodes[layerIndex][nodeIndex];

                if (layerIndex === lastLayerIndex) {
                    thisLayerErrors[nodeIndex] = node.backPropagateOutputNode(expectedOutputs[nodeIndex]);
                } else {
                    thisLayerErrors[nodeIndex] = node.backPropagateHiddenNode(nextLayerErrors,
                        nextOutgoingWeights[nodeIndex]);
                }
            }

            let prevLayerIndex = layerIndex - 1;
            thisOutgoingWeights = [];

            if (prevLayerIndex >= 0) {
                // TODO: There may be a more efficient way of doing this by storing the weights in a graph structure
                //       so you wouldn't need to do this extra looping
                for (let prevNodeIndex = 0; prevNodeIndex < this._nodes[prevLayerIndex].length; prevNodeIndex++) {
                    thisOutgoingWeights[prevNodeIndex] = [];

                    for (let nextNodeIndex = 0; nextNodeIndex < this._nodes[layerIndex].length; nextNodeIndex++) {
                        let nextNode = this._nodes[layerIndex][nextNodeIndex];

                        thisOutgoingWeights[prevNodeIndex][nextNodeIndex] = nextNode.weights[prevNodeIndex];
                    }
                }
            }

            nextOutgoingWeights = thisOutgoingWeights;
            nextLayerErrors = thisLayerErrors;
        }

        this._backPropagateEpoch++;
    }

    get epoch() {
        return this._feedForwardEpoch;
    }
}

export default NeuralNetwork;