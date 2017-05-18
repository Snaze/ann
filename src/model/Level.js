import Cell from "./Cell";

const DEFAULT_WIDTH = 26;
const DEFAULT_HEIGHT = 26;

class Level {
    constructor(width=DEFAULT_WIDTH, height=DEFAULT_HEIGHT) {
        this._currentWidth = width;
        this._currentHeight = height;

        this._gameMatrix = Level.constructGameMatrix(this._currentWidth, this._currentHeight);
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
        let width = jsonObject._currentWidth;
        let height = jsonObject._currentHeight;
        let toRet = new Level(width, height);
        let currentCell = null;
        let currentDataCell = null;
        let conditionalAssign = function(property) {
            if (typeof(currentDataCell[property]) !== 'undefined') {
                currentCell[property] = currentDataCell[property];
            }
        };

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

                conditionalAssign("_isPlayerSpawn");
                conditionalAssign("_isGhostRedSpawn");
                conditionalAssign("_isGhostPinkSpawn");
                conditionalAssign("_isGhostBlueSpawn");
                conditionalAssign("_isGhostOrangeSpawn");
                conditionalAssign("_isActive");

                currentCell.dotType = currentDataCell._dotType;
            }
        }

        return toRet;
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
            this._gameMatrix[this._currentHeight][x] = new Cell(currentId);
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
            this._gameMatrix[y][this._currentWidth] = new Cell(currentId);
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