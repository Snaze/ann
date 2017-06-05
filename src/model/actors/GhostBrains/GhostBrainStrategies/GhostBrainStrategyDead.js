
class GhostBrainStrategyDead {

    getNextDirection(ghost, player, level) {

        let fromCellId = ghost.location.toCellId();
        let toCellId = ghost.spawnLocation.toCellId();

        return level.floydWarshall.getDirection(fromCellId, toCellId);
    }

    get cellTransitionDurationMax() {
        return 0.1;
    }

    get cellTransitionDurationMin() {
        return 0.1;
    }
}

export default GhostBrainStrategyDead;