import Location from "./Location";
import _ from "../../node_modules/lodash/lodash";

it("toArray works", () => {
    let loc = new Location(1, 2);

    expect(_.isEqual(loc.toArray(), [2, 1])).toBe(true);
    expect(_.isEqual(loc.toArray(false), [1, 2])).toBe(true);
});

it ("toString works", () => {
    let loc = new Location(1, 2);

    expect(loc.toString()).toBe("(1, 2)");
});

it ("fromIndexArray works", () => {
    let indexArray = [1, 2];
    let loc = Location.fromIndexArray(indexArray);

    expect(loc.x).toBe(2);
    expect(loc.y).toBe(1);

    loc = Location.fromIndexArray(indexArray, false);

    expect(loc.x).toBe(1);
    expect(loc.y).toBe(2);
});

const testIsAbove = function (lowerLoc, aboveLoc, expectedValue, maxHeight = null) {
    // CALL
    let retVal = aboveLoc.isAbove(lowerLoc, maxHeight);

    // ASSERT
    expect(retVal).toBe(expectedValue);
};

it ("isAbove works - simple case", () => {
    testIsAbove(new Location(1, 1), new Location(1, 0), true);
});

it ("isAbove works - wrap case", () => {
    testIsAbove(new Location(1, 0), new Location(1, 2), true, 3);
});

it ("isAbove works - wrong case", () => {
    testIsAbove(new Location(1, 2), new Location(1, 0), false);
});

it ("isAbove works - wrong case 2", () => {
    testIsAbove(new Location(1, 2), new Location(0, 1), false);
});

const testIsLeftOf = function (leftLoc, rightLoc, expectedValue, maxWidth = null) {
    // CALL
    let retVal = leftLoc.isLeftOf(rightLoc, maxWidth);

    // ASSERT
    expect(retVal).toBe(expectedValue);
};

it ("isLeftOf works - simple case", () => {
    testIsLeftOf(new Location(0, 0), new Location(1, 0), true);
});

it ("isLeftOf works - wrap case", () => {
    testIsLeftOf(new Location(2, 0), new Location(0, 0), true, 3);
});

it ("isLeftOf works - wrong case", () => {
    testIsLeftOf(new Location(0, 0), new Location(2, 0), false);
});

it ("isLeftOf works - wrong case 2", () => {
    testIsLeftOf(new Location(0, 1), new Location(1, 0), false);
});

const testIsRightOf = function (leftLoc, rightLoc, expectedValue, maxWidth = null) {
    // CALL
    let retVal = rightLoc.isRightOf(leftLoc, maxWidth);

    // ASSERT
    expect(retVal).toBe(expectedValue);
};

it ("isRightOf works - simple case", () => {
    testIsRightOf(new Location(0, 0), new Location(1, 0), true);
});

it ("isRightOf works - wrap case", () => {
    testIsRightOf(new Location(2, 0), new Location(0, 0), true, 3);
});

it ("isRightOf works - wrong case", () => {
    testIsRightOf(new Location(0, 0), new Location(2, 0), false);
});

it ("isRightOf works - wrong case 2", () => {
    testIsRightOf(new Location(0, 1), new Location(1, 0), false);
});

const testIsBelow = function (belowLoc, aboveLoc, expectedValue, maxHeight = null) {
    // CALL
    let retVal = belowLoc.isBelow(aboveLoc, maxHeight);

    // ASSERT
    expect(retVal).toBe(expectedValue);
};

it ("isBelow works - simple case", () => {
    testIsBelow(new Location(0, 1), new Location(0, 0), true);
});

it ("isBelow works - wrap case", () => {
    testIsBelow(new Location(0, 0), new Location(0, 2), true, 3);
});

it ("isBelow works - wrong case", () => {
    testIsBelow(new Location(2, 0), new Location(0, 0), false);
});

it ("isBelow works - wrong case 2", () => {
    testIsBelow(new Location(0, 1), new Location(1, 0), false);
});
