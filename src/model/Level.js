import Cell from "./Cell";
import _ from "../../node_modules/lodash/lodash";
import BorderType from "./BorderType";
import DataSourceBase from "./DataSourceBase";
import {default as LocationModel} from "./Location";
import Player from "./actors/Player";
import Ghost from "./actors/Ghost";
import Direction from "../utils/Direction";

const DEFAULT_WIDTH = 26;
const DEFAULT_HEIGHT = 26;

class Level extends DataSourceBase {

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
        this._selectedLocation = new LocationModel(-1, -1);

        this._gameMatrix = Level.constructGameMatrix(this._width, this._height, this._cellChangedCallbackRef);
        this._selectedCell = this._gameMatrix[0][0];
        this._width = width;
        this._height = height;
        this._editMode = false;

        // TODO: Re-examine this relationship between Level and Actor - they reference each other now
        this._player = new Player(Direction.LEFT,
            new LocationModel(-1, -1),
            this,
            Player.MR_PAC_MAN);
        this._ghostRed = new Ghost(Direction.LEFT, new LocationModel(-1, -1), this, Ghost.RED);
        this._ghostBlue = new Ghost(Direction.LEFT, new LocationModel(-1, -1), this, Ghost.BLUE);
        this._ghostPink = new Ghost(Direction.LEFT, new LocationModel(-1, -1), this, Ghost.PINK);
        this._ghostOrange = new Ghost(Direction.LEFT, new LocationModel(-1, -1), this, Ghost.ORANGE);

        // TODO: Fix this.  This has a serious code smell
        this._spawnPropertyMapping = {
            "spawnToEntity": {
                "_playerSpawnLocation": "player",
                "_ghostRedLocation": "ghostRed",
                "_ghostBlueLocation": "ghostBlue",
                "_ghostPinkLocation": "ghostPink",
                "_ghostOrangeLocation": "ghostOrange"
            },
            "entityToSpawn": {
                "_player": "_playerSpawnLocation",
                "_ghostRed": "_ghostRedLocation",
                "_ghostBlue": "_ghostBlueLocation",
                "_ghostPink": "_ghostPinkLocation",
                "_ghostOrange": "_ghostOrangeLocation"
            }
        };

        this._spawnPropertyToCellPropertyMapping = {
            "levelToCell": {
                "_playerSpawnLocation": "_isPlayerSpawn",
                "_ghostRedLocation": "_isGhostRedSpawn",
                "_ghostBlueLocation": "_isGhostBlueSpawn",
                "_ghostPinkLocation": "_isGhostPinkSpawn",
                "_ghostOrangeLocation": "_isGhostOrangeSpawn"
            },
            "cellToLevel": {
                "_isPlayerSpawn": "_playerSpawnLocation",
                "_isGhostRedSpawn": "_ghostRedLocation",
                "_isGhostBlueSpawn": "_ghostBlueLocation",
                "_isGhostPinkSpawn": "_ghostPinkLocation",
                "_isGhostOrangeSpawn": "_ghostOrangeLocation"
            }
        };
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

        let conditionalAssignLocation = function (jsonObject, propName) {
            if (typeof(jsonObject[propName]) !== 'undefined') {
                toRet[propName] = new LocationModel(jsonObject[propName]._x, jsonObject[propName]._y);
            }
        };

        conditionalAssignLocation(jsonObject, "_playerSpawnLocation");
        conditionalAssignLocation(jsonObject, "_ghostRedLocation");
        conditionalAssignLocation(jsonObject, "_ghostBlueLocation");
        conditionalAssignLocation(jsonObject, "_ghostOrangeLocation");
        conditionalAssignLocation(jsonObject, "_ghostPinkLocation");
        conditionalAssignLocation(jsonObject, "_selectedLocation");

        let conditionalAssignEntityLocation = function (jsonObject, jsonObjectProperty, toRetProperty) {
            if (typeof(jsonObject[jsonObjectProperty]) !== "undefined") {
                let x = jsonObject[jsonObjectProperty]._x;
                let y = jsonObject[jsonObjectProperty]._y;
                toRet[toRetProperty].location.set(x, y);
            }
        };

