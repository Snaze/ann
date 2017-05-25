import Direction from "../../utils/Direction";
import Location from "../Location";
import ActorBase from "./ActorBase";

const red = 0;
const blue = 1;
const pink = 2;
const orange = 3;
const valid_color = [red, blue, pink, orange];

class Ghost extends ActorBase {

    static get RED() { return red; }
    static get BLUE() { return blue; }
    static get PINK() { return pink; }
    static get ORANGE() { return orange; }

    static colorIsValid(color) {
        return valid_color.indexOf(color) > -1;
    }

    constructor(direction, location, level, color) {
        super(direction, location, level);

        if (!Ghost.colorIsValid(color)) {
            throw new Error ("Invalid Color");
        }

        this._color = color;
    }

    get color() {
        return this._color;
    }

    set color(value) {
        this._setValueAndRaiseOnChange("_color", value);
    }
}

export default Ghost;