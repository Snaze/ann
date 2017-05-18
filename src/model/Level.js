import Cell from "./Cell";

const DEFAULT_WIDTH = 26;
const DEFAULT_HEIGHT = 26;

class Level {
    constructor(width=DEFAULT_WIDTH, height=DEFAULT_HEIGHT) {
        this._currentWidth = width;
        this._currentHeight = height;
        this._spawnIndices = {
            player: [-1, -1], // Y, X
            ghostRed: [-1, -1], // Y, X
            ghostBlue: [-1, -1], // Y, X
            ghostOrange: [-1, -1], // Y, X
            ghostPink: [-1, -1] // Y, X
        };

        this._gameMatrix = Level.constructGameMatrix(this._currentWidth,
            this._currentHeight,
            (e) => this._spawnChangedCallback(e));
    }

    static constructGameMatrix(width, height, spawnChangedCallback) {
        let toRet = [];

        for (let y = 0; y < height; y++) {
            toRet[y] = [];

            for (let x = 0; x < width; x++) {
                let currentId = y + "_" + x;
                toRet[y][x] = new Cell(currentId, spawnChangedCallback);
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

        if (typeof(jsonObject._spawnIndices) !== 'undefined') {
            this._spawnIndices = jsonObject._spawnIndices;
        }


        for (let y = 0; y < height; y++) {

            for (let x = 0; x < width; x++) {
                currentCell = toRet.gameMatrix[y][x];
                currentDataCell = jsonObject._gameMatrix[y][x];

                currentCell.setSolidBorder("left", currentDataCell._solidBorder._left);
                currentCell.setSolidBorder("top", currentDataCell._solidBorder._top);
                currentCell.setSolidBorder("right", currentDataCell._solidBorder._right);
                currentCell.setSolidBorder("bottom", currentDataCell._solidBorder._bottom);

                currentCell.setPartialBorder("left", currentDataCell._partialBorder._left);
                currentCell.setPartialBorder("top", currentDataCell._partialBorder._top);
                currentCell.setPartialBorder("right", currentDataCell._partialBorder._right);
                currentCell.setPartialBorder("bottom", currentDataCell._partialBorder._bottom);

                conditionalAssignCell("_isPlayerSpawn");
                conditionalAssignCell("_isGhostRedSpawn");
                conditionalAssignCell("_isGhostPinkSpawn");
                conditionalAssignCell("_isGhostBlueSpawn");
                conditionalAssignCell("_isGhostOrangeSpawn");
                conditionalAssignCell("_isActive");

                currentCell.dotType = currentDataCell._dotType;
            }
        }

        return toRet;
    }

    get spawnIndices() {
        return this._spawnIndices;
    }

    _removeSpawnValueIfFound(cell) {
        let y = cell.y;
        let x = cell.x;

        for (let prop in this._spawnIndices) {
            if (this._spawnIndices.hasOwnProperty(prop) &&
                this._spawnIndices[prop][0] === y &&
                this._spawnIndices[prop][1] === x) {

                // let toResetY = this._spawnIndices[prop][0];
                // let toResetX = this._spawnIndices[prop][1];
                // let toReset = this.gameMatrix[toResetY][toResetX];
                //
                // switch (prop) {
                //     case "player":
                //         toReset.isPlayerSpawn = false;
                //         break;
                //     case "ghostBlue":
                //         toReset.isGhostBlueSpawn = false;
                //         break;
                //     case "ghostRed":
                //         toReset.isGhostRedSpawn = false;
                //         break;
                //     case "ghostPink":
                //         toReset.isGhostPinkSpawn = false;
                //         break;
                //     case "ghostOrange":
                //         toReset.isGhostOrangeSpawn = false;
                //         break;
                // }

                this._spawnIndices[prop] = [-1, -1];
            }
        }
    }

    _spawnChangedCallback(e) {
        let cell = e.cell;
        let spawnValue = e.spawnValue;

        switch (spawnValue) {
            case "player":
            case "ghostBlue":
            case "ghostRed":
            case "ghostOrange":
            case "ghostPink":
                this._removeSpawnValueIfFound(cell);
                this._spawnIndices[spawnValue] = [cell.y, cell.x];
                break;
            case "none":
                this._removeSpawnValueIfFound(cell);
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
    }

    removeRow() {
        this._currentHeight--;
        this._gameMatrix.pop();
    }

    addColumn() {
        for (let y = 0; y < this._currentHeight; y++) {
            let currentId = y + "_" + this._currentWidth;
            this._gameMatrix[y][this._currentWidth] = new Cell(currentId, (e) => this._spawnChangedCallback(e));
        }

        this._currentWidth++;
    }

    removeColumn() {
        this._currentWidth--;

        for (let y = 0; y < this._currentHeight; y++) {
            this._gameMatrix[y].pop();
        }
    }
}

export default Level;