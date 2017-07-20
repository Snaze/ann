import Direction from "../../utils/Direction";
import Dot from "../Dot";
import _ from "../../../node_modules/lodash/lodash";
import ConvertBase from "../../utils/ConvertBase";
import Ghost from "../actors/Ghost";
// import GameObjectContainer from "../GameObjectContainer";
import MathUtil from "./MathUtil";
import { assert } from "../../utils/Assert";
import MinMaxNormalizer from "./MinMaxNormalizer";
import Rewards from "./Rewards";

const num_bins = 10;

class StateHelper {

    static get NUM_BINS() { return num_bins; }
    static _numStates = null;
    static get NUM_STATES() {
        if (StateHelper._numStates === null) {
            StateHelper._numStates = Math.pow(num_bins, 4);
        }

        return StateHelper._numStates;
    }

    constructor(searchDepth=16) {
        this._searchDepth = searchDepth;

        // TODO: Move these values to a common location
        this._discountFactor = 0.9;

        this._visitedCells = {};
        this._prevTraversedCells = null;
        this._prevLocation = null;
        this._minMaxNormalizer = new MinMaxNormalizer("StateHelper", true);
    }

    getGhostHeuristic(ghost) {
        if (ghost.scaredState === Ghost.SCARED_STATE_NOT_SCARED) {
            return Rewards.DEATH;
        }

        return Rewards.KILL_GHOST;
    }

    getHeuristic(goc, startLocation, traversedCells=null) {

        let score = 0;

        goc.graph.breadthFirstSearch(startLocation.toCellId(),
            function (vertex) {
                let cell = goc.level.getCellById(vertex.id);
                if (traversedCells) {
                    traversedCells[vertex.id] = cell;
                }

                let currentScore = 0;

                let distance = goc.level.floydWarshall.getPathDistance(startLocation.toCellId(), vertex.id);

                if (typeof(distance) === "undefined") {
                    return;
                }

                if (cell.dotType === Dot.LITTLE) {
                    currentScore += Rewards.DOT_LITTLE;
                } else if (cell.dotType === Dot.BIG) {
                    currentScore += Rewards.DOT_BIG;
                }

                if (cell.location.equals(goc.ghostRed.location)) {
                    currentScore += this.getGhostHeuristic(goc.ghostRed);
                }

                if (cell.location.equals(goc.ghostBlue.location)) {
                    currentScore += this.getGhostHeuristic(goc.ghostBlue);
                }

                if (cell.location.equals(goc.ghostOrange.location)) {
                    currentScore += this.getGhostHeuristic(goc.ghostOrange);
                }

                if (cell.location.equals(goc.ghostPink.location)) {
                    currentScore += this.getGhostHeuristic(goc.ghostPink);
                }

                if (cell.location.equals(goc.powerUp.location)) {
                    currentScore += Rewards.POWER_UP;
                }

                score += currentScore * Math.pow(this._discountFactor, distance-1);

            }.bind(this),
            [goc.player.location.toCellId()],
            this._searchDepth);

        return score;
    }

    getHeuristicFromPlayerMovedInDirection(goc, theDirection, traversedCells=null) {
        let playerLocation = goc.player.location;
        let playerCell = goc.level.getCellByLocation(playerLocation);
        let location = playerLocation.clone().moveInDirection(theDirection, goc.level.height, goc.level.width);
        let currentCell = goc.level.getCellByLocation(location);

        if (playerCell.canTraverseTo(currentCell, goc.level.width, goc.level.height)) {
            return this.getHeuristic(goc, location, traversedCells);
        }

        return this._minMaxNormalizer.midValue;
    }

    getBinnedHeuristics(heuristics, minValue, maxValue) {
        return _.map(heuristics, function (h) {
            if (h === null) {
                if (num_bins <= 10) {
                    return "0";
                }

                return "00";
            }

            // This should leave us with numbers between (0..1]
            let scaledValueDenominator = ((-1 * minValue) + maxValue);
            let scaledValue = (1 / num_bins);

            if (scaledValueDenominator !== 0) {
                scaledValue = (h + (-1 * minValue)) / scaledValueDenominator;
            }

            if (scaledValue >= 1) {
                scaledValue = 0.9999;
            }
            if (scaledValue < (1 / num_bins)) {
                scaledValue = (1 / num_bins);
            }

            let toRet = Math.floor(num_bins * scaledValue).toString(); // This should return a number between (0..numBins]
            if (num_bins > 10 && toRet < 10) {
                return "0" + toRet.toString();
            }

            return toRet.toString();
        });
    }

    /**
     *
     * @param goc GameObjectContainer
     */
    getStateNumber(goc) {
        let binnedHeuristics = this.getBinnedStateArray(goc);

        let toConvert = binnedHeuristics.join("");
        let toRet = ConvertBase.convert(toConvert).from(num_bins).to(10);
        return parseInt(toRet, 10);
    }

