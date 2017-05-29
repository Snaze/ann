import DataSourceBase from "./DataSourceBase";

class Location extends DataSourceBase {
    constructor(x, y) {
        super();

        this._x = x;
        this._y = y;
    }

    clone() {
        return new Location(this.x, this.y);
    }

    // Perhaps this class should be immutable.
    // Let's roll with this and see how it turns out.
    set(x, y) {
        this.x = x;
        this.y = y;
    }

    setWithLocation(otherLocation) {
        this.x = otherLocation.x;
        this.y = otherLocation.y;
    }

    reset() {
        this.x = -1;
        this.y = -1;
    }

    get x() {
        return this._x;
    }

    set x(value) {
        this._setValueAndRaiseOnChange("_x", value);
    }

    get y() {
        return this._y;
    }

    set y(value) {
        this._setValueAndRaiseOnChange("_y", value);
    }

    get isValid() {
        return this.x >= 0 && this.y >= 0;
    }

    toArray(yFirst=true) {
        if (yFirst) {
            return [this.y, this.x];
        }

        return [this.x, this.y];
    }

    toString() {
        return "(" + this.x + ", " + this.y + ")";
    }

    static fromIndexArray(indexArray, yFirst=true) {
        if (yFirst) {
            return new Location(indexArray[1], indexArray[0]);
        }

        return new Location(indexArray[0], indexArray[1]);
    }

    equals(otherLocation) {
        return (this.x === otherLocation.x) && (this.y === otherLocation.y);
    }

    isEqualTo(x, y) {
        return (this.x === x) && (this.y === y);
    }

    isAbove(otherLocation, maxHeight=null) {
        if (otherLocation.isEqualTo(this.x, this.y + 1)) {
            return true;
        }

        return ((maxHeight !== null) &&
            (otherLocation.y === 0) &&
            (this.isEqualTo(otherLocation.x, maxHeight - 1)));
    }

    isLeftOf(otherLocation, maxWidth=null) {
        if (otherLocation.isEqualTo(this.x + 1, this.y)) {
            return true;
        }

        return ((maxWidth !== null) &&
                (otherLocation.x === 0) &&
                this.isEqualTo(maxWidth - 1, otherLocation.y));
    }

    isRightOf(otherLocation, maxWidth=null) {
        if (otherLocation.isEqualTo(this.x - 1, this.y)) {
            return true;
        }

        return ((maxWidth !== null) &&
                (otherLocation.x === (maxWidth - 1)) &&
                this.isEqualTo(0, otherLocation.y));
    }

    isBelow(otherLocation, maxHeight=null) {
        if (otherLocation.isEqualTo(this.x, this.y - 1)) {
            return true;
        }

        return ((maxHeight !== null) &&
                (otherLocation.y === (maxHeight - 1)) &&
                this.isEqualTo(otherLocation.x, 0));
    }
}

export default Location;