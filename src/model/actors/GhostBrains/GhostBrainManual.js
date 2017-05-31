import GhostBrainStrategyHoldingPin from "./GhostBrainStrategies/GhostBrainStrategyHoldingPin";
import moment from "../../../../node_modules/moment/moment";
import GhostBrainStrategyWander from "./GhostBrainStrategies/GhostBrainStrategyWander";
import Direction from "../../../utils/Direction";
import GhostBrainStrategyAttack from "./GhostBrainStrategies/GhostBrainStrategyAttack";
import GhostBrainStrategyScared from "./GhostBrainStrategies/GhostBrainStrategyScared";

const ghost_state_wander = 0;
const ghost_state_holding_pin = 1;
const ghost_state_attack = 2;
const ghost_state_scared = 3;

class GhostBrainManual {
    static get GHOST_STATE_WANDER() { return ghost_state_wander; }
    static get GHOST_STATE_HOLDING_PIN() { return ghost_state_holding_pin; }
    static get GHOST_STATE_ATTACK() { return ghost_state_attack; }
    static get GHOST_STATE_SCARED() { return ghost_state_scared; }

    constructor() {
        this._ghostBrainStrategyHoldingPin = new GhostBrainStrategyHoldingPin();
        this._ghostBrainStrategyWander = new GhostBrainStrategyWander();
        this._ghostBrainStrategyAttack = new GhostBrainStrategyAttack();
        this._ghostBrainStrategyScared = new GhostBrainStrategyScared();

        this._currentState = null;
        this._endHoldingPinTime = null;
        this._attackStateExpiration = moment();
        this._holdingPinDuration = 15.0;

        this.enterState(GhostBrainManual.GHOST_STATE_HOLDING_PIN);
    }

    getNextDirection(ghost, player, level) {
        this._changeStateIfNeeded(ghost, player, level);

        let toRet = null;

        if (this._currentState === GhostBrainManual.GHOST_STATE_HOLDING_PIN) {
            toRet = this._ghostBrainStrategyHoldingPin.getNextDirection(ghost, player, level);
        } else if (this._currentState === GhostBrainManual.GHOST_STATE_WANDER) {
            toRet = this._ghostBrainStrategyWander.getNextDirection(ghost, player, level);
        } else if (this._currentState === GhostBrainManual.GHOST_STATE_ATTACK) {
            toRet = this._ghostBrainStrategyAttack.getNextDirection(ghost, player, level);
        } else if (this._currentState === GhostBrainManual.GHOST_STATE_SCARED) {
            toRet = this._ghostBrainStrategyScared.getNextDirection(ghost, player, level);
        }

        if ((typeof(toRet) === "undefined") || (toRet === null)) {
            throw new Error("direction is undefined");
        }

        return toRet;
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

        if (this._currentState === GhostBrainManual.GHOST_STATE_SCARED) {
            return this._ghostBrainStrategyScared.cellTransitionDuration;
        }

        throw new Error("You should never get here");
    }

    enterState(state) {
        this._currentState = state;

        switch(state) {
            case GhostBrainManual.GHOST_STATE_HOLDING_PIN:
                let randomValue = Math.floor(Math.random() * this._holdingPinDuration);
                this._endHoldingPinTime = moment().add(randomValue, "s");
                break;
            case GhostBrainManual.GHOST_STATE_WANDER:
                break;
            case GhostBrainManual.GHOST_STATE_ATTACK:
                this._attackStateExpiration = moment().add(this._ghostBrainStrategyAttack.attackExpirationDuration, "s");
                break;
            case GhostBrainManual.GHOST_STATE_SCARED:

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
                if (moment() < player.attackModeFinishTime) {
                    this.enterState(GhostBrainManual.GHOST_STATE_SCARED);
                    ghost.prevLocation.setWithLocation(level.getRandomActiveCellLocation());
                } else if (this._canGhostSeePlayer(ghost, player, level)) {
                    this.enterState(GhostBrainManual.GHOST_STATE_ATTACK);
                }
                break;
            case GhostBrainManual.GHOST_STATE_ATTACK:
                if (moment() < player.attackModeFinishTime) {
                    this.enterState(GhostBrainManual.GHOST_STATE_SCARED);
                    ghost.prevLocation.setWithLocation(level.getRandomActiveCellLocation());
                } else if (this._attackStateExpiration < moment() &&
                    !this._canGhostSeePlayer(ghost, player, level)) {

                    this._ghostBrainStrategyWander.destinationLocation.setWithLocation(player.location);
                    this.enterState(GhostBrainManual.GHOST_STATE_WANDER);
                }
                break;
            case GhostBrainManual.GHOST_STATE_SCARED:
                if (moment() >= player.attackModeFinishTime) {
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

    getScaredState(ghost, player, level) {
        if (this._currentState !== GhostBrainManual.GHOST_STATE_SCARED) {
            return ghost.SCARED_STATE_NOT_SCARED;
        }

        let toSubtract = player.attackModeDuration * 0.2;
        let eightyPercentTime = player.attackModeFinishTime.clone().subtract(toSubtract, "s");

        if (moment() >= eightyPercentTime) {
            return ghost.SCARED_STATE_SCARED_FLASH;
        }

        return ghost.SCARED_STATE_SCARED;
    }
}

export default GhostBrainManual;