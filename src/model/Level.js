import Cell from "./Cell";
import _ from "../../node_modules/lodash/lodash";
import BorderType from "./BorderType";
import DataSourceBase from "./DataSourceBase";
import {default as LocationModel} from "./Location";
import KeyEventer from "../utils/KeyEventer";
import FloydWarshall from "../utils/FloydWarshall";
import Dot from "./Dot";
import EasingFunctions from "../utils/EasingFunctions";
import Graph from "./ai/Graph";
import Direction from "../utils/Direction";

const default_width = 26;
const default_height = 26;
const powerUps = [
    "Cherry",
    "Strawberry",
    "Orange",
    "Pretzel",
    "Apple",
    "Pear",
    "Banana"
];
const total_levels = 16;

// TODO: Refactor this class.  It has become unwieldy
class Level extends DataSourceBase {

    static get DEFAULT_WIDTH() { return default_width; }
    static get DEFAULT_HEIGHT() { return default_height; }
    static get TOTAL_LEVELS() { return total_levels; }

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
                if (typeof(currentDataCell._solidBorder._color) !== "undefined" &&
                    currentDataCell._solidBorder._color !== null) {
                    currentCell.solidBorder.color = currentDataCell._solidBorder._color;
                }

                currentCell.setPartialBorder(BorderType.LEFT, currentDataCell._partialBorder._left);
                currentCell.setPartialBorder(BorderType.TOP, currentDataCell._partialBorder._top);
                currentCell.setPartialBorder(BorderType.RIGHT, currentDataCell._partialBorder._right);
                currentCell.setPartialBorder(BorderType.BOTTOM, currentDataCell._partialBorder._bottom);
                if (typeof(currentDataCell._partialBorder._color) !== "undefined" &&
                    currentDataCell._partialBorder._color !== null) {
                    currentCell.partialBorder.color = currentDataCell._partialBorder._color;
                }

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

        if (!!jsonObject._floydWarshall && !!jsonObject._floydWarshall._directions) {
            toRet._floydWarshall = new FloydWarshall();
            toRet._floydWarshall._directions = jsonObject._floydWarshall._directions;
            toRet._floydWarshall._pathDistance = jsonObject._floydWarshall._pathDistance;
            toRet._borderIsDirty = false;
        }

        if (typeof(jsonObject._numDots) !== "undefined") {
            toRet._numDots = jsonObject._numDots;
        }

        if (typeof(jsonObject._powerUpSpawns) !== "undefined") {
            toRet._powerUpSpawns = jsonObject._powerUpSpawns;
        }

