
const top = "top";
const left = "left";
const right = "right";
const bottom = "bottom";

const all = [left, top, right, bottom];

class BorderType {
    static get LEFT() { return left; }
    static get TOP() { return top; }
    static get RIGHT() { return right; }
    static get BOTTOM() { return bottom; }
    static get ALL() { return all; }

    static isValid(borderType) {
        return all.indexOf(borderType) > -1;
    }

}

export default BorderType;