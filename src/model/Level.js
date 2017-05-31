import Cell from "./Cell";
import _ from "../../node_modules/lodash/lodash";
import BorderType from "./BorderType";
import DataSourceBase from "./DataSourceBase";
import {default as LocationModel} from "./Location";
import KeyEventer from "../utils/KeyEventer";
import FloydWarshall from "./util/FloydWarshall";

const default_width = 26;
const default_height = 26;

class Level extends DataSourceBase {

    static get DEFAULT_WIDTH() { return default_width; }
    static get DEFAULT_HEIGHT() { return default_height; }

    static _getGameMatrixPropName(x, y) {
        return "_gameMatrix[" + y + "][" + x + "]";
    }

    static constructGameMatrix(width, height) {
        let toRet = [];

        for (let y = 0; y < height; y++) {
            toRet[y] = [];

            for (let x = 0; x < width; x++) {
                let currentId = y + "_" + x;
                toRet[y][x] = new Cell(currentId);
            }
        }

        return toRet;
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

        if ((typeof(jsonObject._floydWarshall) !== "undefined") &&
            (typeof(jsonObject._floydWarshall._directions) !== "undefined")) {
            toRet._floydWarshall = new FloydWarshall();
            toRet._floydWarshall._directions = jsonObject._floydWarshall._directions;
            toRet._floydWarshall._pathDistance = jsonObject._floydWarshall._pathDistance;
            toRet._borderIsDirty = false;
        }

        // let conditionalAssignEntityLocation = function (jsonObject, jsonObjectProperty, toRetProperty) {
        //     if (typeof(jsonObject[jsonObjectProperty]) !== "undefined") {
        //         let x = jsonObject[jsonObjectProperty]._x;
        //         let y = jsonObject[jsonObjectProperty]._y;
        //         toRet[toRetProperty].location.set(x, y);
        //     }
        // };
        //
        // conditionalAssignEntityLocation(jsonObject, "_playerSpawnLocation", "_player");
        // conditionalAssignEntityLocation(jsonObject, "_ghostRedLocation", "_ghostRed");
        // conditionalAssignEntityLocation(jsonObject, "_ghostBlueLocation", "_ghostBlue");
        // conditionalAssignEntityLocation(jsonObject, "_ghostPinkLocation", "_ghostPink");
        // conditionalAssignEntityLocation(jsonObject, "_ghostOrangeLocation", "_ghostOrange");

        return toRet;
    }

    constructor(width=default_width, height=default_height) {
        super();

        this._width = width;
        this._height = height;
        let theGameMatrix = Level.constructGameMatrix(this._width, this._height);
        this._wireUpGameMatrix(theGameMatrix);
        this._gameMatrix = theGameMatrix;
        this._floydWarshall = null;
        this._borderIsDirty = true;

        this._playerSpawnLocation = this._wireUp("_playerSpawnLocation", new LocationModel(-1, -1));
        this._ghostRedLocation = this._wireUp("_ghostRedLocation", new LocationModel(-1, -1));
        this._ghostBlueLocation = this._wireUp("_ghostBlueLocation", new LocationModel(-1, -1));
        this._ghostOrangeLocation = this._wireUp("_ghostOrangeLocation", new LocationModel(-1, -1));
        this._ghostPinkLocation = this._wireUp("_ghostPinkLocation", new LocationModel(-1, -1));
        this._selectedLocation = this._wireUp("_selectedLocation", new LocationModel(-1, -1));

        // -------------------------------------------------------------------
        // everything above this line is restored via the fromJSON method
        // -------------------------------------------------------------------

        this._editMode = false;
        this._onKeyDownRef = (e) => this.onKeyDown(e);
        this._onKeyUpRef = (e) => this.onKeyUp(e);
        this._activeCells = null;
        this._activeCellsIsDirty = true;
        this.toIgnore.push("_dotType");
        // this.debug = true;
    }

    toJSON() {
        let toRet = {
            _width: this._width,
            _height: this._height,
            _gameMatrix: [],
            _floydWarshall: null,
            _borderIsDirty: this._borderIsDirty,
            _playerSpawnLocation: this._playerSpawnLocation.toJSON(),
            _ghostRedLocation: this._ghostRedLocation.toJSON(),
            _ghostBlueLocation: this._ghostBlueLocation.toJSON(),
            _ghostOrangeLocation: this._ghostOrangeLocation.toJSON(),
            _ghostPinkLocation: this._ghostPinkLocation.toJSON(),
            _selectedLocation: this._selectedLocation.toJSON()
        };

        if (this._floydWarshall !== null) {
            toRet._floydWarshall = this._floydWarshall.toJSON();
        }

        for (let rowIndex = 0; rowIndex < this.height; rowIndex++) {
            toRet._gameMatrix[rowIndex] = [];

            for (let colIndex = 0; colIndex < this.width; colIndex++) {
                toRet._gameMatrix[rowIndex][colIndex] = this._gameMatrix[rowIndex][colIndex].toJSON();
            }
        }

        return toRet;
    }

