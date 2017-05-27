import Cell from "./Cell";
import _ from "../../node_modules/lodash/lodash";
import BorderType from "./BorderType";
import DataSourceBase from "./DataSourceBase";
import {default as LocationModel} from "./Location";
import KeyEventer from "../utils/KeyEventer";

const default_width = 26;
const default_height = 26;

class Level extends DataSourceBase {

    static get DEFAULT_WIDTH() { return default_width; }
    static get DEFAULT_HEIGHT() { return default_height; }

    constructor(width=default_width, height=default_height) {
        super();

        this._width = width;
        this._height = height;

        this._playerSpawnLocation = this._wireUp("_playerSpawnLocation", new LocationModel(-1, -1));
        this._ghostRedLocation = this._wireUp("_ghostRedLocation", new LocationModel(-1, -1));
        this._ghostBlueLocation = this._wireUp("_ghostBlueLocation", new LocationModel(-1, -1));
        this._ghostOrangeLocation = this._wireUp("_ghostOrangeLocation", new LocationModel(-1, -1));
        this._ghostPinkLocation = this._wireUp("_ghostPinkLocation", new LocationModel(-1, -1));
        this._selectedLocation = this._wireUp("_selectedLocation", new LocationModel(-1, -1));

        let theGameMatrix = Level.constructGameMatrix(this._width, this._height);
        this._wireUpGameMatrix(theGameMatrix);
        this._gameMatrix = theGameMatrix;
        this._width = width;
        this._height = height;
        this._editMode = false;
        this._keyEventer = new KeyEventer();
        if (typeof(document) !== "undefined") {
            this._keyEventer.bindEvents(document.body, (e) => this.onKeyDown(e), (e) => this.onKeyUp(e));
        }
    }

    static _getGameMatrixPropName(x, y) {
        return "_gameMatrix[" + y + "][" + x + "]";
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

    removeAllCallbacks() {
        super.removeAllCallbacks();

        this._keyEventer.unBindEvents();
    }

    _setLocationChangeValue(thisSpawnLocationPropName, cellPropName, newValue, newCell) {
        if (newValue) { // -1
            if (this[thisSpawnLocationPropName].isValid) {
                // This kicks off another event.
                this.getCellByLocation(this[thisSpawnLocationPropName])[cellPropName] = false;
            }

            this[thisSpawnLocationPropName].setWithLocation(newCell.location);
        } else { // -1
            this[thisSpawnLocationPropName].set(-1, -1);
        }
    }

    _nestedDataSourceChanged(e) {
        super._nestedDataSourceChanged(e);

        switch (e.source) {
            case "_isPlayerSpawn":
                this._setLocationChangeValue("playerSpawnLocation", "isPlayerSpawn", e.newValue, e.object);
                break;
            case "_isGhostRedSpawn":
                this._setLocationChangeValue("ghostRedLocation", "isGhostRedSpawn", e.newValue, e.object);
                break;
            case "_isGhostPinkSpawn":
                this._setLocationChangeValue("ghostPinkLocation", "isGhostPinkSpawn", e.newValue, e.object);
                break;
            case "_isGhostBlueSpawn":
                this._setLocationChangeValue("ghostBlueLocation", "isGhostBlueSpawn", e.newValue, e.object);
                break;
            case "_isGhostOrangeSpawn":
                this._setLocationChangeValue("ghostOrangeLocation", "isGhostOrangeSpawn", e.newValue, e.object);
                break;
            case "_selected":
                this._setLocationChangeValue("_selectedLocation", "selected", e.newValue, e.object);
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
            this._wireUp(Level._getGameMatrixPropName(x, this._height), currentCell);
            this.gameMatrix[this.height][x] = currentCell;
        }

        this._setValueAndRaiseOnChange("_height", this.height + 1);
    }

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

    removeColumn() {

        for (let y = 0; y < this.height; y++) {
            let currentCell = this.gameMatrix[y].pop();
            this._unWire(currentCell);
            currentCell.removeAllCallbacks();
        }

        this.width = this.width - 1;
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
                    newSelectedCell = this.getCell(currentCell.x, currentCell.y + 1);
                    newSelectedCell.selected = true;
                }
                break;
            case "ArrowUp":
                if ((currentCell.y - 1) >= 0) {
                    newSelectedCell = this.getCell(currentCell.x, currentCell.y - 1);
                    newSelectedCell.selected = true;
                }
                break;
            case "ArrowLeft":
                if ((currentCell.x - 1) >= 0) {
                    newSelectedCell = this.getCell(currentCell.x - 1, currentCell.y);
                    newSelectedCell.selected = true;
                }
                break;
            case "ArrowRight":
                if ((currentCell.x + 1) < this.width) {
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