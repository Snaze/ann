import MatrixUtils from "./MatrixUtils";

it ("test create", () => {
    // SETUP

    // CALL
    let result = MatrixUtils.create(3, 3, 1);

    // ASSERT
    for (let y = 0; y < 3; y++) {
        for (let x = 0; x < 3; x++) {
            expect(result[y][x]).toBe(1);
        }
    }
});

it ("is1D", () => {
    // SETUP
    let yes1 = [1, 2, 3];
    let yes2 = [1];
    let no1 = [[1, 2]];
    let no2 = [[1, 2], [3, 4]];

    // CALL and ASSERT
    expect(MatrixUtils.is1D(no1)).toBe(false);
    expect(MatrixUtils.is1D(no2)).toBe(false);
    expect(MatrixUtils.is1D(yes1)).toBe(true);
    expect(MatrixUtils.is1D(yes2)).toBe(true);

});

it ("is2D", () => {
    // SETUP
    let no1 = [1, 2, 3];
    let no2 = [];
    let yes1 = [[1, 2]];
    let yes2 = [[1, 2], [3, 4]];

    // CALL and ASSERT
    expect(MatrixUtils.is2D(no1)).toBe(false);
    expect(MatrixUtils.is2D(no2)).toBe(false);
    expect(MatrixUtils.is2D(yes1)).toBe(true);
    expect(MatrixUtils.is2D(yes2)).toBe(true);

});

it ("Convert to 2D", () => {
    // SETUP
    let toConvert = [1, 2, 3];

    // CALL
    let toCheck = MatrixUtils.convertTo2D(toConvert);

    // ASSERT
    expect(toCheck.length).toBe(3);
    expect(toCheck[0].length).toBe(1);
    expect(toCheck[0][0]).toBe(1);
    expect(toCheck[1].length).toBe(1);
    expect(toCheck[1][0]).toBe(2);
    expect(toCheck[2].length).toBe(1);
    expect(toCheck[2][0]).toBe(3);
});

it ("toDiagonal", () => {
    // SETUP
    let toDiagonalize = [1, 2, 3];

    // CALL
    let toCheck = MatrixUtils.toDiagonal(toDiagonalize);

    // ASSERT
    expect(toCheck.length).toBe(3);
    expect(toCheck[0].length).toBe(3);
    expect(toCheck[0][0]).toBe(1);
    expect(toCheck[0][1]).toBe(0);
    expect(toCheck[0][2]).toBe(0);

    expect(toCheck[1].length).toBe(3);
    expect(toCheck[1][0]).toBe(0);
    expect(toCheck[1][1]).toBe(2);
    expect(toCheck[1][2]).toBe(0);

    expect(toCheck[2].length).toBe(3);
    expect(toCheck[2][0]).toBe(0);
    expect(toCheck[2][1]).toBe(0);
    expect(toCheck[2][2]).toBe(3);
});