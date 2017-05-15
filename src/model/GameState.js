let _singleton = Symbol();

class GameState {

    constructor(singletonToken) {
        if (_singleton !== singletonToken){
            throw new Error('Cannot instantiate directly.');
        }

        this._level = null;
    }

    static get instance() {
        if(!this[_singleton]) {
            this[_singleton] = new GameState(_singleton);
        }

        return this[_singleton];
    }

    get level() { return this._level; }
    set level(value) { this._level = value; }


}

export default GameState;