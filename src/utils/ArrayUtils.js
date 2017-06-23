import { assert } from "./Assert";

class ArrayUtils {

    static getColumn(array2D, colIndex) {
        let toRet = [];

        for (let y = 0; y < array2D.length; y++) {
            toRet.push(array2D[y][colIndex]);
        }

        return toRet;
    }

    static setColumn(array2D, column, colIndex) {

        assert (array2D.length === column.length);

        for (let y = 0; y < array2D.length; y++) {
            array2D[y][colIndex] = column[y];
        }
    }

    static forEachColumn(array2D, callback) {

        for (let colIndex = 0; colIndex < array2D[0].length; colIndex++) {
            let currentColumn = ArrayUtils.getColumn(array2D, colIndex);
            callback(currentColumn, colIndex);
        }

    }

    static transpose(array2D) {
        let toRet = [];

        ArrayUtils.forEachColumn(array2D, function (column) {
            toRet.push(column);
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

    static height(array2D) {
        return array2D.length;
    }

    static width(array2D) {
        if (array2D && array2D.length > 0) {
            return array2D[0].length;
        }

        return 0;
    }

    /**
     * This will return an array containing the numbers 0 to (length - 1)
     *
     * @param length The length of the range array
     */
    static range(length) {
        let toRet = [];

        for (let i = 0; i < length; i++) {
            toRet.push(i);
        }

        return toRet;
    }

    /**
     * Returns a shuffle version of the array
     *
     * @param toShuffle
     */
    static shuffle(toShuffle) {
        let toRet = toShuffle.slice(0);

        for (let i = toRet.length; i; i--) {
            let j = Math.floor(Math.random() * i);
            [toRet[i - 1], toRet[j]] = [toRet[j], toRet[i - 1]];
        }

        return toRet;
    }

    static sample(toSample, numToSample, replacement=false) {

        let toRet = [];

        if (replacement) {

            for (let i = 0; i < numToSample; i++) {
                let randomIndex = Math.floor(Math.random() * toSample.length);
                toRet.push(toSample[randomIndex]);
            }

        } else {
            assert (toSample.length >= numToSample, "Cannot sample more than array length if replacement is false");

            let range = ArrayUtils.range(toSample.length);
            let shuffledRange = ArrayUtils.shuffle(range);

            for (let i = 0; i < numToSample; i++) {
                let randomIndex = shuffledRange[i];
                toRet.push(toSample[randomIndex]);
            }
        }

        return toRet;
    }

    static take(theArray, numToTake, fromIndex=0) {
        assert (fromIndex < theArray.length);

        let toRet = [];

        for (let i = fromIndex; i < theArray.length; i++) {
            toRet.push(theArray[i]);
            if (toRet.length >= numToTake) {
                break;
            }
        }

        return toRet;
    }

    static select(theArray, indicesToSelect) {
        assert (theArray.length >= indicesToSelect.length);

        let toRet = [];

        for (let i = 0; i < indicesToSelect.length; i++) {
            toRet.push(theArray[indicesToSelect[i]]);
        }

        return toRet;
    }

    static elementWiseMatrixMultiply(array2D_1, array2D_2) {

        assert(array2D_1.length === array2D_2.length);
        assert(array2D_1[0].length === array2D_2[0].length);

        let toRet = [];

        for (let y = 0; y < array2D_1.length; y++) {

            toRet[y] = [];

            for (let x = 0; x < array2D_1[y].length; x++) {
                toRet[y][x] = array2D_1[y][x] * array2D_2[y][x];
            }
        }

        return toRet;
    }

    static copyInto(sourceArray, destArray) {

        for (let i = 0; i < sourceArray.length; i++) {
            destArray[i] = sourceArray[i];
        }
    }

    static flatten(toFlatten) {
        let toRet = [];
        let current = null;
        let nestedArray = null;

        for (let i = 0; i < toFlatten.length; i++) {
            current = toFlatten[i];

            if (current instanceof Array) {
                nestedArray = ArrayUtils.flatten(current);

                toRet.push.apply(toRet, nestedArray);
            } else {
                toRet.push(current);
            }
        }

        return toRet;
    }

    static arrayEquals(array1, array2) {
        if (array1 === array2) {
            return true;
        }

        if (array1 === null || array2 === null) {
            return false;
        }

        if (array1.length !== array2.length) {
            return false;
        }

        for (let i = 0; i < array1.length; i++) {
            if (array1[i] !== array2[i]) {
                return false;
            }
        }

        return true;
    }

    static extend(toExtend, toExtendWith, callback) {
        for (let i = 0; i < toExtendWith.length; i++) {
            if (!callback) {
                toExtend.push(toExtendWith[i]);
            } else {
                toExtend.push(callback(toExtendWith[i]));
            }
        }
    }
}

export default ArrayUtils;