import Adam from "./Adam";
import vectorious from "../../../../../../node_modules/vectorious/vectorious";

it ("constructor", () => {
    let instance = new Adam();

    expect(instance !== null).toBe(true);
});

it ("getWeightDeltas", () => {
    // SETUP
    let instance = new Adam();
    let currentGradient = new vectorious.Matrix([
        [0.1, 0.2, 0.3],
        [0.1, 0.2, 0.3],
        [0.1, 0.2, 0.3]
    ]);
    let learningRate = 0.03;

    // CALL
    let result = instance.getWeightDeltas(currentGradient, learningRate);

    // ASSERT
    expect(result !== null).toBe(true);
});