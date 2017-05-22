

class Location {
    constructor(x, y) {
        this._x = x;
        this._y = y;
    }

    clone() {
        return new Location(this.x, this.y);
    }

    // Perhaps this class should be immutable.
    // Let's roll with this and see how it turns out.
    set(x, y) {
        this._x = x;
        this._y = y;
    }

    setWithLocation(otherLocation) {
        this._x = otherLocation._x;
        this._y = otherLocation._y;
    }

    reset() {
        this._x = -1;
        this._y = -1;
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

    equals(otherLocation) {
        return (this._x === otherLocation._x) && (this._y === otherLocation._y);
    }

    isEqualTo(x, y) {
        return (this._x === x) && (this._y === y);
    }
}

export default Location;