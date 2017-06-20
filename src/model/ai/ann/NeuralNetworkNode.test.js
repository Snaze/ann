import NeuralNetworkNode from "./NeuralNetworkNode";
import ActivationFunctions from "./ActivationFunctions";

it ("feedForward works", () => {
    // SETUP
    let nnn = new NeuralNetworkNode(2, false, ActivationFunctions.sigmoid);
    nnn.weights[0] = 0.1;
    nnn.weights[1] = 0.8;

    // CALL
    let value = nnn.feedForward([0.35, 0.9]);

    // ASSERT
    expect(Math.floor(value * 100) / 100).toBe(0.68);
});

it ("backPropagateOutputNode works", () => {
    // SETUP
    let nnn = new NeuralNetworkNode(2, false, ActivationFunctions.sigmoid);
    nnn.weights[0] = 0.3;
    nnn.weights[1] = 0.9;
    let nodeValues = [0.68, 0.6637];
    let value = nnn.feedForward(nodeValues);
    expect(Math.round(value * 100) / 100).toBe(0.69);

    // CALL
    let error = nnn.backPropagateOutputNode(0.5);

    // ASSERT
    expect(Math.ceil(error * 10e3) / 10e3).toBe(-0.0406); // ceil because negative

    // Odd but paper says 0.272392 --> the error is more precise than what the paper used.
    expect(Math.floor(nnn.weights[0] * 10e6) / 10e6).toBe(0.2723391);
    // paper says 0.87305 --> I assume this is because we are using the full precision of the error
    expect(Math.floor(nnn.weights[1] * 10e6) / 10e6).toBe(0.8730022);
});

it ("backPropagateHiddenNode works", () => {
    // SETUP
    let nnn = new NeuralNetworkNode(2, false, ActivationFunctions.sigmoid);
    nnn.weights[0] = 0.1;
    nnn.weights[1] = 0.8;
    let nodeValues = [0.35, 0.9];
    let value = nnn.feedForward(nodeValues);
    expect(Math.round(value * 100) / 100).toBe(0.68);

    // CALL
    let error = nnn.backPropagateHiddenNode([-0.0406], [0.272392], nodeValues);

    // ASSERT
    expect(Math.floor(error * 10e5) / 10e5).toBe(-2.406e-3);

    expect(Math.ceil(nnn.weights[0] * 10e4) / 10e4).toBe(0.09916);
    expect(Math.floor(nnn.weights[1] * 10e3) / 10e3).toBe(0.7978);
});