import Cell from "./Cell";
import _ from "../../node_modules/lodash/lodash";
import BorderType from "./BorderType";
import DataSourceBase from "./DataSourceBase";
import {default as LocationModel} from "./Location";

const DEFAULT_WIDTH = 26;
const DEFAULT_HEIGHT = 26;
const spawn_indices_player = "player";
const spawn_indices_ghostRed = "ghostRed";
const spawn_indices_ghostBlue = "ghostBlue";
const spawn_indices_ghostOrange = "ghostOrange";
const spawn_indices_ghostPink = "ghostPink";
const valid_spawn_indices_name = [
    spawn_indices_player,
    spawn_indices_ghostRed,
    spawn_indices_ghostBlue,
    spawn_indices_ghostOrange,
    spawn_indices_ghostPink
];

class Level extends DataSourceBase {
    static get SPAWN_INDICES_PLAYER() { return spawn_indices_player; }
    static get SPAWN_INDICES_GHOST_RED() { return spawn_indices_ghostRed; }
    static get SPAWN_INDICES_GHOST_BLUE() { return spawn_indices_ghostBlue; }
    static get SPAWN_INDICES_GHOST_ORANGE() { return spawn_indices_ghostOrange; }
    static get SPAWN_INDICES_GHOST_PINK() { return spawn_indices_ghostPink; }

    constructor(width=DEFAULT_WIDTH, height=DEFAULT_HEIGHT) {
        super();

        this._width = width;
        this._height = height;
        this._cellChangedCallbackRef = (e) => this.cellChangedCallback(e);

        this._playerSpawnLocation = new LocationModel(-1, -1);
        this._ghostRedLocation = new LocationModel(-1, -1);
        this._ghostBlueLocation = new LocationModel(-1, -1);
        this._ghostOrangeLocation = new LocationModel(-1, -1);
        this._ghostPinkLocation = new LocationModel(-1, -1);

        this._gameMatrix = Level.constructGameMatrix(this._width, this._height, this._cellChangedCallbackRef);
        this._selectedCell = this._gameMatrix[0][0];
        this._width = width;
        this._height = height;
    }

    static constructGameMatrix(width, height, cellChangedCallbackRef) {
        let toRet = [];

        for (let y = 0; y < height; y++) {
            toRet[y] = [];

            for (let x = 0; x < width; x++) {
                let currentId = y + "_" + x;
                let currentCell = new Cell(currentId);
                currentCell.addOnChangeCallback(cellChangedCallbackRef);
                toRet[y][x] = currentCell;
            }
        }

        return toRet;
    }

    removeAllCallbacks() {
        super.removeAllCallbacks();

        this.gameMatrix.forEach(function(row) {
            row.forEach(function(cell) {
                cell.removeAllCallbacks();
            })
        })
    }

    static fromJSON(jsonObject) {
        // let jsonObject = JSON.parse(json);
        let width = jsonObject._width;
        let height = jsonObject._height;
        let toRet = new Level(width, height);
        let currentCell = null;
        let currentDataCell = null;
        let conditionalAssignCell = function(property) {
            if (typeof(currentDataCell[property]) !== 'undefined') {
                currentCell[property] = currentDataCell[property];
            }
        };

        for (let y = 0; y < height; y++) {

            for (let x = 0; x < width; x++) {
                currentCell = toRet.gameMatrix[y][x];
                currentDataCell = jsonObject._gameMatrix[y][x];

                currentCell.setSolidBorder(BorderType.LEFT, currentDataCell._solidBorder._left);
                currentCell.setSolidBorder(BorderType.TOP, currentDataCell._solidBorder._top);
                currentCell.setSolidBorder(BorderType.RIGHT, currentDataCell._solidBorder._right);
                currentCell.setSolidBorder(BorderType.BOTTOM, currentDataCell._solidBorder._bottom);

                currentCell.setPartialBorder(BorderType.LEFT, currentDataCell._partialBorder._left);
                currentCell.setPartialBorder(BorderType.TOP, currentDataCell._partialBorder._top);
                currentCell.setPartialBorder(BorderType.RIGHT, currentDataCell._partialBorder._right);
                currentCell.setPartialBorder(BorderType.BOTTOM, currentDataCell._partialBorder._bottom);

                conditionalAssignCell("_isPlayerSpawn");
                conditionalAssignCell("_isGhostRedSpawn");
                conditionalAssignCell("_isGhostPinkSpawn");
                conditionalAssignCell("_isGhostBlueSpawn");
                conditionalAssignCell("_isGhostOrangeSpawn");
                conditionalAssignCell("_isActive");

                currentCell.dotType = currentDataCell._dotType;
            }
        }

        if (typeof(jsonObject._spawnIndices) !== 'undefined') {
            toRet._spawnIndices = jsonObject._spawnIndices;
        }

        return toRet;
    }

    _toggleLocationIfUsed(theLocation) {
        let self = this;
        let resetIfEqual = function (theLocationName, propName) {
            if (self[theLocationName].equals(theLocation)) {
                self.gameMatrix[theLocation.y][theLocation.x][propName] = false;
                self[theLocationName].reset();
            }
        };

        resetIfEqual("_playerSpawnLocation", "_isPlayerSpawn");
        resetIfEqual("_ghostBlueLocation", "_isGhostBlueSpawn");
        resetIfEqual("_ghostRedLocation", "_isGhostRedSpawn");
        resetIfEqual("_ghostPinkLocation", "_isGhostPinkSpawn");
        resetIfEqual("_ghostOrangeLocation", "_isGhostOrangeSpawn");
    }

