import ReplayMemory from "./ReplayMemory";
import ArrayUtils from "../../../utils/ArrayUtils";

it ("constructor", () => {
    let test = new ReplayMemory();
    expect(test !== null).toBe(true);
});

it ("store", () => {
    // SETUP
    let toCheck = new ReplayMemory(2);

    // CALL and ASSERT
    toCheck.store(0);
    toCheck.store(1);
    toCheck.store(2);

    // ASSERT
    expect(toCheck.index).toBe(1);
    expect(toCheck.maxIndex).toBe(2);
    expect(ArrayUtils.arrayEquals(toCheck._data, [2, 1])).toBe(true);
});

it ("sample random minibatch 1", () => {
    // SETUP
    let toCheck = new ReplayMemory(2);
    toCheck.store(0);
    toCheck.store(1);

    // CALL
    let result = toCheck.sampleRandomMinibatch(10);

    // ASSERT
    expect(ArrayUtils.isIn(result, 0)).toBe(true);
    expect(ArrayUtils.isIn(result, 1)).toBe(true);
    expect(result.length).toBe(10);
});

it ("sample random minibatch 2", () => {
    // SETUP
    let toCheck = new ReplayMemory(1000);
    toCheck.store(0);
    toCheck.store(1);

    // CALL
    let result = toCheck.sampleRandomMinibatch(10);

    // ASSERT
    expect(ArrayUtils.isIn(result, 0)).toBe(true);
    expect(ArrayUtils.isIn(result, 1)).toBe(true);
    expect(result.length).toBe(10);
});

// it ("sample random minibatch - normal scenario", () => {
//     // SETUP
//     let toCheck = new ReplayMemory(5);
//     toCheck.store(0);
//     toCheck.store(1);
//
//     // CALL
//     let result = toCheck.sampleRandomMinibatch(10);
//
//     // ASSERT
//     expect(ArrayUtils.isIn(result, 0)).toBe(true);
//     expect(ArrayUtils.isIn(result, 1)).toBe(true);
//     expect(result.length).toBe(2);
// });