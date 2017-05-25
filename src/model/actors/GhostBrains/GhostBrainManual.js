
const ghost_state_wander = 0;
const ghost_state_holding_pin = 1;

class GhostBrainManual {
    static get GHOST_STATE_WANDER() { return ghost_state_wander; }
    static get GHOST_STATE_HOLDING_PIN() { return ghost_state_holding_pin; }

    constructor() {
        this._currentState = GhostBrainManual.GHOST_STATE_HOLDING_PIN;
    }

    getNextLocation() {

    }
}