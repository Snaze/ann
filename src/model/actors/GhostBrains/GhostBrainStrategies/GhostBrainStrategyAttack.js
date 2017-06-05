
class GhostBrainStrategyAttack {

    getNextDirection(ghost, player, level) {

        let fromCellId = ghost.location.toCellId();
        let toCellId = player.location.toCellId();

        return level.floydWarshall.getDirection(fromCellId, toCellId);
    }

    get cellTransitionDurationMax() {
        return 0.275;
    }

    get cellTransitionDurationMin() {
        return 0.175;
    }

    get attackExpirationDuration() {
        return 3.0;
    }
}

export default GhostBrainStrategyAttack;