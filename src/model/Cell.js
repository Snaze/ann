import Border from "./Border";
import BorderType from "./BorderType";
import Dot from "./Dot";
import DataSourceBase from "./DataSourceBase";
import Location from "./Location";

class Cell extends DataSourceBase {

    constructor(id) {
        super();

        this._id = id;
        this._solidBorder = this._wireUp("_solidBorder", new Border());
        this._partialBorder = this._wireUp("_partialBorder", new Border());

        this._dotType = Dot.NONE;
        this._selected = false;

        this._isPlayerSpawn = false;
        this._isGhostRedSpawn = false;
        this._isGhostPinkSpawn = false;
        this._isGhostBlueSpawn = false;
        this._isGhostOrangeSpawn = false;
        this._isActive = true;

        let tempArray = this._id.split("_");
        let x = parseInt(tempArray[1], 10);
        let y = parseInt(tempArray[0], 10);
        this._location = this._wireUp("_location", new Location(x, y));
        this._editMode = false;
        this._blinkBorder = false;
        this._highlighted = false;
    }

    toJSON() {
        return {
            _id: this._id,
            _solidBorder: this._solidBorder.toJSON(),
            _partialBorder: this._partialBorder.toJSON(),
            _dotType: this._dotType,
            _selected: this._selected,
            _isPlayerSpawn: this._isPlayerSpawn,
            _isGhostRedSpawn: this._isGhostRedSpawn,
            _isGhostPinkSpawn: this._isGhostPinkSpawn,
            _isGhostBlueSpawn: this._isGhostBlueSpawn,
            _isGhostOrangeSpawn: this._isGhostOrangeSpawn,
            _isActive: this._isActive,
            _location: this._location.toJSON()
        };
    }

    clone(theId, direction="none") {
        let toRet = new Cell(theId);

        toRet._solidBorder = this._solidBorder.clone(direction);
        toRet._partialBorder = this._partialBorder.clone(direction);
        toRet._dotType = this._dotType;
        toRet._selected = this._selected;
        toRet._isPlayerSpawn = this._isPlayerSpawn;
        toRet._isGhostRedSpawn = this._isGhostRedSpawn;
        toRet._isGhostPinkSpawn = this._isGhostPinkSpawn;
        toRet._isGhostBlueSpawn = this._isGhostBlueSpawn;
        toRet._isGhostOrangeSpawn = this._isGhostOrangeSpawn;
        toRet._isActive = this._isActive;
        toRet._location = this._location.clone();
        toRet._editMode = this._editMode;
        toRet._blinkBorder = this._blinkBorder;

        // I'LL LEAVE IT AS THE RESPONSIBLITY OF THE CALLER TO RE-ASSIGN
        // THE EVENT HANDLERS

        return toRet;
    }

    setAllSpawnValuesFalse(fromProperty="") {

        if (fromProperty !== "isPlayerSpawn") {
            this.isPlayerSpawn = false;
        }

        if (fromProperty !== "isGhostBlueSpawn") {
            this.isGhostBlueSpawn = false;
        }

        if (fromProperty !== "isGhostOrangeSpawn") {
            this.isGhostOrangeSpawn = false;
        }

        if (fromProperty !== "isGhostPinkSpawn") {
            this.isGhostPinkSpawn = false;
        }

        if (fromProperty !== "isGhostRedSpawn") {
            this.isGhostRedSpawn = false;
        }
    }

    get isPlayerSpawn() {
        return this._isPlayerSpawn;
    }

    set isPlayerSpawn(value) {
        if (value) {
            this.setAllSpawnValuesFalse("isPlayerSpawn");
        }

        this._setValueAndRaiseOnChange("_isPlayerSpawn", value);
    }

    get isGhostRedSpawn() {
        return this._isGhostRedSpawn;
    }

    set isGhostRedSpawn(value) {
        if (value) {
            this.setAllSpawnValuesFalse("isGhostRedSpawn");
        }

        this._setValueAndRaiseOnChange("_isGhostRedSpawn", value);
    }

    get isGhostPinkSpawn() {
        return this._isGhostPinkSpawn;
    }

    set isGhostPinkSpawn(value) {
        if (value) {
            this.setAllSpawnValuesFalse("isGhostPinkSpawn");
        }

        this._setValueAndRaiseOnChange("_isGhostPinkSpawn", value);
    }

    get isGhostBlueSpawn() {
        return this._isGhostBlueSpawn;
    }

    set isGhostBlueSpawn(value) {
        if (value) {
            this.setAllSpawnValuesFalse("isGhostBlueSpawn");
        }

        this._setValueAndRaiseOnChange("_isGhostBlueSpawn", value);
    }

    get isGhostOrangeSpawn() {
        return this._isGhostOrangeSpawn;
    }

    set isGhostOrangeSpawn(value) {
        if (value) {
            this.setAllSpawnValuesFalse("isGhostOrangeSpawn");
        }

        this._setValueAndRaiseOnChange("_isGhostOrangeSpawn", value);
    }

    get isActive() {
        return this._isActive;
    }

    set isActive(value) {
        this._setValueAndRaiseOnChange("_isActive", value);
    }

    get selected() {
        return this._selected;
    }

    set selected(value) {
        this._setValueAndRaiseOnChange("_selected", value);
    }

    get solidBorder() {
        return this._solidBorder;
    }

    get partialBorder() {
        return this._partialBorder;
    }

