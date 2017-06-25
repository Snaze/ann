import ArrayUtils from "./ArrayUtils";

it ("test getColumn", () => {
    // SETUP
    let dataSet = [[3, 4],
                    [4, 5],
                    [5, 6]];

    // CALL
    let col0 = ArrayUtils.getColumn(dataSet, 0);
    let col1 = ArrayUtils.getColumn(dataSet, 1);

    // ASSERT
    expect(col0.length).toBe(3);
    expect(col0[0]).toBe(3);
    expect(col0[1]).toBe(4);
    expect(col0[2]).toBe(5);

    expect(col1.length).toBe(3);
    expect(col1[0]).toBe(4);
    expect(col1[1]).toBe(5);
    expect(col1[2]).toBe(6);
});

it ("test setColumn", () => {
    // SETUP
    let dataSet = [[3, 4],
        [4, 5],
        [5, 6]];

    // CALL
    ArrayUtils.setColumn(dataSet, [-3, -4, -5], 0);
    ArrayUtils.setColumn(dataSet, [-4, -5, -6], 1);

    // ASSERT
    let col0 = ArrayUtils.getColumn(dataSet, 0);
    let col1 = ArrayUtils.getColumn(dataSet, 1);

    expect(col0.length).toBe(3);
    expect(col0[0]).toBe(-3);
    expect(col0[1]).toBe(-4);
    expect(col0[2]).toBe(-5);

    expect(col1.length).toBe(3);
    expect(col1[0]).toBe(-4);
    expect(col1[1]).toBe(-5);
    expect(col1[2]).toBe(-6);
});

it ("test forEachColumn", () => {
   // SETUP
    let dataSet = [[3, 4, 5]];
    let num = 0;
    let callback = function (column) {
        if ([3, 4, 5].indexOf(column[0]) >= 0) {
            num++;
        }
    };

    // CALL
    ArrayUtils.forEachColumn(dataSet, callback);

    // ASSERT
    expect(num).toBe(3);
});

it ("test transpose", () => {
    // SETUP
    let dataSet = [[3, 4, 5],
                   [6, 7, 8]];

    // CALL
    let result = ArrayUtils.transpose(dataSet);

    // ASSERT
    expect(result[0][0]).toBe(3);
    expect(result[0][1]).toBe(6);
    expect(result[1][0]).toBe(4);
    expect(result[1][1]).toBe(7);
    expect(result[2][0]).toBe(5);
    expect(result[2][1]).toBe(8);
});

it ("test create", () => {
    // SETUP

    // CALL
    let result = ArrayUtils.create(3, 3, 1);

    // ASSERT
    for (let y = 0; y < 3; y++) {
        for (let x = 0; x < 3; x++) {
            expect(result[y][x]).toBe(1);
        }
    }
});

it ("test height", () => {
    // SETUP
    let input = [[1, 2], [3, 4], [5, 6]];

    // CALL
    let height = ArrayUtils.height(input);

    // ASSERT
    expect(height).toBe(3);
});

it ("test width", () => {
    // SETUP
    let input = [[1, 2], [3, 4], [5, 6]];

    // CALL
    let width = ArrayUtils.width(input);

    // ASSERT
    expect(width).toBe(2);
});

it ("range works", () => {
    // SETUP
    let length = 5;

    // CALL
    let toCheck = ArrayUtils.range(length);

    // ASSERT
    expect(toCheck[0]).toBe(0);
    expect(toCheck[1]).toBe(1);
    expect(toCheck[2]).toBe(2);
    expect(toCheck[3]).toBe(3);
    expect(toCheck[4]).toBe(4);
});

it ("shuffle works", () => {
    // SETUP
    let length = 1000;
    let range = ArrayUtils.range(length);

    // CALL
    let shuffledRange = ArrayUtils.shuffle(range);

    // ASSERT
    let diffFound = false;
    for (let i = 0; i < length; i++) {
        if (range[i] !== shuffledRange[i]) {
            diffFound = true;
            break;
        }
    }
    expect(diffFound).toBe(true);
});

it ("sample with replacement", () => {
    // SETUP
    let toSampleFrom = [1, 2, 3];

    // CALL
    let result = ArrayUtils.sample(toSampleFrom, 9, true);

    // ASSERT
    expect(result.length).toBe(9);
    for (let i = 0; i < 9; i++) {
        expect(toSampleFrom).toContain(result[i]);
    }
});

