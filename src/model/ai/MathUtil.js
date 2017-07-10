import { assert } from "../../utils/Assert";
import math from "../../../node_modules/mathjs/dist/math";

class MathUtil {

    static argMax(theArray) {
        let index = -1;
        let max = Number.NEGATIVE_INFINITY;

        theArray.forEach(function (item, i) {
            if (item > max) {
                max = item;
                index = i;
            }
        });

        return index;
    }

    static getRandomArbitrary(min, max) {
        return Math.random() * (max - min) + min;
    }

    static distance(array1, array2) {
        assert (array1.length === array2.length);

        let diffArray = math.subtract(array1, array2);
        for (let i = 0; i < diffArray.length; i++) {
            diffArray[i] = math.pow(diffArray[i], 2);
        }
        let sum = math.sum(diffArray);
        return math.sqrt(sum);
    }

    static clip (toClip, minValue, maxValue) {
        if (toClip instanceof Array) {

            for (let i = 0; i < toClip.length; i++) {
                toClip[i] = MathUtil.clip(toClip[i], minValue, maxValue);
            }

            return toClip;
        }

        if (toClip < minValue) {
            toClip = minValue;
        } else if (toClip > maxValue) {
            toClip = maxValue;
        }

        return toClip;
    }

    /**
     * This method will compute the number of bits required to represent the input decimal value.
     *
     * @param decimalValue {Number} The decimal value you wish to know how many bits are required
     * for it to be represented in binary.  This value must be positive.
     * @returns {Number} The number of bits required to represent the decimal value in binary.
     */
    static getNumBits(decimalValue) {
        assert (decimalValue >= 0, "decimal value must be positive");

        if (decimalValue === 0) {
            return 1;
        }

        return Math.floor(Math.log2(decimalValue)) + 1;
    }

    /**
     * Use this method to compare 2 float values for equality.
     * @param float1 {Number} The first number to compare.
     * @param float2 {Number} The second number to compare.
     * @param minDistance {Number} The minimum distance between float1 and float2 in order to return true.
     * @returns {boolean} Returns true if the 2 numbers are within minDistance of each other.
     */
    static isClose(float1, float2, minDistance=1e-9) {
        return Math.abs(float1 - float2) <= minDistance;
    }
}

export default MathUtil;