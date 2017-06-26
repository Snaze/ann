import EdgeStore from "./EdgeStore";
import ArrayUtils from "../../../utils/ArrayUtils";
import ActivationFunctions from "./ActivationFunctions";
import Edge from "./Edge";

it ("createNodesInPrevLayer", () => {
    // SETUP
    let numNodesInLayers = [2, 2, 1];

    // CALL
    let toCheck = EdgeStore.createNodesInPrevLayer(numNodesInLayers);

    // ASSERT
    expect(ArrayUtils.arrayEquals(toCheck, [0, 2, 2])).toBe(true);
    expect(ArrayUtils.arrayEquals(numNodesInLayers, [2, 2, 1])).toBe(true);
});

it ("createNodesInNextLayer", () => {
    // SETUP
    let numNodesInLayers = [2, 2, 1];

    // CALL
    let toCheck = EdgeStore.createNodesInNextLayer(numNodesInLayers);

    // ASSERT
    expect(ArrayUtils.arrayEquals(toCheck, [2, 1, 0])).toBe(true);
    expect(ArrayUtils.arrayEquals(numNodesInLayers, [2, 2, 1])).toBe(true);
});

const checkEdge = function (edgeStore, layerIdx, nodeIdx, numInput, numOutput) {
    let inputEdges = edgeStore.getInputEdges(layerIdx, nodeIdx);
    let outputEdges = edgeStore.getOutputEdges(layerIdx, nodeIdx);

    expect(inputEdges.length).toBe(numInput);
    inputEdges.forEach(function (edge) {
        expect(edge).toBeInstanceOf(Edge);
        expect(edge.weight !== 0).toBe(true);
    });

    expect(outputEdges.length).toBe(numOutput);
    outputEdges.forEach(function (edge) {
        expect(edge).toBeInstanceOf(Edge);
        expect(edge.weight !== 0).toBe(true);
    });
};

it ("createEdges works", () => {
    // SETUP
    let nodesPerLayer = [2, 2, 1];
    let edgeStore = new EdgeStore(nodesPerLayer, false, ActivationFunctions.sigmoid);

    // CALL
    edgeStore.createEdges();

    // ASSERT
    checkEdge(edgeStore, 0, 0, 0, 2);
    checkEdge(edgeStore, 0, 1, 0, 2);

    checkEdge(edgeStore, 1, 0, 2, 1);
    checkEdge(edgeStore, 1, 1, 2, 1);

    checkEdge(edgeStore, 2, 0, 2, 0);


    let outputEdges = edgeStore.getOutputEdges(0, 0);
    let inputEdges = edgeStore.getInputEdges(1, 0);
    expect(inputEdges[0]).toBe(outputEdges[0]);

    outputEdges = edgeStore.getOutputEdges(1, 1);
    inputEdges = edgeStore.getInputEdges(2, 0);
    expect(inputEdges[1]).toBe(outputEdges[0]);

    let distinctEdges = [];
    for (let prop in edgeStore.edgeCache) {
        if (edgeStore.edgeCache.hasOwnProperty(prop)) {
            distinctEdges.push(edgeStore.edgeCache[prop]);
        }
    }
    expect(distinctEdges.length).toBe(6);
    distinctEdges = ArrayUtils.filter(distinctEdges, (edge) => edge !== distinctEdges[0]);
    expect(distinctEdges.length).toBe(5);
});

it ("createEdge works with bias", () => {
    // SETUP
    let edgeStore = new EdgeStore([2, 2, 1], true, ActivationFunctions.sigmoid);

    // CALL
    edgeStore.createEdges();

    // ASSERT
    checkEdge(edgeStore, 0, 0, 0, 2);
    checkEdge(edgeStore, 0, 1, 0, 2);
    checkEdge(edgeStore, 1, 0, 3, 1);
    checkEdge(edgeStore, 1, 1, 3, 1);
    checkEdge(edgeStore, 2, 0, 3, 0);
});