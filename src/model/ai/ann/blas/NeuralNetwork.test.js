import NeuralNetwork from "./NeuralNetwork";
import Normalizer from "../Normalizer";
import WeightInitializer from "../WeightInitializer";
import ActivationFunctions from "../ActivationFunctions";
import LearningRate from "../LearningRate";
import Layer from "./Layer";
import { Matrix } from "vectorious";
import ArrayUtils from "../../../../utils/ArrayUtils";

const createTestNetwork = function (activationFunction=ActivationFunctions.lrelu, startLearningRate=0.03,
                                    nodesPerLayer=[2, 2]) {
    let normalizer = new Normalizer(activationFunction);
    let weightInitializer = new WeightInitializer(activationFunction, WeightInitializer.COMPRESSED_NORMAL);
    let learningRate = new LearningRate(startLearningRate, 0.001, 1000);

    let toRet = new NeuralNetwork(normalizer, weightInitializer, false);

    nodesPerLayer.forEach(function (numNodes) {
        toRet.addLayer(new Layer(numNodes, activationFunction, learningRate));
    });

    return toRet;
};

it ("constructor", () => {
    let instance = new NeuralNetwork();

    expect(instance !== null).toBe(true);
});

it ("_createWeights", () => {
    // SETUP
    let instance = createTestNetwork();

    // CALL
    let theWeights = instance._createWeights();

    // ASSERT
    expect(theWeights.length).toBe(2);
    expect(theWeights[0] === null).toBe(true);
    expect(theWeights[1]).toBeInstanceOf(Matrix);
    expect(ArrayUtils.arrayEquals(theWeights[1].shape, [2, 2])).toBe(true);
    expect(Number.isFinite(theWeights[1].get(0, 0))).toBe(true);
    expect(Number.isFinite(theWeights[1].get(0, 1))).toBe(true);
    expect(Number.isFinite(theWeights[1].get(1, 0))).toBe(true);
    expect(Number.isFinite(theWeights[1].get(1, 1))).toBe(true);
});

it ("feedforward test", () => {
    // SETUP
    let nn = createTestNetwork(ActivationFunctions.sigmoid, 1.0, [2, 2, 1]);
    nn.weights = [
        null,
        [
            [0.1, 0.4],
            [0.8, 0.6]
        ], // LAYER 0
        [
            [0.3],
            [0.9]
        ] // LAYER 1
    ];
    let input = [0.35, 0.9];

    // CALL
    let output = nn.feedForward([input]);

    // ASSERT
    expect(output !== null).toBe(true);
    expect(output[0][0]).toBeCloseTo(0.69);
});

it ("backprop test", () => {
    // SETUP
    let nn = createTestNetwork(ActivationFunctions.sigmoid, 1.0, [2, 2, 1]);
    nn.weights = [
        null,
        [
            [0.1, 0.4],
            [0.8, 0.6]
        ], // LAYER 0
        [
            [0.3],
            [0.9]
        ] // LAYER 1
    ];
    let input = [0.35, 0.9];

    let output = nn.feedForward([input]);

    expect(output !== null).toBe(true);
    expect(output[0][0]).toBeCloseTo(0.69);
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

// it ("includeBias test", () => {
//     // SETUP
//     let nn = createTestNetwork(ActivationFunctions.sigmoid, 1.0, [2, 2, 1]);
//     nn.includeBias = true;
//     let input = [0.35, 0.9];
//
//     let output = nn.feedForward([input]);
//
//     expect(output !== null).toBe(true);
//     // expect(output[0][0]).toBeCloseTo(0.69);
//     let expectedOutput = [[0.5]];
//     let oldError = (expectedOutput[0][0] - output[0][0]);
//
//     // CALL
//     nn.backPropagate(expectedOutput);
//     let newOutput = nn.feedForward([input]);
//     let newError = (expectedOutput[0][0] - newOutput[0][0]);
//
//     // ASSERT
//     expect(Math.abs(oldError) > Math.abs(newError)).toBe(true);
//
//     // These are close enough.  They don't exactly match the paper
//     // because the error metric we calculated has more precision
//     // than the paper (so hopefully this is more accurate).
//     // expect(oldError).toBeCloseTo(-0.19);
//     // expect(newError).toBeCloseTo(-0.182);
// });