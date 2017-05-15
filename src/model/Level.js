import Cell from "./Cell";
import Dot from "./Dot";
import BorderType from "./BorderType";

const DEFAULT_WIDTH = 26;
const DEFAULT_HEIGHT = 52;

class Level {
    constructor() {
        this._currentWidth = DEFAULT_WIDTH;
        this._currentHeight = DEFAULT_HEIGHT;

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