import NeuralNetworkNode from "./NeuralNetworkNode";
import ActivationFunctions from "./ActivationFunctions";
import EdgeStore from "./EdgeStore";
import LearningRate from "./LearningRate";

it ("feedForward works", () => {
    // SETUP
    let nnn = new NeuralNetworkNode(2, 0, new EdgeStore([2, 2, 1], false, ActivationFunctions.sigmoid),
        2, 2, false, ActivationFunctions.sigmoid);
    nnn.weights = [0.1, 0.8];

    // CALL
    let value = nnn.feedForward([[0.35, 0.9]]);

    // ASSERT
    expect(Math.floor(value[0] * 100) / 100).toBe(0.68);
});

it ("backPropagateOutputNode works", () => {
    // SETUP
    let nnn = new NeuralNetworkNode(2, 0, new EdgeStore([2, 2, 1], false, ActivationFunctions.sigmoid),
        2, 2, false, ActivationFunctions.sigmoid);
    nnn.weights = [0.3, 0.9]
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
    let nnn = new NeuralNetworkNode(1, 0, new EdgeStore([2, 2, 1], false, ActivationFunctions.sigmoid),
        2, 2, false, ActivationFunctions.sigmoid);
    nnn.weights = [0.1, 0.8];
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

const testFeedForward = function (weights, inputs, output) {
    // SETUP
    let nnn = new NeuralNetworkNode(1, 0, new EdgeStore([2, 2, 1], true, ActivationFunctions.sigmoid),
        2, 2, true, ActivationFunctions.sigmoid);
    nnn.weights = weights;

    // CALL
    let forwardPass = nnn.feedForward([inputs]);

    // ASSERT
    expect(forwardPass[0]).toBeCloseTo(output);

    return forwardPass;
};

it ("test forwardPropagation again - node 1", () => {
    let weights = [0.15, 0.2, 0.35];
    let inputs = [0.05, 0.1, 1.0];
    let expectedResult = 0.593269992;

    testFeedForward(weights, inputs, expectedResult);
});

it ("test forwardPropagation again - node 2", () => {
    let weights = [0.25, 0.3, 0.35];
    let inputs = [0.05, 0.1, 1.0];
    let expectedResult = 0.596884378;

    testFeedForward(weights, inputs, expectedResult);

});

it ("test forwardPropagation again - out 1", () => {
    let weights = [0.4, 0.45, 0.6];
    let inputs = [0.593269992, 0.596884378, 1.0];
    let expectedResult = 0.75136;

    let output = testFeedForward(weights, inputs, expectedResult);
    let error = NeuralNetworkNode.calculateError(0.01, output[0]);
    expect(error).toBeCloseTo(0.2748, 3);
});

it ("test forwardPropagation again - out 2", () => {
    let weights = [0.5, 0.55, 0.6];
    let inputs = [0.593269992, 0.596884378, 1.0];
    let expectedResult = 0.77292;

    let output = testFeedForward(weights, inputs, expectedResult);
    let error = NeuralNetworkNode.calculateError(0.99, output[0]);
    expect(error).toBeCloseTo(0.0235, 3);
});

const testBackPropOutput = function (oldWeights, learningRate, inputs, expectedOutput, newWeights) {
    // SETUP
    let nnn = new NeuralNetworkNode(2, 0, new EdgeStore([2, 2, 1], true, ActivationFunctions.sigmoid),
        2, 2, true, ActivationFunctions.sigmoid);
    nnn.weights = oldWeights;
    nnn.learningRate = new LearningRate(learningRate, 0.01, 100);
    nnn.feedForward([inputs]);

    // CALL
    let toRet = nnn.backPropagateOutputNode([expectedOutput]);

    // ASSERT
    newWeights.forEach(function (weightValue, weightIndex) {
        expect(nnn.weights[weightIndex]).toBeCloseTo(weightValue, 6);
    });

    return toRet;
};

const backPropOut1 = function () {
    return testBackPropOutput([0.4, 0.45, 0.6], 0.5, [0.593269992, 0.596884378, 1.0], 0.01, [0.35891648, 0.408666186]);
};

const backPropOut2 = function () {
    return testBackPropOutput([0.5, 0.55, 0.6], 0.5, [0.593269992, 0.596884378, 1.0], 0.99, [0.511301270, 0.561370121]);
};

it ("test backPropagation - out 1", () => {
    backPropOut1();
});

it ("test backPropagation - out 2", () => {
    backPropOut2();
});

const testBackPropHidden = function (oldWeights, learningRate,
                                     inputs, nextLayersErrors,
                                     outgoingWeights, newWeights) {
    // SETUP
    let nnn = new NeuralNetworkNode(1, 0, new EdgeStore([2, 2, 1], true, ActivationFunctions.sigmoid),
        2, 2, true, ActivationFunctions.sigmoid);
    nnn.weights = oldWeights;
    nnn.learningRate = new LearningRate(learningRate, 0.01, 100);
    nnn.feedForward([inputs]);

    // CALL
    nnn.backPropagateHiddenNode([nextLayersErrors], outgoingWeights);

    // ASSERT
    newWeights.forEach(function (weightValue, weightIndex) {
        expect(nnn.weights[weightIndex]).toBeCloseTo(weightValue, 6);
    });
};

it ("test backPropagation - hidden 1", () => {
    let error1 = backPropOut1();
    let error2 = backPropOut2();
    let nextLayersErrors = [error1[0], error2[0]];
    let outgoingWeights = [0.40, 0.50];
    let newWeights = [0.149780716, 0.19956143];

    testBackPropHidden([0.15, 0.2, 0.35], 0.5, [0.05, 0.1, 1.0], nextLayersErrors, outgoingWeights, newWeights);
});

it ("test backPropagation - hidden 2", () => {
    let error1 = backPropOut1();
    let error2 = backPropOut2();
    let nextLayersErrors = [error1[0], error2[0]];
    let outgoingWeights = [0.45, 0.55];
    let newWeights = [0.24975114, 0.29950229];

    testBackPropHidden([0.25, 0.3, 0.35], 0.5, [0.05, 0.1, 1.0], nextLayersErrors, outgoingWeights, newWeights);
});