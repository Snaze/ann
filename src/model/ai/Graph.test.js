import Graph from "./Graph";

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

    // CALL
    graph.addEdge("0", "1");

    // ASSERT
    expect(graph.containsEdge("0", "1")).toBe(true);
});

it ("test remove edge", () => {
    // SETUP
    let graph = new Graph();
    graph.addVertex("0");
    graph.addVertex("1");
    graph.addEdge("0", "1");

    // CALL
    graph.removeEdge("0", "1");

    // ASSERT
    expect(graph.containsEdge("0", "1")).toBe(false);
    expect(graph.edgeCount).toBe(0);
    expect(graph.vertexCount).toBe(2);
});

it ("iterate over edges", () => {
    // SETUP
    let graph = new Graph();
    graph.addVertex("0");
    graph.addVertex("1");
    graph.addEdge("0", "1");
    let called = false;

    // CALL
    graph.iterateEdges(function (vertexId1, vertexId2) {
        if (vertexId1 === "0" && vertexId2 === "1") {
            called = true;
        }
    });

    // ASSERT
    expect(called).toBe(true);
});

const createTestGraph = function () {
    let toRet = new Graph();

    toRet.addVertex("0");
    toRet.addVertex("1");
    toRet.addVertex("2");
    toRet.addVertex("3");
    toRet.addVertex("4");
    toRet.addVertex("5");
    toRet.addVertex("6");
    toRet.addVertex("7");
    toRet.addVertex("8");

    toRet.addEdge("0", "1");
    toRet.addEdge("0", "2");
    toRet.addEdge("0", "3");

    toRet.addEdge("1", "4");
    toRet.addEdge("1", "5");

    toRet.addEdge("2", "6");

    toRet.addEdge("3", "7");
    toRet.addEdge("3", "8");

    return toRet;
};

it ("check breadthFirstSearch traverses each node", () => {
    // SETUP
    let graph = createTestGraph();
    let traversedVerts = [];
    const callback = function (vert) {
        traversedVerts.push(vert.id);
    };

    // CALL
    graph.breadthFirstSearch("0", callback);

    // ASSERT
    expect(traversedVerts.length).toBe(9);
    expect(traversedVerts.indexOf("0") >= 0).toBe(true);
    expect(traversedVerts.indexOf("1") >= 0).toBe(true);
    expect(traversedVerts.indexOf("2") >= 0).toBe(true);
    expect(traversedVerts.indexOf("3") >= 0).toBe(true);
    expect(traversedVerts.indexOf("4") >= 0).toBe(true);
    expect(traversedVerts.indexOf("5") >= 0).toBe(true);
    expect(traversedVerts.indexOf("6") >= 0).toBe(true);
    expect(traversedVerts.indexOf("7") >= 0).toBe(true);
    expect(traversedVerts.indexOf("8") >= 0).toBe(true);
});

it ("check breadthFirstSearch traverses all but 2nd layer", () => {
    // SETUP
    let graph = createTestGraph();
    let traversedVerts = [];
    const callback = function (vert) {
        traversedVerts.push(vert.id);
    };

    // CALL
    graph.breadthFirstSearch("0", callback, [], 1);

    // ASSERT
    expect(traversedVerts.length).toBe(4);
    expect(traversedVerts.indexOf("0") >= 0).toBe(true);
    expect(traversedVerts.indexOf("1") >= 0).toBe(true);
    expect(traversedVerts.indexOf("2") >= 0).toBe(true);
    expect(traversedVerts.indexOf("3") >= 0).toBe(true);
    expect(traversedVerts.indexOf("4") >= 0).toBe(false);
    expect(traversedVerts.indexOf("5") >= 0).toBe(false);
    expect(traversedVerts.indexOf("6") >= 0).toBe(false);
    expect(traversedVerts.indexOf("7") >= 0).toBe(false);
    expect(traversedVerts.indexOf("8") >= 0).toBe(false);
});

it ("check breadthFirstSearch ignores 3 branch", () => {
    // SETUP
    let graph = createTestGraph();
    let traversedVerts = [];
    const callback = function (vert) {
        traversedVerts.push(vert.id);
    };

    // CALL
    graph.breadthFirstSearch("0", callback, ["3"]);

    // ASSERT
    expect(traversedVerts.length).toBe(6);
    expect(traversedVerts.indexOf("0") >= 0).toBe(true);
    expect(traversedVerts.indexOf("1") >= 0).toBe(true);
    expect(traversedVerts.indexOf("2") >= 0).toBe(true);
    expect(traversedVerts.indexOf("3") >= 0).toBe(false);
    expect(traversedVerts.indexOf("4") >= 0).toBe(true);
    expect(traversedVerts.indexOf("5") >= 0).toBe(true);
    expect(traversedVerts.indexOf("6") >= 0).toBe(true);
    expect(traversedVerts.indexOf("7") >= 0).toBe(false);
    expect(traversedVerts.indexOf("8") >= 0).toBe(false);
});

it ("check breadthFirstSearch ignores 3 branch and 1 level deep", () => {
    // SETUP
    let graph = createTestGraph();
    let traversedVerts = [];
    const callback = function (vert) {
        traversedVerts.push(vert.id);
    };

    // CALL
    graph.breadthFirstSearch("0", callback, ["3"], 1);

    // ASSERT
    expect(traversedVerts.length).toBe(3);
    expect(traversedVerts.indexOf("0") >= 0).toBe(true);
    expect(traversedVerts.indexOf("1") >= 0).toBe(true);
    expect(traversedVerts.indexOf("2") >= 0).toBe(true);
    expect(traversedVerts.indexOf("3") >= 0).toBe(false);
    expect(traversedVerts.indexOf("4") >= 0).toBe(false);
    expect(traversedVerts.indexOf("5") >= 0).toBe(false);
    expect(traversedVerts.indexOf("6") >= 0).toBe(false);
    expect(traversedVerts.indexOf("7") >= 0).toBe(false);
    expect(traversedVerts.indexOf("8") >= 0).toBe(false);
});