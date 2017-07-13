// import GPU from "../../node_modules/gpu.js/src/gpu";
import { assert } from "./Assert";
import ArrayUtils from "./ArrayUtils";

class MatrixUtils {

    /**
     * This will return true if the array passed in is a 2D array.
     * @param array {Array}
     * @returns {Boolean} true if array is 2D
     */
    static is2D(array) {
        if (!(array instanceof Array)) {
            return false;
        }

        if (array.length <= 0) {
            return false;
        }

        return array[0] instanceof Array;
    }

    /**
     * Return true if this is a 1D array.
     * @param array {Array}
     * @returns {boolean}
     */
    static is1D(array) {
        if (!array instanceof Array) {
            return false;
        }

        if (array.length <= 0) {
            return false;
        }

        return !(array[0] instanceof Array);
    }

    static convertTo2D(array) {
        if (MatrixUtils.is2D(array)) {
            return ArrayUtils.deepCopy(array);
        }

        assert (MatrixUtils.is1D(array), "Array must be 1D if not 2D");

        let toRet = [];

        array.forEach(function (item, index) {
            toRet[index] = [item];
        });

        return toRet;
    }

    static create(height, width, value=0) {
        let toRet = [];

        for (let y = 0; y < height; y++) {
            toRet[y] = [];

            for (let x = 0; x < width; x++) {
                toRet[y][x] = value;
            }
        }

        return toRet;
    }

    /**
     * This method should convert a 1D array into a Diagonal Matrix
     * @param array1D {Array} 1D array which represents the diagonal.
     * @returns {Array} 2D Array of all zeros and the 1D diagonal.
     */
    static toDiagonal(array1D) {
        let toRet = [];
        let length = array1D.length;
        let currentArray;

        array1D.forEach(function (item, index) {
            currentArray = ArrayUtils.create1D(length, 0);
            currentArray[index] = item;
            toRet.push(currentArray);
        });

        return toRet;
    }

    /**
     * This will modify array2D and remove the last column
     * @param array2D {Array} The array2D you wish to remove a column from.
     */
    static popColumn(array2D) {
        assert (array2D.length > 0 && array2D[0].length > 0, "Invalid array2d");

        array2D.forEach(function (row) {
            row.pop();
        });
    }
}

export default MatrixUtils;