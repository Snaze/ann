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
}

export default MathUtil;