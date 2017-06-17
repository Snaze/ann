import { assert } from "../../utils/Assert";
import Edge from "./Edge";
import _ from "../../../node_modules/lodash/lodash";

const vert_color_white = 0;
const vert_color_grey = 1;
const vert_color_black = 2;

class Graph {

    constructor() {
        this._vertices = new Set();
        this._adj = {};
        this._edgeCount = 0;
    }

    addVertex(vertexId) {
        assert (vertexId.indexOf(Edge.DELIMETER) < 0);

        this._vertices.add(vertexId);
        this._adj[vertexId] = new Set();
    }

    containsVertex(vertexId) {
        return this._vertices.has(vertexId);
    }

    removeVertex(vertexId) {
        this._vertices.delete(vertexId);
        delete this._adj[vertexId];
    }

    /**
     * Iterate over all vertices
     *
     * @param callback Standard callback --> callback(item, index);
     */
    iterateVertices(callback) {
        this._vertices.forEach(callback);
    }

    addEdge(vertexId1, vertexId2) {
        assert (this.containsVertex(vertexId1));
        assert (this.containsVertex(vertexId2));

        let prevSize = this._adj[vertexId1].size;

        this._adj[vertexId1].add(vertexId2);
        this._adj[vertexId2].add(vertexId1);

        if (prevSize !== this._adj[vertexId1].size) {
            this._edgeCount++;
        }
    }

    /**
     * Iterate over all edges
     *
     * @param callback The callback should be of the form callback(edge, index)
     */
    iterateEdges(callback) {
        this._vertices.forEach(function (vertId) {

            this._adj[vertId].forEach(function (otherVertId) {

                callback(vertId, otherVertId);

            });

        }.bind(this));
    }

    containsEdge(vertexId1, vertexId2) {
        return this._adj[vertexId1].has(vertexId2);
    }

    removeEdge(vertexId1, vertexId2) {
        this._adj[vertexId1].delete(vertexId2);
        this._adj[vertexId2].delete(vertexId1);
        this._edgeCount--;
    }

    get edgeCount() {
        return this._edgeCount;
    }

    get vertexCount() {
        return this._vertices.size;
    }

    breadthFirstSearch(startVertexId, callback=null, vertIdsToIgnore=[], maxDistance=Number.POSITIVE_INFINITY) {
        let verts = {};
        this._vertices.forEach(function (vertId) {
            verts[vertId] = {
                id: vertId,
                color: vert_color_white,
                distance: Number.POSITIVE_INFINITY,
                previous: null
            };
        });

        let startVert = verts[startVertexId];
        startVert.color = vert_color_grey;
        startVert.distance = 0;

        let queue = [];
        queue.push(startVert);

        while (queue.length > 0) {
            let u = queue.shift(); // You may want to look for a better queue implementation

            if (callback) {
                callback(u);
            }

            this._adj[u.id].forEach(function (vertexId) {
                let v = verts[vertexId];

                if (v.color === vert_color_white) {
                    v.color = vert_color_grey;
                    v.distance = u.distance + 1;
                    v.previous = u;

                    // If distance is less than max
                    // and we don't want to ignore this vertex
                    // then enqueue the vertex into the queue.
                    if (v.distance <= maxDistance && vertIdsToIgnore.indexOf(v.id) < 0) {
                        queue.push(v);
                    }
                }
            });

            u.color = vert_color_black;
        }

    }
}

export default Graph;