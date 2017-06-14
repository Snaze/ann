import Graph from "./Graph";
import Edge from "./Edge";

it ("Constructor should work", () => {
   let graph = new Graph();

   expect(graph !== null).toBe(true);
});

it ("Test addVertex", () => {
    // SETUP
    let graph = new Graph();

    // ADD
    graph.addVertex("0_0");

    // EXPECT
    expect(graph.containsVertex("0_0")).toBe(true);
});

it ("Test removeVertex", () => {
    // SETUP
    let graph = new Graph();
    graph.addVertex("0");

    // CALL
    graph.removeVertex("0");

    // ASSERT
    expect(graph.containsVertex("0")).toBe(false);
});

it ("test iterate vertices", () => {
    // SETUP
    let graph = new Graph();
    graph.addVertex("0");
    let callbackFired = false;
    const theCallback = function (vertexId) {
        if (vertexId === "0") {
            callbackFired = true;
        }
    };

    // CALL
    graph.iterateVertices(theCallback);

    // ASSERT
    expect(callbackFired).toBe(true);

});

it ("test add edge", () => {
    // SETUP
    let graph = new Graph();
    graph.addVertex("0");
    graph.addVertex("1");
    let toAdd = new Edge("0", "1");

    // CALL
    graph.addEdge(toAdd);

    // ASSERT
    expect(graph.containsEdge(toAdd)).toBe(true);
});

it ("test remove edge", () => {
    // SETUP
    let graph = new Graph();
    graph.addVertex("0");
    graph.addVertex("1");
    let edge = new Edge("0", "1");
    graph.addEdge(edge);

    // CALL
    graph.removeEdge(edge);

    // ASSERT
    expect(graph.containsEdge(edge)).toBe(false);
    expect(graph.edgeCount).toBe(0);
    expect(graph.vertexCount).toBe(2);
});

it ("iterate over edges", () => {
    // SETUP
    let graph = new Graph();
    graph.addVertex("0");
    graph.addVertex("1");
    let edge = new Edge("0", "1");
    graph.addEdge(edge);
    let called = false;

    // CALL
    graph.iterateEdges(function (otherEdge) {
        if (edge.equals(otherEdge)) {
            called = true;
        }
    });

    // ASSERT
    expect(called).toBe(true);
});