

// TODO: Consolidate these with the ones in Entity.js and in the Border.js
const up = "direction_up";
const down = "direction_down";
const left = "direction_left";
const right = "direction_right";
const all = [up, down, left, right];

class Direction {
    static get UP() {return up;}
    static get DOWN() {return down;}
    static get LEFT() {return left;}
    static get RIGHT() {return right;}

    static isValid(value) {
        return all.indexOf(value) > -1;
    }
}

export default Direction;