import Level from "../Level";

class FloydWarshall {

    constructor(level) {
        this._level = level;
        this._dist = null;
        this._next = null;
        this._vertIds = null;
        this._edges = null;
        this._paths = null;
    }

    get level() {
        return this._level;
    }

    get dist() {
        if (this._dist === null) {
            this._dist = {};
        }

        return this._dist;
    }

    get next() {
        if (this._next === null) {
            this._next = {};
        }

        return this._next;
    }

    get edges() {
        if (this._edges === null) {
            this._edges = this.buildEdges();
        }

        return this._edges;
    }

    get vertIds() {
        if (this._vertIds === null) {
            this._vertIds = this.buildVertIds();
        }

        return this._vertIds;
    }

    buildVertIds() {
        let toRet = [];

        this.level.iterateOverCells(function (cell) {
            toRet.push(cell.id);
        });

        return toRet;
    }

    buildEdges() {
        let toRet = [];
        let self = this;

        this.vertIds.forEach(function (vertId) {
            self.vertIds.forEach(function (otherVertId) {
                // if (otherVertId === vertId) {
                //     return;
                // }

                toRet.push([vertId, otherVertId]);
            });
        });

        return toRet;
    }

    getDistance(edge) {
        if (edge[0] === edge[1]) {
            return 0;
        }

        let currentCell = this.level.getCellById(edge[0]);
        let otherCell = this.level.getCellById(edge[1]);

        if (currentCell.canTraverseTo(otherCell, this.level.width, this.level.height)) {
            return 1;
        }

        return Number.POSITIVE_INFINITY;
    }

    /**
     * https://en.wikipedia.org/wiki/Floyd%E2%80%93Warshall_algorithm
     */
    _buildShortestPaths() {
        if ((this._dist !== null) || (this._next !== null)) {
            throw new Error("Shortest Paths Already Calculated.");
        }

        let self = this;

        this.edges.forEach(function (edge) {
            let u = edge[0];
            let v = edge[1];

            if (typeof(self.dist[u]) === "undefined") {
                self.dist[u] = {};
            }

            if (typeof(self.next[u]) === "undefined") {
                self.next[u] = {};
            }

            self.dist[u][v] = self.getDistance(edge);
            self.next[u][v] = v;
        });

        this.vertIds.forEach(function (k) {
            self.vertIds.forEach(function (i) {
                self.vertIds.forEach(function (j) {
                    if (self.dist[i][j] > self.dist[i][k] + self.dist[k][j]) {
                        self.dist[i][j] = self.dist[i][k] + self.dist[k][j];
                        self.next[i][j] = self.next[i][k]
                    }
                });
            });
        });
    }

    _getPath(u, v) {
        if (this.next[u][v] === null) {
            return [];
        }

        let path = [u];
        while (u !== v) {
            u = this.next[u][v];
            path.push(u);
        }

        return path;
    }

    static _convertEdgeToKey(edge) {
        return edge[0] + "__" + edge[1];
    }

    buildAllPaths() {
        if (this._paths !== null) {
            throw new Error("Paths already initialized.");
        }

        this._buildShortestPaths();

        this._paths = {};
        let self = this;

        this.edges.forEach(function (edge) {
            let key = FloydWarshall._convertEdgeToKey(edge);
            self._paths[key] = self._getPath(edge[0], edge[1]);
        });
    }

    getPath(u, v) {
        if (this._paths === null) {
            throw new Error("You must call buildAllPaths before using this method");
        }

        let key = FloydWarshall._convertEdgeToKey([u, v]);
        return this._paths[key];
    }
}

export default FloydWarshall;