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

    constructor(level, color) {
        super(level);

        if (!Ghost.colorIsValid(color)) {
            throw new Error ("Invalid Color");
        }

        this._color = color;
        switch(this._color) {
            case Ghost.RED:
                this.location.setWithLocation(level.ghostRedLocation);
                break;
            case Ghost.BLUE:
                this.location.setWithLocation(level.ghostBlueLocation);
                break;
            case Ghost.PINK:
                this.location.setWithLocation(level.ghostPinkLocation);
                break;
            case Ghost.ORANGE:
                this.location.setWithLocation(level.ghostOrangeLocation);
                break;
            default:
                throw new Error("Unknown Ghost color detected");
        }
        this._spawnLocation = this.location.clone();
    }

    get color() {
        return this._color;
    }

    set color(value) {
        this._setValueAndRaiseOnChange("_color", value);
    }

    timerTick(e) {

    }
}

export default Ghost;