        conditionalAssignEntityLocation(jsonObject, "_playerSpawnLocation", "_player");
        conditionalAssignEntityLocation(jsonObject, "_ghostRedLocation", "_ghostRed");
        conditionalAssignEntityLocation(jsonObject, "_ghostBlueLocation", "_ghostBlue");
        conditionalAssignEntityLocation(jsonObject, "_ghostPinkLocation", "_ghostPink");
        conditionalAssignEntityLocation(jsonObject, "_ghostOrangeLocation", "_ghostOrange");

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

    _removeSpawnLocation(newLocation) {
        for (let spawnProp in this._spawnPropertyMapping.spawnToEntity) {
            if (this.hasOwnProperty(spawnProp) &&
                !newLocation.isEqualTo(-1, -1) &&
                this[spawnProp].equals(newLocation)) {

                let oldLocation = this[spawnProp];
                let cellProp = this._spawnPropertyToCellPropertyMapping.levelToCell[spawnProp];
                this.gameMatrix[oldLocation.y][oldLocation.x][cellProp] = false;
                this[spawnProp].set(-1, -1);
                this[this._spawnPropertyMapping.spawnToEntity[spawnProp]].location.set(-1, -1);
            }
        }
    }

    _setSpawnValue(cellSpawnField, newLocation, checked) {
        let levelFieldName = this._spawnPropertyToCellPropertyMapping.cellToLevel[cellSpawnField];

        if (!checked) {
            this._removeSpawnLocation(this[levelFieldName]);
        } else {
            this._removeSpawnLocation(this[levelFieldName]);
            this._removeSpawnLocation(newLocation);

            this[levelFieldName].setWithLocation(newLocation);
            this[this._spawnPropertyMapping.spawnToEntity[levelFieldName]].location.setWithLocation(newLocation);
            this.gameMatrix[newLocation.y][newLocation.x][cellSpawnField] = true;
        }
    }

    cellChangedCallback(e) {

        switch (e.source) {
            case "_isPlayerSpawn":
            case "_isGhostRedSpawn":
            case "_isGhostPinkSpawn":
            case "_isGhostBlueSpawn":
            case "_isGhostOrangeSpawn":
                this._setSpawnValue(e.source, e.object.location, e.object[e.source]);
                break;
            case "_selected":
                if (e.object.selected) {
                    if (this._selectedLocation.isValid) {
                        this.gameMatrix[this._selectedLocation.y][this._selectedLocation.x].selected = false;
                    }
                    this._selectedLocation.setWithLocation(e.object.location);
                    this.selectedCell = e.object;
                } else if (this._selectedLocation.equals(e.object.location) && !e.object.selected) {
                    this._selectedLocation.reset();
                } else {
                    throw new Error("Im not sure how you would get here");
                }
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

        this._setValueAndRaiseOnChange("_width", this.width - 1);
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

    get selectedLocation() {
        return this._selectedLocation;
    }

    setSelectedLocation(theLocation) {
        if (this._selectedLocation.isValid) {
            this.gameMatrix[this._selectedLocation.y][this._selectedLocation.x].selected = false;
        }

        this._selectedLocation.setWithLocation(theLocation);
        this._selectedCell = this.gameMatrix[this._selectedLocation.y][this._selectedLocation.x];
        this._selectedCell._selected = true;
        this._raiseOnChangeCallbacks("_selectedLocation");
    }

    get editMode() {
        return this._editMode;
    }

    set editMode(value) {
        this.gameMatrix.forEach(function (row) {
            row.forEach(function (cell) {
                cell.selected = false;
                cell.editMode = value;
            });
        });

        this.player.editMode = value;

        this._setValueAndRaiseOnChange("_editMode", value);
        this.selectedCell = null;
    }

    get player() {
        return this._player;
    }

    get ghostRed() {
        return this._ghostRed;
    }

    get ghostBlue() {
        return this._ghostBlue;
    }

    get ghostPink() {
        return this._ghostPink;
    }

    get ghostOrange() {
        return this._ghostOrange;
    }

    getCellByLocation(location) {
        return this.gameMatrix[location.y][location.x];
    }
}

export default Level;