    getBinnedStateArray(goc) {
        this._visitedCells[goc.player.location.toCellId()] = true;

        let traversedCells = {};
        let topHeuristic = this.getHeuristicFromPlayerMovedInDirection(goc, Direction.UP, traversedCells);
        let leftHeuristic = this.getHeuristicFromPlayerMovedInDirection(goc, Direction.LEFT, traversedCells);
        let rightHeuristic = this.getHeuristicFromPlayerMovedInDirection(goc, Direction.RIGHT, traversedCells);
        let bottomHeuristic = this.getHeuristicFromPlayerMovedInDirection(goc, Direction.DOWN, traversedCells);

        this._highlightTraversedCells(traversedCells);

        let heuristics = [
            topHeuristic, leftHeuristic, rightHeuristic, bottomHeuristic
        ];

        let filteredHeuristics = _.filter(heuristics, function (h) {
            return h !== null;
        });
        assert(filteredHeuristics.length >= 0, "How would you not be able to move in any direction");

        let minValue = Math.min(...filteredHeuristics);
        let maxValue = Math.max(...filteredHeuristics);

        return this.getBinnedHeuristics(heuristics, minValue, maxValue);
    }

    /**
     * Use this method to get the state vector to train the Deep Q Network.
     *
     * @param goc {GameObjectContainer}
     * @returns {[*,*,*,*]}
     */
    getStateArray(goc) {
        this._visitedCells[goc.player.location.toCellId()] = true;

        let traversedCells = Object.create(null);

        let topHeuristic = this.getHeuristicFromPlayerMovedInDirection(goc, Direction.UP, traversedCells);
        let leftHeuristic = this.getHeuristicFromPlayerMovedInDirection(goc, Direction.LEFT, traversedCells);
        let rightHeuristic = this.getHeuristicFromPlayerMovedInDirection(goc, Direction.RIGHT, traversedCells);
        let bottomHeuristic = this.getHeuristicFromPlayerMovedInDirection(goc, Direction.DOWN, traversedCells);

        this._highlightTraversedCells(traversedCells);

        let temp = [
            topHeuristic,
            leftHeuristic,
            rightHeuristic,
            bottomHeuristic,
        ];

        let toRet = this._minMaxNormalizer.normalize(temp);
        assert (!Number.isNaN(toRet[0]), `0 - Cannot be NaN - toRet = ${toRet}`);
        assert (!Number.isNaN(toRet[1]), `1 - Cannot be NaN - toRet = ${toRet}`);
        assert (!Number.isNaN(toRet[2]), `2 - Cannot be NaN - toRet = ${toRet}`);
        assert (!Number.isNaN(toRet[3]), `3 - Cannot be NaN - toRet = ${toRet}`);
        return toRet;
    }

    /**
     * This will return the direction that is predicted by the heuristic array to be best.
     * @param heuristicArray {Array}
     */
    getPredictedDirection(heuristicArray) {
        let maxIndex = MathUtil.argMax(heuristicArray);
        return this.mapIndexToDirection(maxIndex);
    }

    mapIndexToDirection(index) {
        let theDirection = null;

        switch (index) {
            case 0:
                theDirection = Direction.UP;
                break;
            case 1:
                theDirection = Direction.LEFT;
                break;
            case 2:
                theDirection = Direction.RIGHT;
                break;
            case 3:
                theDirection = Direction.DOWN;
                break;
            default:
                if (typeof(console) !== "undefined") {
                    console.log(`index = ${index}`);
                }
                throw new Error("Unknown direction");
        }

        return theDirection;
    }

    getDirection(goc, stateNumber) {
        // let stateNumber = this.getStateNumber(goc);
        let theString = stateNumber.toString();

        while (theString.length < 4) {
            theString = "0" + theString;
        }

        let theArray = theString.split("").map(function (item) {
            return parseInt(item, 10);
        });

        let maxIndex = MathUtil.argMax(theArray);
        return this.mapIndexToDirection(maxIndex);
    }

    _findDirectionNotPrev(theArray, player) {
        let theDirection = Direction.NONE;

        while (theDirection === Direction.NONE) {
            let maxIndex = MathUtil.argMax(theArray);

            switch (maxIndex) {
                case 0:
                    theDirection = Direction.UP;
                    break;
                case 1:
                    theDirection = Direction.LEFT;
                    break;
                case 2:
                    theDirection = Direction.RIGHT;
                    break;
                case 3:
                    theDirection = Direction.DOWN;
                    break;
                default:
                    throw new Error("Unknown direction");
            }

            if (!!this._prevLocation &&
                player.location.clone().moveInDirection(theDirection).equals(this._prevLocation)) {
                theDirection = Direction.NONE;
                theArray[maxIndex] = 0;
            }
        }

        this._prevLocation = player.location.clone();

        return theDirection;
    }

    _highlightTraversedCells(traversedCells) {
        if (this._prevTraversedCells) {
            for (let cellId in this._prevTraversedCells) {
                this._prevTraversedCells[cellId].highlighted = false;
            }
        }

        for (let cellId in traversedCells) {
            traversedCells[cellId].highlighted = true;
        }

        this._prevTraversedCells = traversedCells;
    }

    static convertToDetailString(stateNum) {
        let tempStr = stateNum.toString();

        while (tempStr.length < 4) {
            tempStr = "0" + tempStr;
        }

        let theArray = tempStr.split("");

        return `top: ${theArray[0]}, left: ${theArray[1]}, right: ${theArray[2]}, bottom: ${theArray[3]}`;
    }

    get searchDepth() {
        return this._searchDepth;
    }

    get deathValue() {
        return this._deathValue;
    }

    get littleDotValue() {
        return this._littleDotValue;
    }

    get bigDotValue() {
        return this._bigDotValue;
    }


}

export default StateHelper;