    equals(otherCell) {
        return this.id === otherCell.id &&
                this._solidBorder.equals(otherCell._solidBorder) &&
                this._partialBorder.equals(otherCell._partialBorder) &&
                this.dotType === otherCell.dotType &&
                this._selected === otherCell._selected &&
                this._isPlayerSpawn === otherCell._isPlayerSpawn &&
                this._isGhostRedSpawn === otherCell._isGhostRedSpawn &&
                this._isGhostPinkSpawn === otherCell._isGhostPinkSpawn &&
                this._isGhostBlueSpawn === otherCell._isGhostBlueSpawn &&
                this._isActive === otherCell._isActive &&
                this._location.equals(otherCell.location) &&
                this.blinkBorder === otherCell.blinkBorder;
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

        this._setValueAndRaiseOnChange("_dotType", value);
    }

    toggleBorder(borderType) {
        if (!BorderType.isValid(borderType)) {
            throw new Error("Invalid border type");
        }

        if (!this._solidBorder[borderType] && !this._partialBorder[borderType]) {
            this._solidBorder[borderType] = true;
            this._partialBorder[borderType] = false;
        } else if (this._solidBorder[borderType] && !this._partialBorder[borderType]) {
            this._solidBorder[borderType] = false;
            this._partialBorder[borderType] = true;
        } else if (!this._solidBorder[borderType] && this._partialBorder[borderType]) {
            this._solidBorder[borderType] = false;
            this._partialBorder[borderType] = false;
        }
    }

    toggleIsActive() {
        this.isActive = !this.isActive;
    }

    toggleDot() {
        if (this.dotType === Dot.NONE) {
            this.dotType = Dot.LITTLE;
        } else if (this._dotType === Dot.LITTLE) {
            this.dotType = Dot.BIG;
        } else if (this._dotType === Dot.BIG) {
            this.dotType = Dot.NONE;
        }
    }

    get location() {
        return this._location;
    }

    get x() {
        return this._location.x;
    }

    get y() {
        return this._location.y;
    }

    get editMode() {
        return this._editMode;
    }

    set editMode(value) {
        this._setValueAndRaiseOnChange("_editMode", value);
    }

    get blinkBorder() {
        return this._blinkBorder;
    }

    set blinkBorder(value) {
        this._setValueAndRaiseOnChange("_blinkBorder", value);
    }

    get highlighted() {
        return this._highlighted;
    }

    set highlighted(value) {
        this._setValueAndRaiseOnChange("_highlighted", value);
    }

    canTraverseTo(otherCell, maxWidth, maxHeight, checkPartial=false) {
        if (this.location.isAbove(otherCell.location, maxHeight)) {
            if (!checkPartial) {
                return !this.solidBorder.bottom;
            }

            return !this.solidBorder.bottom && !this.partialBorder.bottom;
        }

        if (this.location.isRightOf(otherCell.location, maxWidth)) {
            if (!checkPartial) {
                return !this.solidBorder.left;
            }

            return !this.solidBorder.left && !this.partialBorder.left;
        }

        if (this.location.isLeftOf(otherCell.location, maxWidth)) {
            if (!checkPartial) {
                return !this.solidBorder.right;
            }

            return !this.solidBorder.right && !this.partialBorder.right;
        }

        if (this.location.isBelow(otherCell.location, maxHeight)) {
            if (!checkPartial) {
                return !this.solidBorder.top;
            }

            return !this.solidBorder.top && !this.partialBorder.top;
        }

        return false;
    }

    isTeleportCell(width, height) {
        if (!this.solidBorder.top &&
            !this.partialBorder.top &&
            (this.location.y === 0)) {
            return true;
        }

        if (!this.solidBorder.left &&
            !this.partialBorder.left &&
            (this.location.x === 0)) {
            return true;
        }

        if (!this.solidBorder.bottom &&
            !this.partialBorder.bottom &&
            (this.location.y === (height - 1))) {
            return true;
        }

        if (!this.solidBorder.right &&
            !this.partialBorder.right &&
            (this.location.x === (width - 1))) {
            return true;
        }

        return false;
    }

    /**
     * This will return a 9-bit binary string representing the following:
     * 2^8 = Cell has power up (to be filled in upstream - will always be 0 here)
     * 2^7 = Cell has player (to be filled in upstream - will always be 0 here)
     * 2^6 = Cell has Ghost (to be filled in upstream - will always be 0 here)
     * 2^5 = Cell has big dot
     * 2^4 = Cell has little dot
     * 2^3 = Cell has solid left border
     * 2^2 = Cell has solid top border
     * 2^1 = Cell has solid right border
     * 2^0 = Cell has solid bottom border
     */
    toBinary() {
        let toRet = "000";

        if (this.dotType === Dot.BIG) {
            toRet += "1";
        } else {
            toRet += "0";
        }

        if (this.dotType === Dot.LITTLE) {
            toRet += "1";
        } else {
            toRet += "0";
        }

        if (this.solidBorder.left) {
            toRet += "1";
        } else {
            toRet += "0";
        }

        if (this.solidBorder.top) {
            toRet += "1";
        } else {
            toRet += "0";
        }

        if (this.solidBorder.right) {
            toRet += "1";
        } else {
            toRet += "0";
        }

        if (this.solidBorder.bottom) {
            toRet += "1";
        } else {
            toRet += "0";
        }

        return toRet;
    }
}

export default Cell;