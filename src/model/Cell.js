import Border from "./Border";
import BorderType from "./BorderType";
import Dot from "./Dot";


class Cell {

    constructor(id) {
        this._id = id;
        this._solidBorder = new Border();
        this._partialBorder = new Border();

        this._dotType = Dot.NONE;
    }

    equals(otherCell) {
        return this.id === otherCell.id &&
                this._solidBorder.equals(otherCell._solidBorder) &&
                this._partialBorder.equals(otherCell._partialBorder) &&
                this.dotType === otherCell.dotType;
    }

    setSolidBorder(borderType, value) {

        if (!BorderType.isValid(borderType)) {
            throw new Error("Invalid Border Type");
        }

        this._solidBorder[borderType] = !!value;
    }

    getSolidBorder(borderType) {

        if (!BorderType.isValid(borderType)) {
            throw new Error("Invalid Border Type");
        }

        return this._solidBorder[borderType];
    }

    setPartialBorder(borderType, value) {

        if (!BorderType.isValid(borderType)) {
            throw new Error("Invalid Border Type");
        }

        this._partialBorder[borderType] = !!value;
    }

    getPartialBorder(borderType) {

        if (!BorderType.isValid(borderType)) {
            throw new Error("Invalid Border Type");
        }

        return this._partialBorder[borderType];
    }

    get id() { return this._id; }
    get dotType() { return this._dotType; }
    set dotType(value) {
        if (!Dot.isValid(value)) {
            throw new Error("Invalid Dot Type");
        }

        this._dotType = value;
    }
}

export default Cell;