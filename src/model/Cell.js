import Border from "./Border";
import BorderType from "./BorderType";
import Dot from "./Dot";


class Cell {

    constructor(id, spawnChangedCallback=null) {
        this._id = id;
        this._solidBorder = new Border();
        this._partialBorder = new Border();

        this._dotType = Dot.NONE;
        this._selected = false;

        this._isPlayerSpawn = false;
        this._isGhostRedSpawn = false;
        this._isGhostPinkSpawn = false;
        this._isGhostBlueSpawn = false;
        this._isGhostOrangeSpawn = false;
        this._isActive = true;

        let tempArray = this._id.split("_");
        this._x = parseInt(tempArray[1], 10);
        this._y = parseInt(tempArray[0], 10);
        this.spawnChangedCallback = spawnChangedCallback;
    }

    clone(theId, direction="none") {
        let toRet = new Cell(theId, this.spawnChangedCallback);
        toRet._solidBorder = this._solidBorder.clone(direction);
        toRet._partialBorder = this._partialBorder.clone(direction);
        toRet._dotType = this._dotType;
        toRet._selected = this._selected;
        return toRet;
    }

    setAllSpawnValuesFalse() {
        this._isPlayerSpawn = false;
        this._isGhostBlueSpawn = false;
        this._isGhostOrangeSpawn = false;
        this._isGhostPinkSpawn = false;
        this._isGhostRedSpawn = false;
    }

    getSpawnValue() {
        if (this._isPlayerSpawn) {
            return "player";
        }

        if (this._isGhostBlueSpawn) {
            return "ghostBlue";
        }

        if (this._isGhostRedSpawn) {
            return "ghostRed";
        }

        if (this._isGhostOrangeSpawn) {
            return "ghostOrange";
        }

        if (this._isGhostPinkSpawn) {
            return "ghostPink";
        }

        return "none";
    }

    raiseSpawnChangedEvent() {
        if (this.spawnChangedCallback) {
            let currentSpawnValue = this.getSpawnValue();
            this.spawnChangedCallback({
                cell: this,
                spawnValue: currentSpawnValue
            });
        }
    }

    get isPlayerSpawn() {
        return this._isPlayerSpawn;
    }

    set isPlayerSpawn(value) {
        if (value) {
            this.setAllSpawnValuesFalse();
        }

        this._isPlayerSpawn = value;

        this.raiseSpawnChangedEvent();
    }

    get isGhostRedSpawn() {
        return this._isGhostRedSpawn;
    }

    set isGhostRedSpawn(value) {
        if (value) {
            this.setAllSpawnValuesFalse();
        }

        this._isGhostRedSpawn = value;

        this.raiseSpawnChangedEvent();
    }

    get isGhostPinkSpawn() {
        return this._isGhostPinkSpawn;
    }

    set isGhostPinkSpawn(value) {
        if (value) {
            this.setAllSpawnValuesFalse();
        }

        this._isGhostPinkSpawn = value;

        this.raiseSpawnChangedEvent();
    }

    get isGhostBlueSpawn() {
        return this._isGhostBlueSpawn;
    }

    set isGhostBlueSpawn(value) {
        if (value) {
            this.setAllSpawnValuesFalse();
        }

        this._isGhostBlueSpawn = value;

        this.raiseSpawnChangedEvent();
    }

    get isGhostOrangeSpawn() {
        return this._isGhostOrangeSpawn;
    }

    set isGhostOrangeSpawn(value) {
        if (value) {
            this.setAllSpawnValuesFalse();
        }

        this._isGhostOrangeSpawn = value;

        this.raiseSpawnChangedEvent();
    }

    get isActive() {
        return this._isActive;
    }

    set isActive(value) {
        this._isActive = value;
    }

    get x() { return this._x; }

    get y() { return this._y; }

    get selected() { return this._selected; }

    set selected(value) { this._selected = value; }

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
        if (this._dotType === Dot.NONE) {
            this._dotType = Dot.LITTLE;
        } else if (this._dotType === Dot.LITTLE) {
            this._dotType = Dot.BIG;
        } else if (this._dotType === Dot.BIG) {
            this._dotType = Dot.NONE;
        }
    }
}

export default Cell;