import Direction from "../utils/Direction";
import Location from "./Location";
import DataSourceBase from "./DataSourceBase";

const red = 0;
const blue = 1;
const pink = 2;
const orange = 3;
const valid_color = [red, blue, pink, orange];

class Ghost extends DataSourceBase {

    static get RED() { return red; }
    static get BLUE() { return blue; }
    static get PINK() { return pink; }
    static get ORANGE() { return orange; }

    static colorIsValid(color) {
        return valid_color.indexOf(color) > -1;
    }

    constructor(direction, location, color) {
        super();

        if (!Direction.isValid(direction)) {
            throw new Error ("Invalid direction");
        }

        if (!(location instanceof Location)) {
            throw new Error ("Invalid Location");
        }

        if (!Ghost.colorIsValid(color)) {
            throw new Error ("Invalid Color");
        }

        this._locationOnChangeCallbackRef = (e) => this._locationOnChangeCallback(e);
        this._direction = direction;
        this._location = location;
        this._location.addOnChangeCallback(this._locationOnChangeCallbackRef);
        this._color = color;
    }

    removeAllCallbacks() {
        super.removeAllCallbacks();

        this._location.removeOnChangeCallback(this._locationOnChangeCallbackRef);
    }

    _locationOnChangeCallback(e) {
        this._raiseOnChangeCallbacks("_location." + e.source);
    }

    get direction() {
        return this._direction;
    }

    set direction(value) {
        this._setValueAndRaiseOnChange("_direction", value);
    }

    get location() {
        return this._location;
    }

    set location(value) {
        this._setValueAndRaiseOnChange("_location", value);
    }

    get color() {
        return this._color;
    }

    set color(value) {
        this._setValueAndRaiseOnChange("_color", value);
    }
}

export default Ghost;