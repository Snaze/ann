

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

}

export default MathUtil;