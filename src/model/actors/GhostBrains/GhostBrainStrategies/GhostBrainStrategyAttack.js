import Direction from "../../../../utils/Direction";
import Location from "../../../Location";

class GhostBrainStrategyAttack {

    constructor() {
    }

    getNextDirection(ghost, player, level) {

        let fromCellId = ghost.location.toCellId();
        let toCellId = player.location.toCellId();

        return level.floydWarshall.getDirection(fromCellId, toCellId);
    }

    get cellTransitionDuration() {
        return 0.2;
    }
}

export default GhostBrainStrategyAttack;