it ("sample without replacement", () => {
    // SETUP
    let toSampleFrom = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    let numToSample = 3;

    // CALL
    let result = ArrayUtils.sample(toSampleFrom, numToSample, false);

    // ASSERT
    expect(result.length).toBe(numToSample);
    for (let i = 0; i < numToSample; i++) {
        expect(toSampleFrom).toContain(result[i]);
    }
    expect(result[0] !== result[1]).toBe(true);
    expect(result[0] !== result[2]).toBe(true);
    expect(result[1] !== result[2]).toBe(true);
});

it ("test take", () => {
    // SETUP
    let toTakeFrom = [1, 2, 3, 4, 5];

    // CALL
    let result = ArrayUtils.take(toTakeFrom, 3, 1);
    let endResult = ArrayUtils.take(toTakeFrom, 3, 4);

    // ASSERT
    expect(result.length).toBe(3);
    expect(result[0]).toBe(2);
    expect(result[1]).toBe(3);
    expect(result[2]).toBe(4);
    expect(endResult.length).toBe(1);
    expect(endResult[0]).toBe(5);
});

it ("test select", () => {
    // SETUP
    let toSelectFrom = [0, 1, 2, 3, 4, 5];

    // CALL
    let result = ArrayUtils.select(toSelectFrom, [0, 3, 5]);

    // ASSERT
    expect(result[0]).toBe(0);
    expect(result[1]).toBe(3);
    expect(result[2]).toBe(5);
});

it ("test element multiply", () => {
    // SETUP
    let array = [[1, 2],
                 [3, 4]];

    // CALL
    let result = ArrayUtils.elementWiseMatrixMultiply(array, array);

    // ASSERT
    expect(result[0][0]).toBe(1);
    expect(result[0][1]).toBe(4);
    expect(result[1][0]).toBe(9);
    expect(result[1][1]).toBe(16);
});

it ("test copyInto", () => {
    // SETUP
    let source = [1, 2, 3];
    let dest = [0, 0, 0];

    // CALL
    ArrayUtils.copyInto(source, dest);

    // ASSERT
    expect(dest[0]).toBe(1);
    expect(dest[1]).toBe(2);
    expect(dest[2]).toBe(3);
});

it ("flatten works", () => {
    // SETUP
    let toFlatten = [[[3]]];
    let shouldEqual = [3];

    // CALL
    let toCheck = ArrayUtils.flatten(toFlatten);

    // ASSERT
    expect(ArrayUtils.arrayEquals(toCheck, shouldEqual)).toBe(true);
});

it ("flatten works 2", () => {
    // SETUP
    let toFlatten = [0, [1, 2], 3, [[4], [[5, 6]]]];
    let shouldEqual = [0, 1, 2, 3, 4, 5, 6];

    // CALL
    let toCheck = ArrayUtils.flatten(toFlatten);

    // ASSERT
    expect(ArrayUtils.arrayEquals(toCheck, shouldEqual)).toBe(true);
});

it ("arrayEquals works", () => {
    // SETUP
    let one_1 = [1, 2, 3];
    let one_2 = [1, 2, 3];

    let two_1 = [1, 2, 4];
    let two_2 = [1, 2, 3];

    let three_1 = [1, 2, 3];
    let three_2 = [1, 2, 3, 4];

    // CALL
    let one = ArrayUtils.arrayEquals(one_1, one_2);
    let two = ArrayUtils.arrayEquals(two_1, two_2);
    let three = ArrayUtils.arrayEquals(three_1, three_2);

    // ASSERT
    expect(one).toBe(true);
    expect(two).toBe(false);
    expect(three).toBe(false);
});

it ("filter works", () => {
    // SETUP
    let toFilter = [-5, -4, -3, -2, -1, 0];

    // CALL
    let result = ArrayUtils.filter(toFilter, (item) => {return item >=0;});

    // ASSERT
    expect(result.length).toBe(1);
    expect(result[0]).toBe(0);
});

it ("arrayApproxEquals works", () => {
    // SETUP
    let toCheck = [0.0000001, 0.0000002];
    let other   = [0.00000012222, 0.00000022222];
    let otherFa = [0.00002012222, 0.00000022222];

    // CALL
    let areEquals = ArrayUtils.arrayApproxEquals(toCheck, other);
    let areEquals2 = ArrayUtils.arrayApproxEquals(toCheck, otherFa);

    // ASSERT
    expect(areEquals).toBe(true);
    expect(areEquals2).toBe(false);
});

it ("isIn works", () => {
    // SETUP
    let toCheck = [0, 1, 2, 3];

    // CALL

    // ASSERT
    expect(ArrayUtils.isIn(toCheck, 0)).toBe(true);
    expect(ArrayUtils.isIn(toCheck, 4)).toBe(false);
});