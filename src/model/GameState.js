let _singleton = Symbol();

// TODO: Rename this class.  I think this name doesn't make sense anymore.
class GameState {

    constructor(singletonToken) {
        if (_singleton !== singletonToken){
            throw new Error('Cannot instantiate directly.');
        }

        this._stepNumber = 0;
        this._interval = null;
    }

    static get instance() {
        if(!this[_singleton]) {
            this[_singleton] = new GameState(_singleton);
        }

        return this[_singleton];
    }

    static tickHandlers = [];

    intervalTick(e) {
        this._stepNumber += 1;
        let theStepNumber = this._stepNumber;

        GameState.tickHandlers.forEach(function (th) {
            th(theStepNumber);
        });
    }

    start(tickFrequency = 250, handler) {
        if (this._interval !== null) {
            throw new Error("Interval already started");
        }

        GameState.tickHandlers.push(handler);
        this._interval = setInterval((e) => this.intervalTick(e), tickFrequency);
    }

    stop(handler) {
        if (this._interval === null) {
            throw new Error("Interval already stopped");
        }

        let index = GameState.tickHandlers.indexOf(handler);
        if (index > -1) {
            GameState.tickHandlers.splice(index, 1);
        }

        clearInterval(this._interval);
        this._interval = null;
    }

    get stepNumber() {
        return this._stepNumber;
    }


}

export default GameState;