    cellChangedCallback(e) {

        let self = this;
        let toggleSpawn = function (theObject,
                                    thePrivateProperty,
                                    existingSpawnLocation) {
            let newSpawnLocation = theObject.location;
            self._toggleLocationIfUsed(newSpawnLocation);
            if (theObject[thePrivateProperty]) {
                if (existingSpawnLocation.isValid) {
                    self.gameMatrix[existingSpawnLocation.y][existingSpawnLocation.x][thePrivateProperty] = false;
                }
                existingSpawnLocation.setWithLocation(newSpawnLocation);
            }
        };

        switch (e.source) {
            case "_isPlayerSpawn":
                toggleSpawn(e.object, "_isPlayerSpawn", this.playerSpawnLocation);
                this._raiseOnChangeCallbacks("playerSpawnLocation");
                break;
            case "_isGhostRedSpawn":
                toggleSpawn(e.object, "_isGhostRedSpawn", this.ghostRedLocation);
                this._raiseOnChangeCallbacks("ghostRedLocation");
                break;
            case "_isGhostPinkSpawn":
                toggleSpawn(e.object, "_isGhostPinkSpawn", this.ghostPinkLocation);
                this._raiseOnChangeCallbacks("ghostPinkLocation");
                break;
            case "_isGhostBlueSpawn":
                toggleSpawn(e.object, "_isGhostBlueSpawn", this.ghostBlueLocation);
                this._raiseOnChangeCallbacks("ghostBlueLocation");
                break;
            case "_isGhostOrangeSpawn":
                toggleSpawn(e.object, "_isGhostOrangeSpawn", this.ghostOrangeLocation);
                this._raiseOnChangeCallbacks("ghostOrangeLocation");
                break;
            default:
                // nothing to do
                break;
        }
    }

    mirrorHorizontally() {

        let currentNewXIndex = 0;
        let currentCell = null;
        let currentClonedCell = null;

        for (let y = 0; y < this.height; y++) {

            currentNewXIndex = this.width;

            for (let x = (this.width - 1); x >= 0; x--) {

                currentCell = this.gameMatrix[y][x];
                currentClonedCell = currentCell.clone(y + "_" + currentNewXIndex, "horizontal");
                currentClonedCell.addOnChangeCallback(this._cellChangedCallbackRef);
                this.gameMatrix[y][currentNewXIndex++] = currentClonedCell;
            }
        }

        this.width = currentNewXIndex;
    }

    mirrorVertically() {

        let currentNewYIndex = this._height;
        let currentCell = null;
        let currentClonedCell = null;

        for (let y = (this._height - 1); y >= 0; y--) {

            this.gameMatrix[currentNewYIndex] = [];

            for (let x = 0; x < this._width; x++) {

                currentCell = this.gameMatrix[y][x];
                currentClonedCell = currentCell.clone(currentNewYIndex + "_" + x, "vertical");
                currentClonedCell.addOnChangeCallback(this._cellChangedCallbackRef);
                this.gameMatrix[currentNewYIndex][x] = currentClonedCell;
            }

            currentNewYIndex++;
        }

        this.height = currentNewYIndex;
    }

    get gameMatrix() { return this._gameMatrix; }

    getCellById(cellId) {
        let theArray = cellId.split("_");
        let y = theArray[0];
        let x = theArray[1];

        return this.getCell(x, y);
    }

    getCell(x, y) {
        return this._gameMatrix[y][x];
    }

    get width() { return this._width; }

    set width(value) {
        this._setValueAndRaiseOnChange("_width", value);
    }

    get height() { return this._height; }

    set height(value) {
        this._setValueAndRaiseOnChange("_height", value);
    }

    addRow() {
        this.gameMatrix[this._height] = [];

        for (let x = 0; x < this.width; x++) {
            let currentId = this.height + "_" + x;
            let currentCell = new Cell(currentId);
            currentCell.addOnChangeCallback(this._cellChangedCallbackRef);
            this.gameMatrix[this.height][x] = currentCell;
        }

        this._setValueAndRaiseOnChange("_height", this.height + 1);
    }

    removeRow() {
        let currentRow = this._gameMatrix.pop();
        currentRow.forEach(function (cell) {
           cell.removeAllCallbacks();
        });
        this._setValueAndRaiseOnChange("_height", this.height - 1);
    }

    addColumn() {
        for (let y = 0; y < this.height; y++) {
            let currentId = y + "_" + this.width;
            let currentCell = new Cell(currentId);
            currentCell.addOnChangeCallback(this._cellChangedCallbackRef);
            this.gameMatrix[y][this.width] = currentCell;
        }

        this._setValueAndRaiseOnChange("_width", this.width + 1);
    }

    removeColumn() {

        for (let y = 0; y < this.height; y++) {
            let currentCell = this.gameMatrix[y].pop();
            currentCell.removeAllCallbacks();
        }

        this._setValueAndRaiseOnChange("width", this.width - 1);
    }

    get selectedCell() {
        return this._selectedCell;
    }

    set selectedCell(value) {
        this._setValueAndRaiseOnChange("_selectedCell", value);
    }

    setSelectedCellByIndex(x, y) {
        this.selectedCell = this.gameMatrix[y][x];
    }

    get playerSpawnLocation() {
        return this._playerSpawnLocation;
    }

    get ghostRedLocation() {
        return this._ghostRedLocation;
    }

    get ghostBlueLocation() {
        return this._ghostBlueLocation;
    }

    get ghostOrangeLocation() {
        return this._ghostOrangeLocation;
    }

    get ghostPinkLocation() {
        return this._ghostPinkLocation;
    }
}

export default Level;