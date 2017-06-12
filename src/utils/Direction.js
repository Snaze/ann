

// TODO: Consolidate these with the ones in Entity.js and in the Border.js
const up = "direction_up";
const down = "direction_down";
const left = "direction_left";
const right = "direction_right";
const none = "direction_none";
const all = [up, down, left, right, none];

class Direction {
    static get UP() {return up;}
    static get DOWN() {return down;}
    static get LEFT() {return left;}
    static get RIGHT() {return right;}
    static get NONE() {return none;}

    static isValid(value) {
        return all.indexOf(value) > -1;
    }

    static getOpposite(value) {
        if (value === Direction.UP) {
            return Direction.DOWN;
        }

        if (value === Direction.DOWN) {
            return Direction.UP;
        }

        if (value === Direction.LEFT) {
            return Direction.RIGHT;
        }

        if (value === Direction.RIGHT) {
            return Direction.LEFT;
        }

        if (value === Direction.NONE) {
            return Direction.NONE;
        }

        throw new Error("Invalid Direction Entered");
    }

    static toBinary(theDirection) {
        if (!Direction.isValid(theDirection)) {
            throw new Error("Invalid direction");
        }

        switch (theDirection) {
            case Direction.LEFT:
                return "00";
            case Direction.UP:
                return "01";
            case Direction.RIGHT:
                return "10";
            case Direction.DOWN:
                return "11";
            default:
                // None doesnt need a direction I dont think
                throw new Error("Invalid direction");
        }
    }

    static decimalToDirection(theValue) {
        if (theValue < 0 || theValue >= 4) {
            throw new Error("Invalid value");
        }

        switch (theValue) {
            case 0:
                return Direction.LEFT;
            case 1:
                return Direction.UP;
            case 2:
                return Direction.RIGHT;
            case 3:
                return Direction.DOWN;
            default:
                throw new Error("Invalid Value");
        }
    }
}

export default Direction;