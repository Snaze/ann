

class Eventer {
    constructor() {
        this._callbacks = [];
    }

    addCallback(theCallback) {
        this._callbacks.push(theCallback);
    }

    removeCallback(theCallback) {

        let theIndex = this._callbacks.indexOf(theCallback);
        if (theIndex >= 0) {
            this._callbacks.splice(theIndex, 1);
        }
    }

    raiseEvent(data=null) {
        if (data === null) {
            data = {};
        }

        this._callbacks.forEach(function (theCallback) {
           theCallback(data);
        });
    }
}

export default Eventer;