    get gameMatrix() { return this._gameMatrix; }

    get width() { return this._width; }

    set width(value) {
        this._setValueAndRaiseOnChange("_width", value);
    }

    get height() { return this._height; }

    set height(value) {
        this._setValueAndRaiseOnChange("_height", value);
    }

    get selectedCell() {
        if (this._selectedLocation.isValid) {
            return this.getCellByLocation(this._selectedLocation);
        }

        return null;
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

        if (value && (this._editMode !== value)) {
            KeyEventer.instance.addCallback(this._onKeyDownRef, KeyEventer.CALLBACK_KEYDOWN);
            KeyEventer.instance.addCallback(this._onKeyUpRef, KeyEventer.CALLBACK_KEYUP);
        } else if (!value && (this._editMode !== value)) {
            KeyEventer.instance.removeCallback(this._onKeyDownRef, KeyEventer.CALLBACK_KEYDOWN);
            KeyEventer.instance.removeCallback(this._onKeyUpRef, KeyEventer.CALLBACK_KEYUP);
        }

        this._setValueAndRaiseOnChange("_editMode", value);
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

    get floydWarshall() {
        if (this._borderIsDirty || (this._floydWarshall === null)) {
            this._floydWarshall = new FloydWarshall();
            this._floydWarshall.buildAllPaths(this);
            this._floydWarshall.convertPathsToDirections(this);
            this._borderIsDirty = false;
        }

        return this._floydWarshall;
    }

    get activeCells() {
        if (this._activeCellsIsDirty || (this._activeCells === null)) {
            this._activeCells = this._getActiveCells();
            this._activeCellsIsDirty = false;
        }

        return this._activeCells;
    }

    getRandomActiveCellLocation() {
        let numActiveCells = this.activeCells.length;
        let randomIndex = Math.floor(Math.random() * numActiveCells);
        return this.activeCells[randomIndex].location.clone();
        // return toRet;
    }

    _getActiveCells() {
        let toRet = [];

        this.iterateOverCells(function (cell) {
            if (cell.isActive) {
                toRet.push(cell);
            }
        });

        return toRet;
    }

    _wireUpGameMatrix(theGameMatrix) {
        let self = this;

        theGameMatrix.forEach(function (row) {
            row.forEach(function (cell) {
                let x = cell.x;
                let y = cell.y;
                let propertyName = Level._getGameMatrixPropName(x, y);

                self._wireUp(propertyName, cell);
            })
        });
    }

    _setLocationChangeValue(thisSpawnLocationPropName, cellPropName, newValue, newCell, oldValue, raiseEvent) {
        let thisSpawnLocationPropNameWithUnderscore = thisSpawnLocationPropName;
        if (!_.startsWith(thisSpawnLocationPropName, "_")) {
            thisSpawnLocationPropNameWithUnderscore = "_" + thisSpawnLocationPropName;
        }

        if (newValue) { // -1
            if (this[thisSpawnLocationPropName].isValid) {
                // This kicks off another event.
                this.getCellByLocation(this[thisSpawnLocationPropName])[cellPropName] = false;
            }

            this[thisSpawnLocationPropName].setWithLocation(newCell.location);
            if (raiseEvent) {
                this._raiseOnChangeCallbacks(thisSpawnLocationPropNameWithUnderscore, oldValue, newValue);
            }

        } else { // -1
            this[thisSpawnLocationPropName].set(-1, -1);

            if (raiseEvent) {
                this._raiseOnChangeCallbacks(thisSpawnLocationPropNameWithUnderscore, oldValue, newValue);
            }
        }
    }

    _nestedDataSourceChanged(e) {

        switch (e.source) {
            case "_isPlayerSpawn":
                this._setLocationChangeValue("playerSpawnLocation", "isPlayerSpawn", e.newValue, e.object, e.oldValue, true);
                break;
            case "_isGhostRedSpawn":
                this._setLocationChangeValue("ghostRedLocation", "isGhostRedSpawn", e.newValue, e.object, e.oldValue, true);
                break;
            case "_isGhostPinkSpawn":
                this._setLocationChangeValue("ghostPinkLocation", "isGhostPinkSpawn", e.newValue, e.object, e.oldValue, true);
                break;
            case "_isGhostBlueSpawn":
                this._setLocationChangeValue("ghostBlueLocation", "isGhostBlueSpawn", e.newValue, e.object, e.oldValue, true);
                break;
            case "_isGhostOrangeSpawn":
                this._setLocationChangeValue("ghostOrangeLocation", "isGhostOrangeSpawn", e.newValue, e.object, e.oldValue, true);
                break;
            case "_selected":
                this._setLocationChangeValue("_selectedLocation", "selected", e.newValue, e.object, e.oldValue, false);
                break;
            default:
                if (_.startsWith(e.source, "_solidBorder")) {
                    // If there border changes, we need to re-run the path finding algorithm.
                    this._borderIsDirty = true;
                }
                break;
        }

        super._nestedDataSourceChanged(e);
    }

    removeAllCallbacks() {
        super.removeAllCallbacks();

        KeyEventer.instance.removeCallback(this._onKeyDownRef, KeyEventer.CALLBACK_KEYDOWN);
        KeyEventer.instance.removeCallback(this._onKeyUpRef, KeyEventer.CALLBACK_KEYUP);
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

                this._wireUp(Level._getGameMatrixPropName(currentNewXIndex, y), currentClonedCell);
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
                this._wireUp(Level._getGameMatrixPropName(x, currentNewYIndex), currentClonedCell);
                this.gameMatrix[currentNewYIndex][x] = currentClonedCell;
            }

            currentNewYIndex++;
        }

