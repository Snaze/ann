import Direction from "../../utils/Direction";
// import ConvertBase from "../../utils/ConvertBase";
import ArrayUtils from "../../utils/ArrayUtils";
import { assert } from "../../utils/Assert";

const max_distance = 41;
const max_living_state = 2;
const max_direction = 15;
const max_power_up_value = 5000;

class SimpleStateConverter {

    constructor() {
        this._firstLength = null;
    }

    static get MAX_DISTANCE() { return max_distance; }
    static get MAX_LIVING_STATE() { return max_living_state; }
    static get MAX_DIRECTION() { return max_direction; }
    static get MAX_POWER_UP_VALUE() { return max_power_up_value; }

    /**
     * This will create a 1-way feature vector to train the Deep Q Learner.
     *
     * @param goc {GameObjectContainer} The game object container.
     * @returns {Array} The array that represents the feature vector.
     */
    toFeatureVector(goc) {
        let toRet = [];

        ArrayUtils.extend(toRet, this._getPlayerVector(goc));
        ArrayUtils.extend(toRet, this._getGhostVector(goc, goc.ghostRed));
        ArrayUtils.extend(toRet, this._getGhostVector(goc, goc.ghostBlue));
        ArrayUtils.extend(toRet, this._getGhostVector(goc, goc.ghostOrange));
        ArrayUtils.extend(toRet, this._getGhostVector(goc, goc.ghostPink));
        ArrayUtils.extend(toRet, this._getPowerUpVector(goc));
        ArrayUtils.extend(toRet, this._getDotFeatureVector(goc));

        if (this._firstLength === null) {
            this._firstLength = toRet.length;
        }

        assert (toRet.length === this._firstLength, "All Feature Vectors must be the same length");

        return toRet;
    }

    /**
     * This will return the feature vector for the specified ghost.
     * @param goc {GameObjectContainer} The GameObjectContainer
     * @param ghost {Ghost} The ghost.
     * @returns {Array} Returns array of the feature vector.
     * @private
     */
    _getGhostVector(goc, ghost) {
        let toRet = [];

        this._populateArrayWithCommonInfo(toRet, goc, ghost);

        return toRet;
    }

    /**
     * This will return the feature vector for the powerup in the GOC.
     * @param goc {GameObjectContainer} The GameObjectContainer
     * @returns {Array} Returns the feature vector.
     * @private
     */
    _getPowerUpVector(goc) {
        let toRet = [];
        this._populateArrayWithCommonInfo(toRet, goc, goc.powerUp);
        toRet.push(goc.powerUp.powerUpValue / max_power_up_value);

        return toRet;
    }

    /**
     * Use this to populate a feature vector for both the Ghost and the PowerUp
     *
     * @param goc {GameObjectContainer}
     * @param commonEntity {Ghost|PowerUp}
     * @param theArray {Array} The array you wish to populate
     * @private
     */
    _populateArrayWithCommonInfo(theArray, goc, commonEntity) {
        let level = goc.level;

        let distance = this._getDistanceBetweenLocations(goc, goc.player.location, commonEntity.location);
        theArray.push(distance);
        let direction = level.floydWarshall.getDirection(goc.player.location.toCellId(), commonEntity.location.toCellId());
        let directionArray = this.convertDirectionToNumber(direction);
        ArrayUtils.extend(theArray, directionArray);

        if (commonEntity.isAlive) {
            if (!!commonEntity.isScared) {
                theArray.push(1 / max_living_state);
            } else {
                theArray.push(2 / max_living_state);
            }
        } else {
            theArray.push(0 / max_living_state);
        }
    }

    _getDistanceBetweenLocations(goc, fromLocation, toLocation) {
        let level = goc.level;
        let distance = level.floydWarshall.getPathDistance(fromLocation.toCellId(), toLocation.toCellId());
        if (typeof(distance) === "undefined") {
            distance = max_distance; // This might be a good value but might not.... Dont want it too big
        } else {
            distance--; // For some reason its returning distance + 1
        }

        if (distance > max_distance) {
            if (!!window.console) {
                window.console.log("distance > max_distance");
            }
            distance = max_distance;
        }

        distance /= max_distance;

        return distance;
    }

