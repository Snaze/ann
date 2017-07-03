import DataSourceBase from "./DataSourceBase";
import Direction from "../utils/Direction";

class Location extends DataSourceBase {
    constructor(x, y) {
        super();

        this._x = x;
        this._y = y;
        this._cellId = null;
    }

    toJSON() {
        return {
            _x: this._x,
            _y: this._y
        };
    }

    clone() {
        return new Location(this.x, this.y);
    }

    // Perhaps this class should be immutable.
    // Let's roll with this and see how it turns out.
    set(x, y) {
        this._cellId = null;
        this.x = x;
        this.y = y;
    }

    setWithLocation(otherLocation) {
        this._cellId = null;
        this.x = otherLocation.x;
        this.y = otherLocation.y;
    }

    reset() {
        this._cellId = null;
        this.x = -1;
        this.y = -1;
    }

    get x() {
        return this._x;
    }

    set x(value) {
        this._cellId = null;
        this._setValueAndRaiseOnChange("_x", value);
    }

    get y() {
        return this._y;
    }

    set y(value) {
        this._cellId = null;
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

    static getDirection(fromLocation, toLocation, maxWidth=null, maxHeight=null) {
        if (fromLocation.isAbove(toLocation, maxHeight)) {
            return Direction.DOWN;
        }

        if (fromLocation.isLeftOf(toLocation, maxWidth)) {
            return Direction.RIGHT;
        }

        if (fromLocation.isRightOf(toLocation, maxWidth)) {
            return Direction.LEFT;
        }

        if (fromLocation.isBelow(toLocation, maxHeight)) {
            return Direction.UP;
        }

        return Direction.NONE;
    }


    toCellId() {
        if (this._cellId === null) {
            this._cellId = this.y + "_" + this.x;
        }

        return this._cellId;
        // return this.y + "_" + this.x;
    }

    distance(otherLocation) {
        return Math.sqrt(Math.pow((this.y - otherLocation.y), 2.0) + Math.pow((this.x - otherLocation.x), 2.0));
    }

    manhattanDistance(otherLocation) {
        return Math.abs(this.y - otherLocation.y) + Math.abs(this.x - otherLocation.x);
    }

    moveInDirection(direction, levelHeight, levelWidth) {
        switch (direction) {
            case Direction.DOWN:
                if ((this.y + 1) < levelHeight) {
                    this.y += 1;
                } else {
                    this.y = 0;
                }
                break;
            case Direction.UP:
                if ((this.y - 1) >= 0) {
                    this.y -= 1;
                } else {
                    this.y = levelHeight - 1;
                }
                break;
            case Direction.LEFT:
                if ((this.x - 1) >= 0) {
                    this.x -= 1;
                } else {
                    this.x = levelWidth - 1;
                }
                break;
            case Direction.RIGHT:
                if ((this.x + 1) < levelWidth) {
                    this.x += 1;
                } else {
                    this.x = 0;
                }
                break;
            case Direction.NONE:
                break;
            default:
                throw new Error("invalid direction");
        }

        return this;
    }

    getDelta(otherLocation) {
        return {
            x: this.x - otherLocation.x,
            y: this.y - otherLocation.y
        };
    }
}

export default Location;