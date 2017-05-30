import GhostBrainStrategyHoldingPin from "./GhostBrainStrategies/GhostBrainStrategyHoldingPin";
import moment from "../../../../node_modules/moment/moment";
import GhostBrainStrategyWander from "./GhostBrainStrategies/GhostBrainStrategyWander";
import Direction from "../../../utils/Direction";
import GhostBrainStrategyAttack from "./GhostBrainStrategies/GhostBrainStrategyAttack";

const ghost_state_wander = 0;
const ghost_state_holding_pin = 1;
const ghost_state_attack = 2;

class GhostBrainManual {
    static get GHOST_STATE_WANDER() { return ghost_state_wander; }
    static get GHOST_STATE_HOLDING_PIN() { return ghost_state_holding_pin; }
    static get GHOST_STATE_ATTACK() { return ghost_state_attack; }

    constructor() {
        this._ghostBrainStrategyHoldingPin = new GhostBrainStrategyHoldingPin();
        this._ghostBrainStrategyWander = new GhostBrainStrategyWander();
        this._ghostBrainStrategyAttack = new GhostBrainStrategyAttack();

        this._currentState = null;
        this._endHoldingPinTime = null;
        this._attackStateExpiration = moment();

        this.enterState(GhostBrainManual.GHOST_STATE_HOLDING_PIN);
    }

    getNextDirection(ghost, player, level) {
        this._changeStateIfNeeded(ghost, player, level);

        if (this._currentState === GhostBrainManual.GHOST_STATE_HOLDING_PIN) {
            return this._ghostBrainStrategyHoldingPin.getNextDirection(ghost, player, level);
        }

        if (this._currentState === GhostBrainManual.GHOST_STATE_WANDER) {
            return this._ghostBrainStrategyWander.getNextDirection(ghost, player, level);
        }

        if (this._currentState === GhostBrainManual.GHOST_STATE_ATTACK) {
            return this._ghostBrainStrategyAttack.getNextDirection(ghost, player, level);
        }

        throw new Error("You should never get here");
    }

    get cellTransitionDuration() {
        if (this._currentState === GhostBrainManual.GHOST_STATE_HOLDING_PIN) {
            return this._ghostBrainStrategyHoldingPin.cellTransitionDuration;
        }

        if (this._currentState === GhostBrainManual.GHOST_STATE_WANDER) {
            return this._ghostBrainStrategyWander.cellTransitionDuration;
        }

        if (this._currentState === GhostBrainManual.GHOST_STATE_ATTACK) {
            return this._ghostBrainStrategyAttack.cellTransitionDuration;
        }

        throw new Error("You should never get here");
    }

    enterState(state) {
        this._currentState = state;

        switch(state) {
            case GhostBrainManual.GHOST_STATE_HOLDING_PIN:
                let randomValue = Math.floor(Math.random() * 30.0);
                this._endHoldingPinTime = moment().add(randomValue, "s");
                break;
            case GhostBrainManual.GHOST_STATE_WANDER:
                break;
            case GhostBrainManual.GHOST_STATE_ATTACK:
                this._attackStateExpiration = moment().add(this._ghostBrainStrategyAttack.attackExpirationDuration, "s");
                break;
            default:
                break;
        }
    }

    _changeStateIfNeeded(ghost, player, level) {
        switch (this._currentState) {
            case GhostBrainManual.GHOST_STATE_HOLDING_PIN:
                if (this._endHoldingPinTime < moment()) {
                    this.enterState(GhostBrainManual.GHOST_STATE_WANDER);
                }
                break;
            case GhostBrainManual.GHOST_STATE_WANDER:
                if (this._canGhostSeePlayer(ghost, player, level)) {
                    this.enterState(GhostBrainManual.GHOST_STATE_ATTACK);
                }
                break;
            case GhostBrainManual.GHOST_STATE_ATTACK:
                if (this._attackStateExpiration < moment() &&
                    !this._canGhostSeePlayer(ghost, player, level)) {

                    this._ghostBrainStrategyWander.destinationLocation.setWithLocation(player.location);
                    this.enterState(GhostBrainManual.GHOST_STATE_WANDER);
                }
                break;
            default:
                break;
        }
    }

    _canGhostSeePlayer(ghost, player, level) {
        let ghostLocation = ghost.location;
        let ghostDirection = ghost.direction;
        let playerLocation = player.location;

        if ((playerLocation.y === ghostLocation.y) ||
            (playerLocation.x === ghostLocation.x)) { // Player and Ghost are on the same column or row.

            let ghostCellId = ghostLocation.toCellId();
            let playerCellId = playerLocation.toCellId();
            let shortestPathDistance = level.floydWarshall.getPathDistance(ghostCellId, playerCellId);
            let distBetween = 0;

            if (playerLocation.y === ghostLocation.y) {
                distBetween = Math.abs(playerLocation.x - ghostLocation.x);

                if (((shortestPathDistance - 1) === distBetween) &&
                    (((ghostDirection === Direction.RIGHT) && (playerLocation.x >= ghostLocation.x)) ||
                     ((ghostDirection === Direction.LEFT) && (playerLocation.x <= ghostLocation.x)))) {
                    return true;
                }
            } else {
                distBetween = Math.abs(playerLocation.y - ghostLocation.y);

                if (((shortestPathDistance - 1) === distBetween) &&
                    (((ghostDirection === Direction.DOWN) && (playerLocation.y >= ghostLocation.y)) ||
                    ((ghostDirection === Direction.UP) && (playerLocation.y <= ghostLocation.y)))) {
                    return true;
                }
            }
        }

        return false;
    }
}

export default GhostBrainManual;