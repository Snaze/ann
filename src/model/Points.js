import DataSourceBase from "./DataSourceBase";
import Location from "./Location";
import moment from "../../node_modules/moment/moment";
import GameTimer from "./GameTimer";

const points_type_ghost_kill = 0;
const points_type_power_up = 1;
const points_type_none = 2;
const valid_points_type = [points_type_ghost_kill, points_type_power_up, points_type_none];

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

    constructor() {
        super();

        this._pointsType = Points.POINTS_TYPE_NONE;
        this._amount = 0;
        this._location = this._wireUp("_location", new Location(-1, -1));
        this._pointsState = Points.POINTS_STATE_INVISIBLE;
        this._fadeTime = moment();
        this._vanishTime = moment();
        this._timerTickRef = (e) => this._timerTick(e);
        GameTimer.instance.addCallback(this._timerTickRef);
        this._nextTick = moment().add(250, "ms");
    }

    reset() {
        this.pointsType = Points.POINTS_TYPE_NONE;
        this.amount = 0;
        this.location.set(-1, -1);
    }

    removeAllCallbacks() {
        super.removeAllCallbacks();

        GameTimer.instance.removeCallback(this._timerTickRef);
    }

    _timerTick(e) {
        let now = moment();

        if (now >= this._nextTick) {
            if (this._vanishTime <= now) {
                this._setValueAndRaiseOnChange("_pointsState", Points.POINTS_STATE_INVISIBLE);
            } else if (this._fadeTime <= now) {
                this._setValueAndRaiseOnChange("_pointsState", Points.POINTS_STATE_FADE);
            } else {
                this._setValueAndRaiseOnChange("_pointsState", Points.POINTS_STATE_VISIBLE);
            }

            this._nextTick = moment().add(250, "ms");
        }
    }

    _resetFadeTime() {
        let now = moment();
        this._fadeTime = now.clone().add(2, "s");
        this._vanishTime = now.clone().add(4, "s");
    }

    _nestedDataSourceChanged(e) {

        this._resetFadeTime();
        super._nestedDataSourceChanged(e);
    }

    get pointsType() {
        return this._pointsType;
    }

    set pointsType(value) {
        if (valid_points_type.indexOf(value) < 0) {
            throw new Error("Invalid Points Type");
        }

        this._resetFadeTime();
        this._setValueAndRaiseOnChange("_pointsType", value);
    }

    get amount() {
        return this._amount;
    }

    set amount(value) {
        if (value < 0) {
            throw new Error("Points should be positive");
        }

        this._resetFadeTime();
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