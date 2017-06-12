import BinaryMatrix from "./BinaryMatrix";
import Location from "../Location";
import _ from "../../../node_modules/lodash/lodash";

it ("test Constructor works", () => {
    // SETUP
    let toSet = [];
    toSet[0] = [];
    toSet[1] = [];
    toSet[0][0] = "000000000";
    toSet[0][1] = "000000001";
    toSet[1][0] = "000000010";
    toSet[1][1] = "000000011";

    // CALL
    let toCheck = new BinaryMatrix(toSet);

    // ASSERT
    expect(toCheck !== null).toBe(true);
});

it ("test createNumericMatrix", () => {
    // SETUP
    let toConvert = [];
    toConvert[0] = [];
    toConvert[1] = [];
    toConvert[0][0] = "000000000";
    toConvert[0][1] = "000000001";
    toConvert[1][0] = "000000010";
    toConvert[1][1] = "000000011";
    toConvert = _.flattenDeep(toConvert);

    // CALL
    let toCheck = BinaryMatrix.createNumericMatrix(toConvert);

    // ASSERT
    expect(toCheck[0]).toBe(0);
    expect(toCheck[1]).toBe(1);
    expect(toCheck[2]).toBe(2);
    expect(toCheck[3]).toBe(3);
});

it ("test getIndex(x, y)", () => {
    // SETUP
    let toConvert = [];
    toConvert[0] = [];
    toConvert[1] = [];
    toConvert[0][0] = "000000000";
    toConvert[0][1] = "000000001";
    toConvert[1][0] = "000000010";
    toConvert[1][1] = "000000011";
    let toTest = new BinaryMatrix(toConvert, 2);

    // CALL
    let theIndex = toTest.getIndex(1, 1);

    // ASSERT
    expect(toTest.getBinaryValue(1, 1)).toBe("000000011");

});

it ("test getDecimalValue", () => {
    // SETUP
    let toConvert = [];
    toConvert[0] = [];
    toConvert[1] = [];
    toConvert[0][0] = "000000000";
    toConvert[0][1] = "000000001";
    toConvert[1][0] = "000000010";
    toConvert[1][1] = "000000011";
    let toTest = new BinaryMatrix(toConvert, 2);

    // CALL
    let theIndex = toTest.getIndex(1, 1);

    // ASSERT
    expect(toTest.getDecimalValue(1, 1)).toBe(3);

});

it ("test setBinaryValueAtLocation", () => {
    // SETUP
    let toSet = [];
    toSet[0] = [];
    toSet[1] = [];
    toSet[0][0] = "000000000";
    toSet[0][1] = "000000000";
    toSet[1][0] = "000000000";
    toSet[1][1] = "000000000";
    let binaryMatrix = new BinaryMatrix(toSet);
    let location_0_0 = new Location(0, 0);
    let location_0_1 = new Location(0, 1);

    // CALL and ASSERT
    binaryMatrix.setBinaryValueAtLocation("powerUp", location_0_0, 8, "1");

    expect(binaryMatrix.getDecimalValue(location_0_0.x, location_0_0.y)).toBe(1);
    expect(binaryMatrix.getBinaryValue(location_0_0.x, location_0_0.y)).toBe("000000001");

    // CALL and ASSERT
    binaryMatrix.setBinaryValueAtLocation("powerUp", location_0_1, 8, "1");

    expect(binaryMatrix.getDecimalValue(location_0_0.x, location_0_0.y)).toBe(0);
    expect(binaryMatrix.getBinaryValue(location_0_0.x, location_0_0.y)).toBe("000000000");
    expect(binaryMatrix.getDecimalValue(location_0_1.x, location_0_1.y)).toBe(1);
    expect(binaryMatrix.getBinaryValue(location_0_1.x, location_0_1.y)).toBe("000000001");

});

it ("test setBinaryHeaderValue", () => {
    // SETUP
    let toSet = [];
    toSet[0] = [];
    toSet[1] = [];
    toSet[0][0] = "000000000";
    toSet[0][1] = "000000000";
    toSet[1][0] = "000000000";
    toSet[1][1] = "000000000";
    let binaryMatrix = new BinaryMatrix(toSet, 1);

    // CALL
    binaryMatrix.setBinaryHeaderValue(0, "11");

    // ASSERT
    expect(binaryMatrix.numMatrix[0]).toBe(3);

});