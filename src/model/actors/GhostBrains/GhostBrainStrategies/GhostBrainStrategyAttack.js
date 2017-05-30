
class GhostBrainStrategyAttack {

    getNextDirection(ghost, player, level) {

        let fromCellId = ghost.location.toCellId();
        let toCellId = player.location.toCellId();

        return level.floydWarshall.getDirection(fromCellId, toCellId);
    }

    get cellTransitionDuration() {
        return 0.3;
    }

    get attackExpirationDuration() {
        return 3.0;
    }
}

export default GhostBrainStrategyAttack;