        this.height = currentNewYIndex;
    }

    getCellById(cellId) {
        let theArray = cellId.split("_");
        let y = theArray[0];
        let x = theArray[1];

        return this.getCell(x, y);
    }

    getCell(x, y) {
        return this._gameMatrix[y][x];
    }

    addRow() {
        this.gameMatrix[this._height] = [];

        for (let x = 0; x < this.width; x++) {
            let currentId = this.height + "_" + x;
            let currentCell = new Cell(currentId);
            this._wireUp(Level._getGameMatrixPropName(x, this._height), currentCell);
            this.gameMatrix[this.height][x] = currentCell;
        }

        this._setValueAndRaiseOnChange("_height", this.height + 1);
    }

    /**
     * TODO: If you remove a row that contains a spawn location, reset the spawn location
     */
    removeRow() {
        let self = this;
        let currentRow = this._gameMatrix.pop();
        currentRow.forEach(function (cell) {
            self._unWire(cell);
            cell.removeAllCallbacks();
        });

        this.height = this.height - 1;
    }

    addColumn() {
        for (let y = 0; y < this.height; y++) {
            let currentId = y + "_" + this.width;
            let currentCell = new Cell(currentId);
            this._wireUp(Level._getGameMatrixPropName(this.width, y), currentCell);

            this.gameMatrix[y][this.width] = currentCell;
        }

        this.width = this.width + 1;
    }

    /**
     * TODO: If you remove a column that contains a spawn location, reset the spawn location
     */
    removeColumn() {

        for (let y = 0; y < this.height; y++) {
            let currentCell = this.gameMatrix[y].pop();
            this._unWire(currentCell);
            currentCell.removeAllCallbacks();
        }

        this.width = this.width - 1;
    }

    getCellByLocation(location) {
        return this.gameMatrix[location.y][location.x];
    }

    /**
     * Use this method to iterate over all cells of the game matrix.
     *
     * @param theCallback This is a function that will be called for each cell.  It is passed (cell, level).
     */
    iterateOverCells(theCallback) {
        let theLevel = this;
        this._gameMatrix.forEach(function (row) {
            row.forEach(function (cell) {
                theCallback(cell, theLevel);
            });
        });
    }

    /** KEY EVENTER EVENTS - START **/
    onKeyDown(key) {
        if (!this.editMode) {
            return;
        }

        let currentCell = this.selectedCell;
        let newSelectedCell = null;

        switch (key) {
            case "ArrowDown":
                if ((currentCell.y + 1) < this.height) {
                    // currentCell.selected = false;
                    newSelectedCell = this.getCell(currentCell.x, currentCell.y + 1);
                    newSelectedCell.selected = true;
                }
                break;
            case "ArrowUp":
                if ((currentCell.y - 1) >= 0) {
                    // currentCell.selected = false;
                    newSelectedCell = this.getCell(currentCell.x, currentCell.y - 1);
                    newSelectedCell.selected = true;
                }
                break;
            case "ArrowLeft":
                if ((currentCell.x - 1) >= 0) {
                    // currentCell.selected = false;
                    newSelectedCell = this.getCell(currentCell.x - 1, currentCell.y);
                    newSelectedCell.selected = true;
                }
                break;
            case "ArrowRight":
                if ((currentCell.x + 1) < this.width) {
                    // currentCell.selected = false;
                    newSelectedCell = this.getCell(currentCell.x + 1, currentCell.y);
                    newSelectedCell.selected = true;
                }
                break;
            default:
                break;
        }
    }

    onKeyUp(key) {

    }

    /** KEY EVENTER EVENTS - END **/
}

export default Level;