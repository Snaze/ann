import Border from "./Border";
import BorderType from "./BorderType";
import Dot from "./Dot";
import Eventer from "../utils/Eventer";


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
        this._eventer = new Eventer();
    }

    addOnChangeCallback(callback) {
        this._eventer.addCallback(callback);
    }

    removeOnChangeCallback(callback) {
        this._eventer.removeCallback(callback);
    }

    raiseOnChangeCallbacks(source) {
        this._eventer.raiseEvent({
            cell: this,
            source: source
        });
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

        this.raiseOnChangeCallbacks("setAllSpawnValuesFalse");
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
        this.raiseOnChangeCallbacks("isPlayerSpawn");
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
        this.raiseOnChangeCallbacks("isGhostRedSpawn");
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
        this.raiseOnChangeCallbacks("isGhostPinkSpawn");
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
        this.raiseOnChangeCallbacks("isGhostBlueSpawn");
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
        this.raiseOnChangeCallbacks("isGhostOrangeSpawn");
    }

    get isActive() {
        return this._isActive;
    }

    set isActive(value) {
        this._isActive = value;
        this.raiseOnChangeCallbacks("isActive");
    }

    get x() { return this._x; }

    get y() { return this._y; }

    get selected() { return this._selected; }

    set selected(value) {
        this._selected = value;

        this.raiseOnChangeCallbacks("selected");
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
                this._x === otherCell._x &&
                this._y === otherCell._y;
    }

    setSolidBorder(borderType, value) {

        if (!BorderType.isValid(borderType)) {
            throw new Error("Invalid Border Type");
        }

        this._solidBorder[borderType] = !!value;
        this.raiseOnChangeCallbacks("setSolidBorder");
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
        this.raiseOnChangeCallbacks("setPartialBorder");
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
        this.raiseOnChangeCallbacks("dotType");
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

        this.raiseOnChangeCallbacks("toggleBorder");
    }

    toggleIsActive() {
        this._isActive = !this._isActive;
        this.raiseOnChangeCallbacks("toggleIsActive");
    }

    toggleDot() {
        if (this._dotType === Dot.NONE) {
            this._dotType = Dot.LITTLE;
        } else if (this._dotType === Dot.LITTLE) {
            this._dotType = Dot.BIG;
        } else if (this._dotType === Dot.BIG) {
            this._dotType = Dot.NONE;
        }

        this.raiseOnChangeCallbacks("toggleDot");
    }
}

export default Cell;