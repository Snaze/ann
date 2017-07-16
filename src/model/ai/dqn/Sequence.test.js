import Sequence from "./Sequence";
import ArrayUtils from "../../../utils/ArrayUtils";

it ("constructor", () => {
    let toCheck = new Sequence();

    expect(toCheck !== null).toBe(true);
});

it ("append", () => {
    // SETUP
    let toCheck = new Sequence([1]);

    // CALL
    toCheck.append(0, [2]);

    // ASSERT
    expect(toCheck.states.length).toBe(2);
    expect(ArrayUtils.arrayEquals(toCheck.states[0], [1])).toBe(true);
    expect(ArrayUtils.arrayEquals(toCheck.states[1], [2])).toBe(true);
    expect(ArrayUtils.arrayEquals(toCheck.actions, [0])).toBe(true);
});

it ("createPreprocessedState", () => {
    // SETUP
    let toCheck1 = new Sequence([0], 5);
    let toCheck2 = new Sequence([0], 5);
    toCheck2.append(0, [1]);
    let toCheck3 = new Sequence([0], 5);
    toCheck3.append(0, [1]);
    toCheck3.append(1, [2]);
    toCheck3.append(2, [3]);
    toCheck3.append(3, [4]);
    toCheck3.append(4, [5]);
    toCheck3.append(5, [6]);

    // CALL
    let result1 = toCheck1.createPreProcessedSequence();
    let result2 = toCheck2.createPreProcessedSequence();
    let result3 = toCheck3.createPreProcessedSequence();

    // ASSERT
    expect(ArrayUtils.arrayEquals(result1.states[0], [0])).toBe(true);
    expect(ArrayUtils.arrayEquals(result2.states[0], [0])).toBe(true);
    expect(ArrayUtils.arrayEquals(result2.states[1], [1])).toBe(true);
    expect(ArrayUtils.arrayEquals(result2.actions, [0])).toBe(true);
    let states = ArrayUtils.flatten(result3.states);
    let actions = ArrayUtils.flatten(result3.actions);
    expect(ArrayUtils.arrayEquals(states, [2, 3, 4, 5, 6])).toBe(true);
    expect(ArrayUtils.arrayEquals(actions, [2, 3, 4, 5])).toBe(true);

});

it ("clone", () => {
    // SETUP
    let sequence = new Sequence([0]);
    sequence.append(0, [1]);

    // CALL
    let otherSequence = sequence.clone();

    // ASSERT
    expect(otherSequence.states.length).toBe(2);
    expect(otherSequence.states[0][0]).toBe(0);
    expect(otherSequence.states[1][0]).toBe(1);
    expect(otherSequence.actions.length).toBe(1);
    expect(otherSequence.actions[0]).toBe(0);
});

it ("toInput", () => {
    // SETUP
    let sequence = new Sequence([0], 4);
    sequence.append(0, [1]);
    sequence.append(1, [2]);
    sequence.append(2, [3]);
    sequence.append(3, [4]);
    sequence.append(4, [5]);
    sequence = sequence.createPreProcessedSequence();

    // CALL
    let input = sequence.toInput();

    // ASSERT
    expect(ArrayUtils.arrayEquals([2, 3, 4, 5], input)).toBe(true);
});

it ("toInput on undersized Sequence", () => {
    // SETUP
    let sequence = new Sequence([1], 4);

    // CALL
    let input = sequence.toInput();

    // ASSERT
    expect(ArrayUtils.arrayEquals([0, 0, 0, 1], input)).toBe(true);
});

it ("toKey", () => {
    // SETUP
    let sequence = new Sequence([1], 4);

    // CALL
    let key = sequence.toKey();

    // ASSERT
    expect(key).toBe("0001");
});