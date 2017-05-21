

class Location {
    constructor(x, y) {
        this._x = x;
        this._y = y;
    }

    get x() {
        return this._x;
    }

    set x(value) {
        this._x = value;
    }

    get y() {
        return this._y;
    }

    set y(value) {
        this._y = value;
    }

    get isValid() {
        return this._x >= 0 && this._y >= 0;
    }

    toArray(yFirst=true) {
        if (yFirst) {
            return [this._y, this._x];
        }

        return [this._x, this._y];
    }

    toString() {
        return "(" + this._x + ", " + this._y + ")";
    }

    static fromIndexArray(indexArray, yFirst=true) {
        if (yFirst) {
            return new Location(indexArray[1], indexArray[0]);
        }

        return new Location(indexArray[0], indexArray[1]);
    }
}

export default Location;