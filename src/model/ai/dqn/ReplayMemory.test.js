import ReplayMemory from "./ReplayMemory";
import ArrayUtils from "../../../utils/ArrayUtils";
import Sequence from "./Sequence";
import Transition from "./Transition";

/**
 * This will create a dummy transition for testing.
 *
 * @param fromArray {Array}
 * @param toArray {Array}
 * @returns {Transition}
 */
const createDummyTransition = function (fromArray, toArray) {
    let sequence1 = new Sequence(fromArray);
    let sequence2 = new Sequence(fromArray);
    sequence2.append(1, toArray);
    let reward = 1;
    let action = 1;
    return new Transition(sequence1, action, reward, sequence2, 1, 0);
};

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

it ("store only unique", () => {
    // SETUP
    let toCheck = new ReplayMemory(2);
    let transition1 = createDummyTransition([1], [2]);
    let transition2 = createDummyTransition([2], [3]);

    // CALL and ASSERT
    toCheck.store(transition1);
    toCheck.store(transition1);
    toCheck.store(transition2);

    // ASSERT
    expect(toCheck._data[0]).toBe(transition1);
    expect(toCheck._data[1]).toBe(transition2);
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