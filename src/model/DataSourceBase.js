import Eventer from "../utils/Eventer";

class DataSourceBase {
    constructor() {
        this._eventer = new Eventer();
    }

    addOnChangeCallback(callback) {
        this._eventer.addCallback(callback);
    }

    removeOnChangeCallback(callback) {
        this._eventer.removeCallback(callback);
    }

    removeAllCallbacks() {
        this._eventer.removeAllCallbacks();
    }

    _raiseOnChangeCallbacks(source) {
        this._eventer.raiseEvent({
            object: this,
            source: source
        });
    }

    _setValueAndRaiseOnChange(property, newValue) {
        if ((typeof(this[property]) !== 'undefined') &&
            this[property] === newValue) {
            return;
        }

        this[property] = newValue;
        this._raiseOnChangeCallbacks(property);
    }
}

export default DataSourceBase;