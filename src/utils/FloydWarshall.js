// import Level from "../Level";
import Location from "../model/Location";
import Direction from "./Direction";

class FloydWarshall {

    constructor() {
        this._dist = null;
        this._next = null;
        this._vertIds = null;
        this._edges = null;
        this._paths = null;
        this._directions = null;
        this._pathDistance = null;
    }

    static fromJSON(jsonObject) {
        let toRet = new FloydWarshall();

        toRet._directions = jsonObject._directions;
        toRet._pathDistance = jsonObject._pathDistance;

        return toRet;
    }

    toJSON() {
        return {
            _directions: this._directions,
            _pathDistance: this._pathDistance
        };
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

    getEdges(level) {
        if (this._edges === null) {
            this._edges = this.buildEdges(level);
        }

        return this._edges;
    }

    getVertIds(level) {
        if (this._vertIds === null) {
            this._vertIds = this.buildVertIds(level);
        }

        return this._vertIds;
    }

    buildVertIds(level) {
        let toRet = [];

        level.iterateOverCells(function (cell) {
            if (cell.isActive) {
                toRet.push(cell.id);
            }
        });

        return toRet;
    }

    buildEdges(level) {
        let toRet = [];
        let self = this;

        this.getVertIds(level).forEach(function (vertId) {
            self.getVertIds(level).forEach(function (otherVertId) {
                toRet.push([vertId, otherVertId]);
            });
        });

        return toRet;
    }

    getDistance(level, edge) {
        if (edge[0] === edge[1]) {
            return 0;
        }

        let currentCell = level.getCellById(edge[0]);
        let otherCell = level.getCellById(edge[1]);

        if (currentCell.canTraverseTo(otherCell, level.width, level.height)) {
            return 1;
        }

        return Number.POSITIVE_INFINITY;
    }

    /**
     * https://en.wikipedia.org/wiki/Floyd%E2%80%93Warshall_algorithm
     */
    _buildShortestPaths(level) {
        if ((this._dist !== null) || (this._next !== null)) {
            throw new Error("Shortest Paths Already Calculated.");
        }

        let self = this;

        this.getEdges(level).forEach(function (edge) {
            let u = edge[0];
            let v = edge[1];

            if (typeof(self.dist[u]) === "undefined") {
                self.dist[u] = {};
            }

            if (typeof(self.next[u]) === "undefined") {
                self.next[u] = {};
            }

            self.dist[u][v] = self.getDistance(level, edge);
            self.next[u][v] = v;
        });

        this.getVertIds(level).forEach(function (k) {
            self.getVertIds(level).forEach(function (i) {
                self.getVertIds(level).forEach(function (j) {
                    if (self.dist[i][j] > self.dist[i][k] + self.dist[k][j]) {
                        self.dist[i][j] = self.dist[i][k] + self.dist[k][j];
                        self.next[i][j] = self.next[i][k];
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

    static _convertCellIdsToKey(fromCellId, toCellId) {
        return fromCellId + "__" + toCellId;
    }

    buildAllPaths(level) {
        if (this._paths !== null) {
            throw new Error("Paths already initialized.");
        }

        this._buildShortestPaths(level);

        this._paths = {};
        let self = this;

        this.getEdges(level).forEach(function (edge) {
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

    convertPathsToDirections(level) {
        this._directions = {};
        this._pathDistance = {};

        for (let key in this._paths) {
            if (this._paths.hasOwnProperty(key)) {
                let currentPath = this._paths[key];
                if (currentPath.length === 1) {
                    this._directions[key] = Direction.NONE;
                    this._pathDistance[key] = 1;
                } else {
                    let fromCellId = currentPath[0];
                    let toCellId = currentPath[1];
                    let fromCell = level.getCellById(fromCellId);
                    let toCell = level.getCellById(toCellId);

                    this._directions[key] = Location.getDirection(fromCell.location,
                        toCell.location, level.width, level.height);
                    this._pathDistance[key] = currentPath.length;
                }
            }
        }

        // I'm doing this to save space.
        this._dist = null;
        this._next = null;
        this._vertIds = null;
        this._edges = null;
        this._paths = null;
    }

    getDirection(fromCellId, toCellId) {
        if (this._directions === null) {
            throw new Error("You must first call convertPathsToDirections");
        }

        return this._directions[FloydWarshall._convertCellIdsToKey(fromCellId, toCellId)];
    }

    getPathDistance(fromCellId, toCellId) {
        if (this._pathDistance === null) {
            throw new Error("You must first call convertPathsToDirections");
        }

        return this._pathDistance[FloydWarshall._convertCellIdsToKey(fromCellId, toCellId)];
    }
}

export default FloydWarshall;