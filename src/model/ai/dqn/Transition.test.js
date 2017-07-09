import Transition from "./Transition";

it ("constructor", () => {
    let toCheck = new Transition(null, 1, 1, null, 1);

    expect(toCheck !== null).toBe(true);
});