import Direction from "../../utils/Direction";
import Dot from "../Dot";
import _ from "../../../node_modules/lodash/lodash";
import ConvertBase from "../../utils/ConvertBase";

const numBins = 10;

class StateHelper {

    static get NUM_BINS() { return numBins; }

    constructor(searchDepth=8) {
        this._searchDepth = searchDepth;

        // TODO: Move these values to a common location
        this._deathValue = -10000;
        this._littleDotValue = 10;
        this._bigDotValue = 50;
    }

    getGhostHeuristic(distance) {
        return ((this._searchDepth - distance) / this._searchDepth) * this._deathValue;
    }

    getDiscountedHeuristic(distance, value) {
        return ((this._searchDepth - distance) / this._searchDepth) * value;
    }

    getHeuristic(goc, startLocation) {

        let score = 0;

        goc.graph.breadthFirstSearch(startLocation.toCellId(),
            function (vertex) {
                let cell = goc.level.getCellById(vertex.id);
                let distance = cell.location.manhattanDistance(startLocation);

                if (cell.dotType === Dot.LITTLE) {
                    score += this.getDiscountedHeuristic(distance, this.littleDotValue);
                } else if (cell.dotType === Dot.BIG) {
                    score += this.getDiscountedHeuristic(distance, this.bigDotValue);
                }

                if (cell.location.equals(goc.ghostRed.location)) {
                    score += this.getDiscountedHeuristic(distance, this.deathValue);
                }

                if (cell.location.equals(goc.ghostBlue.location)) {
                    score += this.getDiscountedHeuristic(distance, this.deathValue);
                }

                if (cell.location.equals(goc.ghostOrange.location)) {
                    score += this.getDiscountedHeuristic(distance, this.deathValue);
                }

                if (cell.location.equals(goc.ghostPink.location)) {
                    score += this.getDiscountedHeuristic(distance, this.deathValue);
                }

                if (cell.location.equals(goc.powerUp.location)) {
                    score += this.getDiscountedHeuristic(distance, goc.powerUp.powerUpValue);
                }
            }.bind(this),
            [goc.player.location.toCellId()],
            this._searchDepth);

        return score;
    }

    getHeuristicFromPlayerMovedInDirection(goc, theDirection) {
        let playerLocation = goc.player.location;
        let playerCell = goc.level.getCellByLocation(playerLocation);
        let location = playerLocation.clone().moveInDirection(theDirection, goc.level.height, goc.level.width);
        let currentCell = goc.level.getCellByLocation(location);

        if (playerCell.canTraverseTo(currentCell, goc.level.width, goc.level.height)) {
            return this.getHeuristic(goc, location);
        }

        return null;
    }

    /**
     *
     * @param goc GameObjectContainer
     */
    getStateNumber(goc) {
        let topHeuristic = this.getHeuristicFromPlayerMovedInDirection(goc, Direction.UP);
        let leftHeuristic = this.getHeuristicFromPlayerMovedInDirection(goc, Direction.LEFT);
        let rightHeuristic = this.getHeuristicFromPlayerMovedInDirection(goc, Direction.RIGHT);
        let bottomHeuristic = this.getHeuristicFromPlayerMovedInDirection(goc, Direction.DOWN);

        let heuristics = [
            topHeuristic, leftHeuristic, rightHeuristic, bottomHeuristic
        ];

        let filteredHeuristics = _.filter(heuristics, function (h) { return h !== null; });
        if (filteredHeuristics.length <= 0) {
            return 0; // Hmmmmmmm
        }

        let minValue = Math.min(...filteredHeuristics);
        let maxValue = Math.max(...filteredHeuristics);

        let binnedHeuristics = _.map(heuristics, function (h) {
            if (h === null) {
                if (numBins <= 10) {
                    return "0";
                }

                return "00";
            }

            // This should leave us with numbers between (0..1]
            let scaledValue = (h + (-1 * minValue)) / ((-1 * minValue) + maxValue);
            if (scaledValue >= 1) {
                scaledValue = 0.9999;
            }
            if (scaledValue < (1/numBins)) {
                scaledValue = (1/numBins);
            }

            let toRet = Math.floor(numBins * scaledValue).toString(); // This should return a number between (0..numBins]
            if (numBins > 10 && toRet < 10) {
                return "0" + toRet.toString();
            }

            return toRet.toString();
        });

        let toConvert = binnedHeuristics.join("");
        let toRet = ConvertBase.convert(toConvert).from(numBins).to(10);
        return parseInt(toRet, 10);
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