        return toRet;
    }

    constructor(width=default_width, height=default_height, levelNum=1) {
        super();

        this._width = width;
        this._height = height;
        this._levelNum = levelNum;
        let theGameMatrix = Level.constructGameMatrix(this._width, this._height);
        this._wireUpGameMatrix(theGameMatrix);
        this._gameMatrix = theGameMatrix;
        this._floydWarshall = null;
        this._borderIsDirty = true;
        this._numDots = null;
        this._powerUpSpawns = null;
        this._powerUps = null;

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
        this.toIgnore.push("_blinkBorder");
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
            _selectedLocation: this._selectedLocation.toJSON(),
            _numDots: this._numDots,
            _powerUpSpawns: this._powerUpSpawns
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

    get powerUps() {
        if (this._powerUps === null) {
            let toSet = [];
            let self = this;

            powerUps.forEach(function (pu, index) {
                if (index < self.levelNum) {
                    toSet.push(pu);
                }
            });

            this._powerUps = toSet;
        }

        return this._powerUps;
    }

    get levelNum() {
        return this._levelNum;
    }

    set levelNum(value) {
        this._setValueAndRaiseOnChange("_levelNum", value);
    }

    get gameMatrix() { return this._gameMatrix; }

    get width() { return this._width; }

    set width(value) {
        this._setValueAndRaiseOnChange("_width", value);
    }

    get screenWidth() {
        return this._width * Level.DEFAULT_WIDTH;
    }

    get height() { return this._height; }

    set height(value) {
        this._setValueAndRaiseOnChange("_height", value);
    }

    get screenHeight() {
        return this._height * Level.DEFAULT_HEIGHT;
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
            this._powerUpSpawns = null;
            this._numDots = null;
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
            this.regeneratePaths();
        }

        return this._floydWarshall;
    }

    regeneratePaths() {
        this._floydWarshall = new FloydWarshall();
        this._floydWarshall.buildAllPaths(this);
        this._floydWarshall.convertPathsToDirections(this);
        this._borderIsDirty = false;
    }

    get activeCells() {
        if (this._activeCellsIsDirty || (this._activeCells === null)) {
            this._activeCells = this._getActiveCells();
            this._activeCellsIsDirty = false;
        }

        return this._activeCells;
    }

    get color() {
        return this.getCell(0, 0).solidBorder.color;
    }

    set color(value) {
        // let oldValue = this.color;
        this.iterateOverCells(function (cell) {
            cell.solidBorder.color = value;
        });
        // this._raiseOnChangeCallbacks("color", oldValue, value);
    }

    get numDots() {
        if (this._numDots === null) {
            this.populateDotsAndSpawns();
        }

        return this._numDots;
    }

    get powerUpSpawns() {
        if (this._powerUpSpawns === null) {
            this.populateDotsAndSpawns();
        }

        return this._powerUpSpawns;
    }

    get blinkBorder() {
        return this.getCell(0, 0).blinkBorder;
    }

    set blinkBorder(value) {
        this.iterateOverCells(function (theCell) {
            theCell.blinkBorder = value;
        });
    }

    // TODO: Refactor this.  I know this is sloppy
    populateDotsAndSpawns() {
        let theNumDots = 0;
        let thePowerUpSpawns = [];
        let self = this;

        this.activeCells.forEach(function (cell) {
            if (cell.dotType !== Dot.NONE) {
                theNumDots++;
            }

            if (cell.isTeleportCell(self.width, self.height)) {
                thePowerUpSpawns.push(cell.id);
            }
        });

        this._numDots = theNumDots;
        this._powerUpSpawns = thePowerUpSpawns;
    }

    getLevelNumAsTimeRange() {
        let maxLevelNum = total_levels;
        let currentLevelNum = this.levelNum;
        if (currentLevelNum < 1) {
            currentLevelNum = 1;
        } else if (currentLevelNum > maxLevelNum) {
            currentLevelNum = maxLevelNum;
        }

        return EasingFunctions.getTime(1, maxLevelNum, currentLevelNum);
    }

    getRandomPowerUpSpawnLocation() {
        let numPowerUpSpawns = this.powerUpSpawns.length;
        let randomIndex = Math.floor(Math.random() * numPowerUpSpawns);
        let cellId = this.powerUpSpawns[randomIndex];
        let cell = this.getCellById(cellId);
        return cell.location;
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
                currentClonedCell.selected = false;
                currentClonedCell.location.set(currentNewXIndex, y);

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
                currentClonedCell.selected = false;
                currentClonedCell.location.set(x, currentNewYIndex);

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
            currentCell.solidBorder.color = this.color;
            currentCell.editMode = this.editMode;
            this._wireUp(Level._getGameMatrixPropName(x, this._height), currentCell);
            this.gameMatrix[this.height][x] = currentCell;
        }

        this._setValueAndRaiseOnChange("_height", this.height + 1);
    }

    removeRow() {
        if (this.height === 1) {
            return;
        }

        let self = this;
        let currentRow = this._gameMatrix.pop();
        currentRow.forEach(function (cell) {
            cell.setAllSpawnValuesFalse();
            self._unWireForDestruction(cell);
            cell.removeAllCallbacks();
        });

        this.height = this.height - 1;
    }

    addColumn() {
        for (let y = 0; y < this.height; y++) {
            let currentId = y + "_" + this.width;
            let currentCell = new Cell(currentId);
            currentCell.solidBorder.color = this.color;
            currentCell.editMode = this.editMode;
            this._wireUp(Level._getGameMatrixPropName(this.width, y), currentCell);

            this.gameMatrix[y][this.width] = currentCell;
        }

        this.width = this.width + 1;
    }

    removeColumn() {

        if (this.width === 1) {
            return;
        }

        for (let y = 0; y < this.height; y++) {
            let currentCell = this.gameMatrix[y].pop();
            currentCell.setAllSpawnValuesFalse();
            this._unWireForDestruction(currentCell);
            currentCell.removeAllCallbacks();
        }

        this.width = this.width - 1;
    }

    getCellByLocation(location) {
        if (location.x >= this.width || location.y >= this.height) {
            return null;
        }

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

    toBinary() {
        let toRet = [];
        let currentCell = null;

        for (let y = 0; y < this.height; y++) {

            toRet[y] = [];

            for (let x = 0; x < this.width; x++) {
                currentCell = this.getCell(x, y);
                toRet[y][x] = currentCell.toBinary();
            }
        }

        return toRet;
    }

    toGraph() {
        const addEdgeFromCellToLocation = function (graph, centerCell, targetLocation) {
            let targetCell = this.getCellByLocation(targetLocation);

            if (centerCell.canTraverseTo(targetCell, this.width, this.height)) {
                graph.addEdge(centerCell.id, targetCell.id);
            }

        }.bind(this);

        let toRet = new Graph();
        this.iterateOverCells(function (cell) {
            toRet.addVertex(cell.id);
        });

        this.iterateOverCells(function (centerCell) {

            let centerLocation = centerCell.location.clone();

            let leftLocation = centerLocation.clone().moveInDirection(Direction.LEFT, this.height, this.width);
            addEdgeFromCellToLocation(toRet, centerCell, leftLocation);

            let rightLocation = centerLocation.clone().moveInDirection(Direction.RIGHT, this.height, this.width);
            addEdgeFromCellToLocation(toRet, centerCell, rightLocation);

            let upLocation = centerLocation.clone().moveInDirection(Direction.UP, this.height, this.width);
            addEdgeFromCellToLocation(toRet, centerCell, upLocation);

            let downLocation = centerLocation.clone().moveInDirection(Direction.DOWN, this.height, this.width);
            addEdgeFromCellToLocation(toRet, centerCell, downLocation);

        }.bind(this));

        return toRet;
    }
}

export default Level;