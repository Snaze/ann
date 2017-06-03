import DataSourceBase from "./DataSourceBase";

const border_color_classic = 0;
const border_color_pink = 1;
const border_color_aqua = 2;
const border_color_orange = 3;
const border_color_purple = 4;
const valid_colors = [
    border_color_classic,
    border_color_pink,
    border_color_aqua,
    border_color_orange,
    border_color_purple
];

class Border extends DataSourceBase {
    static get COLOR_CLASSIC() { return border_color_classic; }
    static get COLOR_PINK() { return border_color_pink; }
    static get COLOR_AQUA() { return border_color_aqua; }
    static get COLOR_ORANGE() { return border_color_orange; }
    static get COLOR_PURPLE() { return border_color_purple; }

    constructor(left=false, top=false, right=false, bottom=false, color=border_color_classic) {
        super();

        this._left = left;
        this._top = top;
        this._right = right;
        this._bottom = bottom;
        this._color = color;
    }

    toJSON() {
        return {
            _left: this._left,
            _top: this._top,
            _right: this._right,
            _bottom: this._bottom,
            _color: this._color
        };
    }

    clone(direction="none") {
        if (direction === "none") {
            return new Border(this._left, this._top, this._right, this._bottom, this._color);
        }

        if (direction === "horizontal") {
            return new Border(this._right, this._top, this._left, this._bottom, this._color);
        }

        if (direction === "vertical") {
            return new Border(this._left, this._bottom, this._right, this._top, this._color);
        }

        throw new Error("invalid direction found");
    }

    set left (value) {
        this._setValueAndRaiseOnChange("_left", value);
    }
    get left () {return this._left}

    // THESE DIRECTION PROPERTIES ARE A HACK TO MAKE THE BorderTypes behave like the Direction class
    // TODO: Consolidate all usages of BorderType into Direction
    set direction_up (value) {
        this.top = value;
    }

    get direction_up() {
        return this.top;
    }

    set direction_down (value) {
        this.bottom = value;
    }

    get direction_down() {
        return this.bottom;
    }

    set direction_left (value) {
        this.left = value;
    }

    get direction_left() {
        return this.left;
    }

    set direction_right (value) {
        this.right = value;
    }

    get direction_right() {
        return this.right;
    }

    set top (value) {
        this._setValueAndRaiseOnChange("_top", value);
    }
    get top () {return this._top}

    set right (value) {
        this._setValueAndRaiseOnChange("_right", value);
    }
    get right () {return this._right}

    set bottom (value) {
        this._setValueAndRaiseOnChange("_bottom", value);
    }
    get bottom () {return this._bottom}


    get color() {
        return this._color;
    }

    set color(value) {
        if (valid_colors.indexOf(value) < 0) {
            throw new Error("Invalid Color");
        }

        this._setValueAndRaiseOnChange("_color", value);
    }

    equals(otherBorder) {
        return this.left === otherBorder.left &&
                this.top === otherBorder.top &&
                this.right === otherBorder.right &&
                this.bottom === otherBorder.bottom &&
                this.color === otherBorder.color;
    }
}

export default Border;