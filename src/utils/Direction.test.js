import Direction from "./Direction";

it ("test binary to decimal conversion", () => {
    // SETUP

    // CALL
    let leftBin = Direction.toBinary(Direction.LEFT);
    let upBin = Direction.toBinary(Direction.UP);
    let rightBin = Direction.toBinary(Direction.RIGHT);
    let downBin = Direction.toBinary(Direction.DOWN);

    // ASSERT and CALL
    expect(Direction.decimalToDirection(parseInt(leftBin, 2))).toBe(Direction.LEFT);
    expect(Direction.decimalToDirection(parseInt(upBin, 2))).toBe(Direction.UP);
    expect(Direction.decimalToDirection(parseInt(rightBin, 2))).toBe(Direction.RIGHT);
    expect(Direction.decimalToDirection(parseInt(downBin, 2))).toBe(Direction.DOWN);
});