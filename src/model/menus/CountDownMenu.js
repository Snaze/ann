import DataSourceBase from "../DataSourceBase";

class CountDownMenu extends DataSourceBase {
    constructor() {
        super();

        this._count = 3;
        this._finishText = "GO!";
        this._callback = null;
        this._intervalTickRef = (e) => this.intervalTick(e);
        this._interval = null;
        this._showAnimation = false;
    }

    start() {
        this.stop();

        this._interval = setInterval(this._intervalTickRef, 1000);
    }

    stop() {
        if (this._interval !== null) {
            clearInterval(this._interval);
            this._interval = null;
        }
    }

    intervalTick(e) {
        this.count -= 1;

        if (this.count <= 0) {
            this.stop();

            if (this._callback) {
                setTimeout(function () {
                    this._callback(this);
                }.bind(this), 1000);
            }
        }
    }

    get count() {
        return this._count;
    }

    set count(value) {
        this._setValueAndRaiseOnChange("_count", value);
    }

    get callback() {
        return this._callback;
    }

    set callback(value) {
        this._setValueAndRaiseOnChange("_callback", value);
    }

    get finishText() {
        return this._finishText;
    }

    set finishText(value) {
        this._setValueAndRaiseOnChange("_finishText", value);
    }

    get showAnimation() {
        return this._showAnimation;
    }

    set showAnimation(value) {
        this._setValueAndRaiseOnChange("_showAnimation", value);
    }
}

export default CountDownMenu;