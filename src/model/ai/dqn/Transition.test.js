import Transition from "./Transition";
import Sequence from "./Sequence";

it ("constructor", () => {
    let toCheck = new Transition(null, 1, 1, null, 1);

    expect(toCheck !== null).toBe(true);
});

it ("toKey", () => {
    let sequence1 = new Sequence([1], 4);
    let sequence2 = new Sequence([1], 4);
    sequence2.append(1, [2]);
    let reward = 1;
    let action = 1;
    let transition = new Transition(sequence1, action, reward, sequence2, 1, 0);

    // CALL
    let key = transition.toKey();

    // ASSERT
    expect(key).toBe("0001_0012_1_1");

});