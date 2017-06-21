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
    let toCheck = NeuralNetwork.createNodes([2, 1], false, ActivationFunctions.sigmoid, 1.0);

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
    let output = nn.feedForward([input]);

    // ASSERT
    expect(output !== null).toBe(true);
    expect(output.length === 1).toBe(true);
    expect(output[0].length === 1).toBe(true);
    expect(output[0][0]).toBeCloseTo(0.69);
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
    let output = nn.feedForward([input]);
    let expectedOutput = [[0.5]];
    let oldError = (expectedOutput[0][0] - output[0][0]);

    // CALL
    nn.backPropagate(expectedOutput);
    let newOutput = nn.feedForward([input]);
    let newError = (expectedOutput[0][0] - newOutput[0][0]);

    // ASSERT
    expect(Math.abs(oldError) > Math.abs(newError)).toBe(true);

    // These are close enough.  They don't exactly match the paper
    // because the error metric we calculated has more precision
    // than the paper (so hopefully this is more accurate).
    expect(oldError).toBeCloseTo(-0.19);
    expect(newError).toBeCloseTo(-0.182);
});

it ("convergence test", () => {
    // SETUP
    let nn = new NeuralNetwork([2, 1], false, ActivationFunctions.sigmoid, 1.0);
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
    let expectedOutput = [[0.5]];
    let lastOutput = null;

    // CALL
    for (let i = 0; i < 100; i++) {
        lastOutput = nn.feedForward([input]);
        nn.backPropagate(expectedOutput);
    }

    // ASSERT
    let error = Math.abs(expectedOutput[0][0] - lastOutput[0][0]);
    expect(error).toBeLessThan(0.001);
});

const convergenceTestWithBiasTerm = function (nn) {
    nn.setWeights([
        [
            [0.1, 0.8, 0.01],
            [0.4, 0.6, 0.01]
        ], // LAYER 0
        [
            [0.3, 0.9, 0.01]
        ] // LAYER 1
    ]);
    let input = [[0.35, 0.9]];
    let expectedOutput = [[0.5]];
    let lastOutput = null;

    // CALL
    for (let i = 0; i < 100; i++) {
        lastOutput = nn.feedForward(input);
        nn.backPropagate(expectedOutput);
    }

    // ASSERT
    let error = Math.abs(expectedOutput[0][0] - lastOutput[0][0]);
    // console.log(`error = ${error}`);
    expect(error).toBeLessThan(0.001);

    nn.iterateOverNodes(function (node) {
        expect(node.weights.length).toBeGreaterThan(2);
        let biasWeight = node.weights[node.weights.length - 1];
        expect(biasWeight !== 0.01).toBe(true);
        // console.log(`biasWeight = ${biasWeight}`);
    });
};

it ("convergence test with bias term", () => {
    // SETUP
    let nn = new NeuralNetwork([2, 1], true, ActivationFunctions.sigmoid, 1.0);

    convergenceTestWithBiasTerm(nn);
});

it ("convergence test with bias term with tanh", () => {
    // SETUP
    let nn = new NeuralNetwork([2, 1], true, ActivationFunctions.tanh, 1.0);

    convergenceTestWithBiasTerm(nn);
});