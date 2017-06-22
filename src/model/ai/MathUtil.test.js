import MathUtil from "./MathUtil";

it ("distance works", () => {
    // SETUP
    let array1 = [1, 2, 3];
    let array2 = [0, 2, 3];

    // CALL
    let distance = MathUtil.distance(array1, array1);
    let distance2 = MathUtil.distance(array1, array2);

    // ASSERT
    expect(distance).toBeCloseTo(0);
    expect(distance2).toBeCloseTo(1);
});