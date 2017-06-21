import NeuralNetworkNode from "./NeuralNetworkNode";
import ActivationFunctions from "./ActivationFunctions";

it ("feedForward works", () => {
    // SETUP
    let nnn = new NeuralNetworkNode(2, false, ActivationFunctions.sigmoid);
    nnn.weights[0] = 0.1;
    nnn.weights[1] = 0.8;

    // CALL
    let value = nnn.feedForward([[0.35, 0.9]]);

    // ASSERT
    expect(Math.floor(value[0] * 100) / 100).toBe(0.68);
});

it ("backPropagateOutputNode works", () => {
    // SETUP
    let nnn = new NeuralNetworkNode(2, false, ActivationFunctions.sigmoid);
    nnn.weights[0] = 0.3;
    nnn.weights[1] = 0.9;
    let nodeValues = [[0.68, 0.6637]];
    let values = nnn.feedForward(nodeValues);
    expect(values[0]).toBeCloseTo(0.69);

    // CALL
    let error = nnn.backPropagateOutputNode([0.5]);

    // ASSERT
    expect(error[0]).toBeCloseTo(-0.0406, 3); // ceil because negative

    // Odd but paper says 0.272392 --> the error is more precise than what the paper used.
    expect(nnn.weights[0]).toBeCloseTo(0.2723391, 6);
    // paper says 0.87305 --> I assume this is because we are using the full precision of the error
    expect(nnn.weights[1]).toBeCloseTo(0.8730022, 6);
});

it ("backPropagateHiddenNode works", () => {
    // SETUP
    let nnn = new NeuralNetworkNode(2, false, ActivationFunctions.sigmoid);
    nnn.weights[0] = 0.1;
    nnn.weights[1] = 0.8;
    let nodeValues = [0.35, 0.9];
    let value = nnn.feedForward([nodeValues]);
    expect(value[0]).toBeCloseTo(0.68);

    // CALL
    let error = nnn.backPropagateHiddenNode([[-0.0406]], [0.272392]);

    // ASSERT
    expect(error[0]).toBeCloseTo(-2.406e-3, 3);

    expect(nnn.weights[0]).toBeCloseTo(0.09916, 5);
    expect(nnn.weights[1]).toBeCloseTo(0.7978, 4);
});