import GhostBrainStrategyHoldingPin from "./GhostBrainStrategies/GhostBrainStrategyHoldingPin";
import moment from "../../../../node_modules/moment/moment";
import GhostBrainStrategyWander from "./GhostBrainStrategies/GhostBrainStrategyWander";

const ghost_state_wander = 0;
const ghost_state_holding_pin = 1;

class GhostBrainManual {
    static get GHOST_STATE_WANDER() { return ghost_state_wander; }
    static get GHOST_STATE_HOLDING_PIN() { return ghost_state_holding_pin; }

    constructor() {
        this._ghostBrainStrategyHoldingPin = new GhostBrainStrategyHoldingPin();
        this._ghostBrainStrategyWander = new GhostBrainStrategyWander();

        this._currentState = null;
        this._endHoldingPinTime = null;

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
                break;
            default:
                break;
        }
    }
}

export default GhostBrainManual;