import DataSourceBase from "./DataSourceBase";
import Location from "./Location";
import moment from "../../node_modules/moment/moment";

const points_type_ghost_kill = 0;
const points_type_power_up = 1;
const points_type_none = 2;
// const valid_points_type = [points_type_ghost_kill, points_type_power_up, points_type_none];

const points_state_visible = 0;
const points_state_fade = 1;
const points_state_invisible = 2;

class Points extends DataSourceBase {

    static get POINTS_TYPE_GHOST_KILL() { return points_type_ghost_kill; }
    static get POINTS_TYPE_POWER_UP() { return points_type_power_up; }
    static get POINTS_TYPE_NONE() { return points_type_none; }

    static get POINTS_STATE_VISIBLE() { return points_state_visible; }
    static get POINTS_STATE_FADE() { return points_state_fade; }
    static get POINTS_STATE_INVISIBLE() { return points_state_invisible; }

    constructor(pointsType) {
        super();

        this._pointsType = pointsType;
        this._amount = 0;
        if (this.pointsType === Points.POINTS_TYPE_GHOST_KILL) {
            this._amount = 200;
        }
        this._location = this._wireUp("_location", new Location(-1, -1));
        this._pointsState = Points.POINTS_STATE_INVISIBLE;
        this._fadeTime = moment();
        this._vanishTime = moment();
        this._nextTick = moment().add(250, "ms");
    }

    reset() {
        let self = this;
        setTimeout(function () {
            self.amount = 200;
            self.location.set(-1, -1);
            self._setValueAndRaiseOnChange("_pointsState", Points.POINTS_STATE_INVISIBLE);
        }, 4000);
    }

    removeAllCallbacks() {
        super.removeAllCallbacks();

    }

    timerTick(e) {
        let now = moment();
        let toRet = false;

        if (now >= this._nextTick) {
            if (this._vanishTime <= now) {
                this._setValueAndRaiseOnChange("_pointsState", Points.POINTS_STATE_INVISIBLE);
                // console.log("timerTick - invisible");
            } else if (this._fadeTime <= now) {
                this._setValueAndRaiseOnChange("_pointsState", Points.POINTS_STATE_FADE);
                // console.log("timerTick - fade");
            } else {
                this._setValueAndRaiseOnChange("_pointsState", Points.POINTS_STATE_VISIBLE);
                // console.log("timerTick - visible");
            }

            this._nextTick = moment().add(250, "ms");
            toRet = true;
        }

        return toRet;
    }

    show(theLocation) {
        let now = moment();
        this._fadeTime = now.clone().add(2, "s");
        this._vanishTime = now.clone().add(4, "s");
        this.location.setWithLocation(theLocation);
    }

    _nestedDataSourceChanged(e) {

        // this._resetFadeTime();
        super._nestedDataSourceChanged(e);
    }

    get pointsType() {
        return this._pointsType;
    }

    get amount() {
        return this._amount;
    }

    set amount(value) {
        if (value < 0) {
            throw new Error("Points should be positive");
        }

        // this._resetFadeTime();
        this._setValueAndRaiseOnChange("_amount", value);
    }

    get location() {
        return this._location;
    }

    get pointsState() {
        return this._pointsState;
    }
}

export default Points;