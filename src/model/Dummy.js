import DataSourceBase from "./DataSourceBase";

class Dummy extends DataSourceBase {

    constructor() {
        super();

        this._tickNumber = 0;
        this._interval = setInterval((e) => this.tickCallback(e), 1000);
    }

    get tickNumber() {
        return this._tickNumber;
    }

    set tickNumber(value) {
        this._setValueAndRaiseOnChange("_tickNumber", value);
    }

    tickCallback(e) {
        this.tickNumber = this.tickNumber + 1;

    }
}

export default Dummy;