import GhostBrainStrategyHoldingPin from "./GhostBrainStrategies/GhostBrainStrategyHoldingPin";

const ghost_state_wander = 0;
const ghost_state_holding_pin = 1;

class GhostBrainManual {
    static get GHOST_STATE_WANDER() { return ghost_state_wander; }
    static get GHOST_STATE_HOLDING_PIN() { return ghost_state_holding_pin; }

    constructor() {
        this._currentState = GhostBrainManual.GHOST_STATE_HOLDING_PIN;
        this._ghostBrainStrategyHoldingPin = new GhostBrainStrategyHoldingPin();
    }

    getNextLocation(ghost, level) {
        if (this._currentState === GhostBrainManual.GHOST_STATE_HOLDING_PIN) {
            return this._ghostBrainStrategyHoldingPin.getNextLocation(ghost, level);
        }

        throw new Error("You should never get here");
    }
}

export default GhostBrainManual;