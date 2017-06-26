import ArrayUtils from "../../../utils/ArrayUtils";
import Edge from "./Edge";

class EdgeStore {

    constructor(nodesPerLayer, includeBias, activationFunction) {
        this._nodesPerLayer = ArrayUtils.copy(nodesPerLayer);
        this._nodesInNextLayer = EdgeStore.createNodesInNextLayer(this._nodesPerLayer);
        this._nodesInPrevLayer = EdgeStore.createNodesInPrevLayer(this._nodesPerLayer);
        this._activationFunction = activationFunction;
        this._includeBias = includeBias;
        this._inputEdges = null;
        this._outputEdges = null;
        this._edgeCache = null;
    }

    static createNodesInPrevLayer(nodesPerLayer) {
        // let copiedArray = ArrayUtils.copy(nodesPerLayer);
        let copiedArray =  ArrayUtils.removeByIndex(nodesPerLayer, nodesPerLayer.length - 1);
        return ArrayUtils.extend([0], copiedArray);
    }

    static createNodesInNextLayer(nodesPerLayer) {
        // let copiedArray = ArrayUtils.copy(nodesPerLayer);
        let copiedArray = ArrayUtils.removeByIndex(nodesPerLayer, 0);
        copiedArray.push(0);
        return copiedArray;
    }

    getNodesInPrevLayer(index) {
        if (this._includeBias && (index !== 0)) {
            return this._nodesInPrevLayer[index] + 1;
        }

        return this._nodesInPrevLayer[index];
    }

    getNodesInNextLayer(index) {
        return this._nodesInNextLayer[index];
    }

    createEdges() {
        let edgeCache = {};
        let inputEdges = [];
        let outputEdges = [];
        let currNumNodes = null;
        let currentEdge = null;
        let numPrevEdges = 0;
        let numNextEdges = 0;
        let edgeId;

        for (let layerIdx = 0; layerIdx < this._nodesPerLayer.length; layerIdx++) {
            currNumNodes = this._nodesPerLayer[layerIdx];
            inputEdges[layerIdx] = [];
            outputEdges[layerIdx] = [];

            for (let nodeIdx = 0; nodeIdx < currNumNodes; nodeIdx++) {

                inputEdges[layerIdx][nodeIdx] = [];
                outputEdges[layerIdx][nodeIdx] = [];

                numPrevEdges = this.getNodesInPrevLayer(layerIdx);
                numNextEdges = this.getNodesInNextLayer(layerIdx);

                for (let inputNodeIdx = 0; inputNodeIdx < numPrevEdges; inputNodeIdx++) {
                    edgeId = `${layerIdx - 1}_${inputNodeIdx}__${layerIdx}_${nodeIdx}`;

                    if (edgeId in edgeCache) {
                        currentEdge = edgeCache[edgeId];
                    } else {
                        currentEdge = new Edge(edgeId);
                        currentEdge.randomizeWeight(this._activationFunction, numPrevEdges, numNextEdges);
                        edgeCache[edgeId] = currentEdge;
                    }

                    inputEdges[layerIdx][nodeIdx][inputNodeIdx] = currentEdge;
                }

                for (let outputNodeIdx = 0; outputNodeIdx < numNextEdges; outputNodeIdx++) {
                    edgeId = `${layerIdx}_${nodeIdx}__${layerIdx + 1}_${outputNodeIdx}`;

                    if (edgeId in edgeCache) {
                        currentEdge = edgeCache[edgeId];
                    } else {
                        currentEdge = new Edge(edgeId);
                        currentEdge.randomizeWeight(this._activationFunction, numPrevEdges, numNextEdges);
                        edgeCache[edgeId] = currentEdge;
                    }

                    outputEdges[layerIdx][nodeIdx][outputNodeIdx] = currentEdge;
                }
            }
        }

        this._inputEdges = inputEdges;
        this._outputEdges = outputEdges;
        this._edgeCache = edgeCache;
    }

    getInputEdges(layerIndex, nodeIndex) {
        if (this._inputEdges === null) {
            this.createEdges();
        }

        return this._inputEdges[layerIndex][nodeIndex];
    }

    getOutputEdges(layerIndex, nodeIndex) {
        if (this._outputEdges === null) {
            this.createEdges();
        }

        return this._outputEdges[layerIndex][nodeIndex];
    }

    get edgeCache() {
        if (this._edgeCache === null) {
            this.createEdges();
        }

        return this._edgeCache;
    }
}

export default EdgeStore;