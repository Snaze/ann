
class GhostBrainStrategyWander {

    constructor() {
        this._destinationLocation = null;
    }

    static _getRandomLocation(currentLocation, level) {
        let toRet = currentLocation;

        while (toRet.equals(currentLocation)) {
            toRet = level.getRandomActiveCellLocation();
        }

        return toRet;
    }

    resetDestination(ghost, player, level) {
        this._destinationLocation = GhostBrainStrategyWander._getRandomLocation(ghost.location, level);
    }

    getNextDirection(ghost, player, level) {
        if (this._destinationLocation === null)  {
            this._destinationLocation = ghost.location;
        }

        if ((this._destinationLocation.equals(ghost.location)) ||
            (ghost.prevLocation.equals(ghost.location))) { // THIS CHECK HERE IS SO THEY DONT GET STUCK ON PARTIAL BORDER
            // this._destinationLocation = GhostBrainStrategyWander._getRandomLocation(ghost.location, level);
            this.resetDestination(ghost, player, level);
        }

        let fromCellId = ghost.location.toCellId();
        let toCellId = this._destinationLocation.toCellId();

        return level.floydWarshall.getDirection(fromCellId, toCellId);
    }

    get cellTransitionDurationMax() {
        return 0.3;
    }

    get cellTransitionDurationMin() {
        return 0.2;
    }

    get destinationLocation() {
        return this._destinationLocation;
    }

    set destinationLocation(value) {
        this._destinationLocation = value;
    }
}

export default GhostBrainStrategyWander;