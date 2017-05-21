import Cell from "./Cell";
import _ from "../../node_modules/lodash/lodash";
import BorderType from "./BorderType";
import Eventer from "../utils/Eventer";

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

class Level {
    static get SPAWN_INDICES_PLAYER() { return spawn_indices_player; }
    static get SPAWN_INDICES_GHOST_RED() { return spawn_indices_ghostRed; }
    static get SPAWN_INDICES_GHOST_BLUE() { return spawn_indices_ghostBlue; }
    static get SPAWN_INDICES_GHOST_ORANGE() { return spawn_indices_ghostOrange; }
    static get SPAWN_INDICES_GHOST_PINK() { return spawn_indices_ghostPink; }

    constructor(width=DEFAULT_WIDTH, height=DEFAULT_HEIGHT) {
        this._currentWidth = width;
        this._currentHeight = height;
        // TODO: refactor these indices to use the Location object
        this._spawnIndices = {
            player: [-1, -1], // Y, X
            ghostRed: [-1, -1], // Y, X
            ghostBlue: [-1, -1], // Y, X
            ghostOrange: [-1, -1], // Y, X
            ghostPink: [-1, -1] // Y, X
        };

        this._eventer = new Eventer();
        this._gameMatrix = Level.constructGameMatrix(this._currentWidth,
            this._currentHeight,
            (e) => this._spawnChangedCallback(e));
        this._selectedCell = this._gameMatrix[0][0];

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

    static constructGameMatrix(width, height, callback) {
        let toRet = [];

        for (let y = 0; y < height; y++) {
            toRet[y] = [];

            for (let x = 0; x < width; x++) {
                let currentId = y + "_" + x;
                toRet[y][x] = new Cell(currentId, callback);
            }
        }

        return toRet;
    }

    static fromJSON(jsonObject) {
        // let jsonObject = JSON.parse(json);
        let width = jsonObject._currentWidth;
        let height = jsonObject._currentHeight;
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

    get spawnIndices() {
        return this._spawnIndices;
    }

    getSpawnIndices(spawnIndicesName) {
        if (valid_spawn_indices_name.indexOf(spawnIndicesName) < 0) {
            throw new Error("Invalid spawn indices name: " + spawnIndicesName);
        }

        return this._spawnIndices[spawnIndicesName];
    }

    _removeSpawnValueIfFound(cell) {
        let toRet = false;

        let y = cell.y;
        let x = cell.x;

        for (let prop in this._spawnIndices) {
            if (this._spawnIndices.hasOwnProperty(prop) &&
                this._spawnIndices[prop][0] === y &&
                this._spawnIndices[prop][1] === x) {

                this._spawnIndices[prop] = [-1, -1];
                toRet = true;
            }
        }

        return toRet;
    }

    _spawnChangedCallback(e) {
        let cell = e.cell;
        let cellIndexArray = [cell.y, cell.x];
        let spawnValue = e.spawnValue;

        switch (spawnValue) {
            case "player":
            case "ghostBlue":
            case "ghostRed":
            case "ghostOrange":
            case "ghostPink":
                this._removeSpawnValueIfFound(cell);
                if (!_.isEqual(this._spawnIndices[spawnValue], [-1, -1]) &&
                    !_.isEqual(this._spawnIndices[spawnValue], cellIndexArray)) {
                    let otherCellIndexArray = this._spawnIndices[spawnValue];
                    let otherCell = this.gameMatrix[otherCellIndexArray[0]][otherCellIndexArray[1]];
                    otherCell.setAllSpawnValuesFalse();
                }
                this._spawnIndices[spawnValue] = [cell.y, cell.x];
                this.raiseOnChangeCallbacks("_spawnChangedCallback");
                break;
            case "none":
                if (this._removeSpawnValueIfFound(cell)) {
                    this.raiseOnChangeCallbacks("_spawnChangedCallback");
                }
                break;
            default:
                throw new Error("Unknown spawnValue found");
        }

        // console.log("Spawn Changed " + JSON.stringify(this._spawnIndices));
    }

    mirrorHorizontally() {

        let currentNewXIndex = 0;
        let currentCell = null;
        let currentClonedCell = null;

        for (let y = 0; y < this._currentHeight; y++) {

            currentNewXIndex = this._currentWidth;

            for (let x = (this._currentWidth - 1); x >= 0; x--) {

                currentCell = this.gameMatrix[y][x];
                currentClonedCell = currentCell.clone(y + "_" + currentNewXIndex, "horizontal");
                this.gameMatrix[y][currentNewXIndex++] = currentClonedCell;
            }
        }

        this._currentWidth = currentNewXIndex;
        this.raiseOnChangeCallbacks("mirrorHorizontally");
    }

    mirrorVertically() {

        let currentNewYIndex = this._currentHeight;
        let currentCell = null;
        let currentClonedCell = null;

        for (let y = (this._currentHeight - 1); y >= 0; y--) {

            this.gameMatrix[currentNewYIndex] = [];

            for (let x = 0; x < this._currentWidth; x++) {

                currentCell = this.gameMatrix[y][x];
                currentClonedCell = currentCell.clone(currentNewYIndex + "_" + x, "vertical");
                this.gameMatrix[currentNewYIndex][x] = currentClonedCell;
            }

            currentNewYIndex++;
        }

        this._currentHeight = currentNewYIndex;
        this.raiseOnChangeCallbacks("mirrorVertically");
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

    get width() { return this._currentWidth; }
    get height() { return this._currentHeight; }

    addRow() {
        this._gameMatrix[this._currentHeight] = [];

        for (let x = 0; x < this._currentWidth; x++) {
            let currentId = this._currentHeight + "_" + x;
            this._gameMatrix[this._currentHeight][x] = new Cell(currentId, (e) => this._spawnChangedCallback(e));
        }

        this._currentHeight++;
        this.raiseOnChangeCallbacks("addRow");
    }

    removeRow() {
        this._currentHeight--;
        this._gameMatrix.pop();
        this.raiseOnChangeCallbacks("removeRow");
    }

    addColumn() {
        for (let y = 0; y < this._currentHeight; y++) {
            let currentId = y + "_" + this._currentWidth;
            this._gameMatrix[y][this._currentWidth] = new Cell(currentId, (e) => this._spawnChangedCallback(e));
        }

        this._currentWidth++;

        this.raiseOnChangeCallbacks("addColumn");
    }

    removeColumn() {
        this._currentWidth--;

        for (let y = 0; y < this._currentHeight; y++) {
            this._gameMatrix[y].pop();
        }

        this.raiseOnChangeCallbacks("removeColumn");
    }

    get selectedCell() {
        return this._selectedCell;
    }

    setSelectedCellByIndex(x, y) {
        this._selectedCell = this._gameMatrix[y][x];

        this.raiseOnChangeCallbacks("setSelectedCellByIndex");
    }
}

export default Level;