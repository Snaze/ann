import { assert } from "../../utils/Assert";
import Edge from "./Edge";
import _ from "../../../node_modules/lodash/lodash";

class Graph {

    constructor() {
        this._vertices = new Set();
        this._edges = {};
    }

    addVertex(vertexId) {
        assert (vertexId.indexOf(Edge.DELIMETER) < 0);

        this._vertices.add(vertexId);
    }

    containsVertex(vertexId) {
        return this._vertices.has(vertexId);
    }

    removeVertex(vertexId) {
        this._vertices.delete(vertexId);
    }

    /**
     * Iterate over all vertices
     *
     * @param callback Standard callback --> callback(item, index);
     */
    iterateVertices(callback) {
        this._vertices.forEach(callback);
    }

    addEdge(edge) {
        assert (this.containsVertex(edge.vertexId1));
        assert (this.containsVertex(edge.vertexId2));

        // let forwardEdge = new Edge(vertexId1, vertexId2);
        let backwardEdge = edge.cloneReverse();

        this._edges[edge.key] = edge;
        this._edges[backwardEdge.key] = backwardEdge;
    }

    /**
     * Iterate over all edges
     *
     * @param callback The callback should be of the form callback(edge, index)
     */
    iterateEdges(callback) {
        for (let prop in this._edges) {
            if (this._edges.hasOwnProperty(prop)) {
                callback(this._edges[prop]);
            }
        }
    }

    containsEdge(edge) {
        return edge.key in this._edges;
    }

    removeEdge(edge) {
        delete this._edges[edge.key];
        delete this._edges[edge.reverseKey];
    }

    get edgeCount() {
        return _.keys(this._edges).length;
    }

    get vertexCount() {
        return this._vertices.size;
    }
}

export default Graph;