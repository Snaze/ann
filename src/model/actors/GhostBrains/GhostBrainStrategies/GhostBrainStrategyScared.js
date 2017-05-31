import Direction from "../../../../utils/Direction";

const direction_array = [Direction.LEFT, Direction.UP, Direction.RIGHT, Direction.DOWN];

class GhostBrainStrategyScared {

    constructor() {
        this._avoidPrevLocPercent = 0.90;
    }

    getNextDirection(ghost, player, level) {
        let leftDistance = this.getNewDistance(Direction.LEFT, ghost, player.location, level);
        let upDistance = this.getNewDistance(Direction.UP, ghost, player.location, level);
        let rightDistance = this.getNewDistance(Direction.RIGHT, ghost, player.location, level);
        let downDistance = this.getNewDistance(Direction.DOWN, ghost, player.location, level);

        let theArray = [leftDistance, upDistance, rightDistance, downDistance];
        let maxValue = Math.max(...theArray);
        let indicesWithMax = this.indicesWithValue(theArray, maxValue);
        let randomIndex = indicesWithMax[Math.floor(Math.random() * indicesWithMax.length)];

        let toRet = direction_array[randomIndex];
        if (typeof(toRet) === "undefined") {
            throw new Error("the next direction cannot be undefined");
        }
        return toRet;
    }

    indicesWithValue(theArray, value) {
        let toRet = [];

        theArray.forEach(function (item, index) {
            if (item === value) {
                toRet.push(index);
            }
        });

        return toRet;
    }

    argmax(theArray) {
        let theMaxIndex = -1;
        let theMax = Number.NEGATIVE_INFINITY;

        theArray.forEach(function (item, i) {
            if (item > theMax) {
                theMax = item;
                theMaxIndex = i;
            }
        });

        return theMaxIndex;
    }

    getNewDistance(direction, ghost, playerLocation, level) {
        let ghostLocation = ghost.location.clone();

        if (ghost.canMoveInDirection(ghostLocation, direction)) {
            ghostLocation.moveInDirection(direction, level.height, level.width);
            if (ghostLocation.equals(ghost.prevLocation) && (Math.random() < this._avoidPrevLocPercent)) {
                return 0;
            }

            // return ghostLocation.distance(playerLocation);
            let toRet = level.floydWarshall.getPathDistance(ghostLocation.toCellId(), playerLocation.toCellId());
            if (typeof(toRet) === "undefined") {
                return 0;
            }

            return toRet;
        }

        return 0;
    }

    get cellTransitionDuration() {
        return 0.60;
    }

}

export default GhostBrainStrategyScared;