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

}

export default MatrixUtils;