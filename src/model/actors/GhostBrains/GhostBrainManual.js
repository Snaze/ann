import GhostBrainStrategyHoldingPin from "./GhostBrainStrategies/GhostBrainStrategyHoldingPin";
import moment from "../../../../node_modules/moment/moment";
import GhostBrainStrategyWander from "./GhostBrainStrategies/GhostBrainStrategyWander";
import Direction from "../../../utils/Direction";
import GhostBrainStrategyAttack from "./GhostBrainStrategies/GhostBrainStrategyAttack";
import GhostBrainStrategyScared from "./GhostBrainStrategies/GhostBrainStrategyScared";
import GhostBrainStrategyDead from "./GhostBrainStrategies/GhostBrainStrategyDead";

const ghost_state_wander = 0;
const ghost_state_holding_pin = 1;
const ghost_state_attack = 2;
const ghost_state_scared = 3;
const ghost_state_dead = 4;

class GhostBrainManual {
    static get GHOST_STATE_WANDER() { return ghost_state_wander; }
    static get GHOST_STATE_HOLDING_PIN() { return ghost_state_holding_pin; }
    static get GHOST_STATE_ATTACK() { return ghost_state_attack; }
    static get GHOST_STATE_SCARED() { return ghost_state_scared; }
    static get GHOST_STATE_DEAD() { return ghost_state_dead; }

    static _nextKillScore = 100;
    static get nextKillScore() {
        GhostBrainManual._nextKillScore *= 2;
        return GhostBrainManual._nextKillScore;
    }

    static resetNextKillScore() {
        GhostBrainManual._nextKillScore = 100;
    }

    constructor() {
        this._ghostBrainStrategyHoldingPin = new GhostBrainStrategyHoldingPin();
        this._ghostBrainStrategyWander = new GhostBrainStrategyWander();
        this._ghostBrainStrategyAttack = new GhostBrainStrategyAttack();
        this._ghostBrainStrategyScared = new GhostBrainStrategyScared();
        this._ghostBrainStrategyDead = new GhostBrainStrategyDead();
        this._currentGhostBrainStrategy = null;

        this._currentState = null;
        this._endHoldingPinTime = null;
        this._attackStateExpiration = moment();
        this._holdingPinDuration = 5.0;

        this.enterState(GhostBrainManual.GHOST_STATE_HOLDING_PIN);
    }

    getNextDirection(ghost, player, level) {
        this._changeStateIfNeeded(ghost, player, level);
        if (player.attackModeFinishTime <= moment()) {
            GhostBrainManual.resetNextKillScore();
        }

        return this._currentGhostBrainStrategy.getNextDirection(ghost, player, level);
    }

    get cellTransitionDuration() {
        return this._currentGhostBrainStrategy.cellTransitionDuration;
    }

    reset() {
        this.enterState(GhostBrainManual.GHOST_STATE_HOLDING_PIN);
    }

    enterState(state) {
        this._currentState = state;

        switch(state) {
            case GhostBrainManual.GHOST_STATE_HOLDING_PIN:
                let randomValue = Math.floor(Math.random() * this._holdingPinDuration);
                this._endHoldingPinTime = moment().add(randomValue, "s");
                this._currentGhostBrainStrategy = this._ghostBrainStrategyHoldingPin;
                break;
            case GhostBrainManual.GHOST_STATE_WANDER:
                this._currentGhostBrainStrategy = this._ghostBrainStrategyWander;
                break;
            case GhostBrainManual.GHOST_STATE_ATTACK:
                this._attackStateExpiration = moment().add(this._ghostBrainStrategyAttack.attackExpirationDuration, "s");
                this._currentGhostBrainStrategy = this._ghostBrainStrategyAttack;
                break;
            case GhostBrainManual.GHOST_STATE_SCARED:
                this._currentGhostBrainStrategy = this._ghostBrainStrategyScared;
                break;
            case GhostBrainManual.GHOST_STATE_DEAD:
                this._currentGhostBrainStrategy = this._ghostBrainStrategyDead;
                break;
            default:
                throw new Error("Unknown Strategy");
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
                if (!ghost.isAlive) {
                    this.enterState(GhostBrainManual.GHOST_STATE_DEAD);
                    ghost.killScore = GhostBrainManual.nextKillScore;
                    player.score += ghost.killScore;
                } else if (moment() >= player.attackModeFinishTime) {
                    this.enterState(GhostBrainManual.GHOST_STATE_WANDER);
                }
                break;
            case GhostBrainManual.GHOST_STATE_DEAD:
                if (ghost.location.equals(ghost.spawnLocation)) {
                    ghost.isAlive = true;
                    ghost.points.reset();
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