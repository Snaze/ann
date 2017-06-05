import Direction from "../../../../utils/Direction";

class GhostBrainStrategyHoldingPin {

    getNextDirection(ghost, player, level) {
        // let toRet = ghost.location.clone();
        let randomValue = Math.random();

        if (ghost.location.equals(ghost._spawnLocation)) {
            // YOU ARE AT SPAWN LOCATION

            if (randomValue < 0.33) {
                return Direction.DOWN;
            } else if (randomValue < 0.66) {
                return Direction.NONE;
            } else {
                return Direction.UP;
            }
        } else if (ghost.location.isEqualTo(ghost._spawnLocation.x, ghost._spawnLocation.y + 1)) {
            // YOU ARE AT DOWN LOCATION
            if (randomValue < 0.5) {
                return Direction.NONE;
            } else {
                return Direction.UP;
            }
        } else {
            // YOU ARE AT UP LOCATION
            if (randomValue < 0.5) {
                return Direction.NONE;
            } else {
                return Direction.DOWN;
            }
        }

        // throw new Error("You should never get here");
    }

    get cellTransitionDurationMax() {
        return 0.3;
    }

    get cellTransitionDurationMin() {
        return 0.3;
    }

}

export default GhostBrainStrategyHoldingPin;