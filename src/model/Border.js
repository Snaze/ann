
class Border {
    constructor(left=false, top=false, right=false, bottom=false) {
        this._left = left;
        this._top = top;
        this._right = right;
        this._bottom = bottom;
    }

    clone(direction="none") {
        if (direction === "none") {
            return new Border(this._left, this._top, this._right, this._bottom);
        }

        if (direction === "horizontal") {
            return new Border(this._right, this._top, this._left, this._bottom);
        }

        if (direction === "vertical") {
            return new Border(this._left, this._bottom, this._right, this._top);
        }

        throw new Error("invalid direction found");
    }

    set left (value) {this._left = value;}
    get left () {return this._left}

    set top (value) {this._top = value;}
    get top () {return this._top}

    set right (value) {this._right = value;}
    get right () {return this._right}

    set bottom (value) {this._bottom = value;}
    get bottom () {return this._bottom}

    equals(otherBorder) {
        return this.left === otherBorder.left &&
                this.top === otherBorder.top &&
                this.right === otherBorder.right &&
                this.bottom === otherBorder.bottom;
    }
}

export default Border;