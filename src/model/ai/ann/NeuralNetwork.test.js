import NeuralNetwork from "./NeuralNetwork";
import ActivationFunctions from "./ActivationFunctions";

it ("NeuralNetork constructor works", () => {
    // CALL
    let nn = new NeuralNetwork([2, 1], true, ActivationFunctions.sigmoid);

    // ASSERT
    expect(nn !== null).toBe(true);
});

it ("createNodes works", () => {
    // SETUP

    // CALL
    let toCheck = NeuralNetwork.createNodes([2, 1], false, ActivationFunctions.sigmoid);

    // ASSERT
    expect(toCheck.length).toBe(2);
    expect(toCheck[0].length).toBe(2);
    expect(toCheck[1].length).toBe(1);

    expect(toCheck[0][0].weights.length).toBe(2);
    expect(toCheck[0][1].weights.length).toBe(2);

    expect(toCheck[1][0].weights.length).toBe(2);
});

it ("feedforward test", () => {
    // SETUP
    let nn = new NeuralNetwork([2, 1], false, ActivationFunctions.sigmoid);
    nn.setWeights([
        [
            [0.1, 0.8],
            [0.4, 0.6]
        ], // LAYER 0
        [
            [0.3, 0.9]
        ] // LAYER 1
    ]);
    let input = [0.35, 0.9];

    // CALL
    let output = nn.feedForward(input);

    // ASSERT
    expect(output !== null).toBe(true);
    expect(output.length === 1).toBe(true);
    expect(Math.floor(output[0] * 100.0) / 100.0).toBe(0.69);
});

it ("backpropagate test", () => {
    // SETUP
    let nn = new NeuralNetwork([2, 1], false, ActivationFunctions.sigmoid);
    nn.setWeights([
        [
            [0.1, 0.8],
            [0.4, 0.6]
        ], // LAYER 0
        [
            [0.3, 0.9]
        ] // LAYER 1
    ]);
    let input = [0.35, 0.9];
    let output = nn.feedForward(input);
    let expectedOutput = [0.5];
    let oldError = (expectedOutput[0] - output[0]);

    // CALL
    nn.backPropagate(expectedOutput);
    let newOutput = nn.feedForward(input);
    let newError = (expectedOutput[0] - newOutput[0]);

    // ASSERT
    expect(Math.abs(oldError) > Math.abs(newError)).toBe(true);

    // These are close enough.  They don't exactly match the paper
    // because the error metric we calculated has more precision
    // than the paper (so hopefully this is more accurate).
    expect(Math.ceil(oldError * 100) / 100).toBe(-0.19);
    expect(Math.ceil(newError * 1000) / 1000).toBe(-0.182);
});