import { assert } from "../../utils/Assert";

class Edge {

    static get DELIMETER() { return "|" };

    constructor(vertexId1, vertexId2, weight=1) {
        assert (vertexId1.indexOf("|") < 0);
        assert (vertexId2.indexOf("|") < 0);

        this._vertexId1 = vertexId1;
        this._vertexId2 = vertexId2;
        this._weight = weight;
    }

    get key() {
        return this._vertexId1 + "|" + this._vertexId2;
    }

    get reverseKey() {
        return this._vertexId2 + "|" + this._vertexId1;
    }

    get vertexId1() {
        return this._vertexId1;
    }

    get vertexId2() {
        return this._vertexId2;
    }

    get weight() {
        return this._weight;
    }

    isEqualTo(vertexId1, vertexId2) {
        return this.vertexId1 === vertexId1 && this.vertexId2 === vertexId2;
    }

    equals(otherEdge) {
        return this.vertexId1 === otherEdge.vertexId1 && this.vertexId2 === otherEdge.vertexId2;
    }

    clone() {
        return new Edge(this._vertexId1, this._vertexId2, this._weight);
    }

    cloneReverse() {
        return new Edge(this._vertexId2, this._vertexId1, this._weight);
    }
}

export default Edge;