import Direction from "../utils/Direction";
import Location from "./Location";

const red = 0;
const blue = 1;
const pink = 2;
const orange = 3;
const valid_color = [red, blue, pink, orange];

class Ghost {

    static get RED() { return red; }
    static get BLUE() { return blue; }
    static get PINK() { return pink; }
    static get ORANGE() { return orange; }

    static colorIsValid(color) {
        return valid_color.indexOf(color) > -1;
    }

    constructor(direction, location, color) {
        if (!Direction.isValid(direction)) {
            throw new Error ("Invalid direction");
        }

        if (!(location instanceof Location)) {
            throw new Error ("Invalid Location");
        }

        if (!Ghost.colorIsValid(color)) {
            throw new Error ("Invalid Color");
        }

        this._direction = direction;
        this._location = location;
        this._color = color;
    }

    get direction() {
        return this._direction;
    }

    set direction(value) {
        this._direction = value;
    }

    get location() {
        return this._location;
    }

    set location(value) {
        this._location = value;
    }

    get color() {
        return this._color;
    }

    set color(value) {
        this._color = value;
    }
}

export default Ghost;