    convertDirectionToNumber(direction) {
        let toRet = ArrayUtils.create1D(4, 0);

        if (direction === Direction.LEFT) {
            toRet[0] = 1;
        } else if (direction === Direction.UP) {
            toRet[1] = 1;
        } else if (direction === Direction.RIGHT) {
            toRet[2] = 1;
        } else if (direction === Direction.DOWN) {
            toRet[3] = 1;
        }

        return toRet;
    }

    /**
     * This will return the feature vector containing just player information.
     *
     * @param goc {GameObjectContainer} The GameObjectContainer.
     * @private
     */
    _getPlayerVector(goc) {
        let toRet = [];
        let level = goc.level;
        let player = goc.player;
        let cell = level.getCellByLocation(player.location);
        let locations = {
            left: player.location.clone().moveInDirection(Direction.LEFT, level.height, level.width),
            up: player.location.clone().moveInDirection(Direction.UP, level.height, level.width),
            right: player.location.clone().moveInDirection(Direction.RIGHT, level.height, level.width),
            down: player.location.clone().moveInDirection(Direction.DOWN, level.height, level.width),
        };

        let binaryArray = [];
        const buildBinaryArray = function (directionName) {
            if (locations[directionName].equals(player.location) ||
                !cell.canTraverseTo(level.getCellByLocation(locations[directionName]), level.width, level.height, true)) {
                binaryArray.push(0);
            } else {
                binaryArray.push(1);
            }
        };

        buildBinaryArray("left");
        buildBinaryArray("up");
        buildBinaryArray("right");
        buildBinaryArray("down");

        ArrayUtils.extend(toRet, binaryArray);

        return toRet;
    }

    /**
     * This will return the feature vector for the closest dots
     * @param goc {GameObjectContainer}
     * @param maxSearchDepth {Number} This is the max search depth for the graph.  I used 22 because
     * most game boards are 23 x 20 so you would typically need 22 hops to get across the board directly.  If
     * there are a lot of obstacles this might be a problem but I'll leave it here for now.
     * @private
     */
    _getDotFeatureVector(goc, maxSearchDepth=22) {
        let toRet = [];
        let closestDotLocation = null;
        let closestBigDotLocation = null;

        let callback = function (vertex) {
            let cell = goc.level.getCellById(vertex.id);

            if (closestDotLocation === null && cell.hasLittleDot) {
                closestDotLocation = cell.location;
            }

            if (closestBigDotLocation === null && cell.hasBigDot) {
                closestBigDotLocation = cell.location;
            }

        };

        goc.graph.breadthFirstSearch(goc.player.location.toCellId(),
            callback);

        if (closestDotLocation === null) {
            toRet.push(max_distance / max_distance);
            ArrayUtils.extend(toRet, this.convertDirectionToNumber(Direction.NONE));

            if (!!window.console) {
                window.console.log("Cannot find closest dot");
            }

        } else {
            toRet.push(this._getDistanceBetweenLocations(goc, goc.player.location, closestDotLocation));
            let direction = goc.level.floydWarshall.getDirection(goc.player.location.toCellId(),
                closestDotLocation.toCellId());
            let directionArray = this.convertDirectionToNumber(direction);
            ArrayUtils.extend(toRet, directionArray);
        }

        if (closestBigDotLocation === null) {
            toRet.push(max_distance / max_distance);
            ArrayUtils.extend(toRet, this.convertDirectionToNumber(Direction.NONE));

            if (!!window.console) {
                window.console.log("Cannot find closest big dot");
            }
        } else {
            toRet.push(this._getDistanceBetweenLocations(goc, goc.player.location, closestBigDotLocation));
            let direction = goc.level.floydWarshall.getDirection(goc.player.location.toCellId(),
                closestBigDotLocation.toCellId());

            let directionArray = this.convertDirectionToNumber(direction);
            ArrayUtils.extend(toRet, directionArray);
        }

        return toRet;
    }

}

export default SimpleStateConverter;