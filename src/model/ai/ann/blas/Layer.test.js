import Layer from "./Layer";
import LearningRate from "../LearningRate";
import ActivationFunctions from "../ActivationFunctions";
import {Matrix} from "vectorious";
import ArrayUtils from "../../../../utils/ArrayUtils";
import ADAM from "./backprop/Adam";

const createLayer = function (numNodes = 3) {
    return new Layer(numNodes, ActivationFunctions.lrelu, new LearningRate(0.03, 0.001, 10000));
};

it ("constructor", () => {
   let instance = new Layer();

   expect(instance !== null).toBe(true);
});

it ("feedForward input layer", () => {
    // SETUP
    let instance = createLayer(1);
    let inputWeights = null;
    let miniBatch = new Matrix([[0.5], [0.3], [0.8]]);

    // CALL
    let result = instance.feedForward(inputWeights, miniBatch);

    // ASSERT
    expect(result).toBe(miniBatch);
});

it ("feedForward input layer with bias", () => {
    // SETUP
    let instance = createLayer(1);
    instance.hasBias = true;
    let inputWeights = null;
    let miniBatch = new Matrix([[0.5, 1.0], [0.3, 1.0], [0.8, 1.0]]);

    // CALL
    let result = instance.feedForward(inputWeights, miniBatch);

    // ASSERT
    expect(result).toBe(miniBatch);
});

it ("feedForward non-input layer", () => {
    // SETUP
    let instance = createLayer(3);
    let inputWeights = new Matrix([
        [1, 1, 1],
        [0.5, 0.5, 0.5],
        [0, 0, 0]
    ]);
    let miniBatch = new Matrix([
        [0.5, 0.3, 0.8],
        [0.5, 0.3, 0.8],
        [0.5, 0.3, 0.8]
    ]);

    // CALL
    let result = instance.feedForward(inputWeights, miniBatch);

    // ASSERT
    expect(ArrayUtils.arrayEquals(result.shape, [3, 3])).toBe(true);
    result.each(function (item) {
        expect(item).toBeCloseTo(0.65);
    });
});

it ("feedForward non-input layer with bias", () => {
    // SETUP
    let instance = createLayer(3);
    instance.hasBias = true;
    let inputWeights = new Matrix([
        [1.0, 1.0, 1.0],
        [0.5, 0.5, 0.5],
        [0.0, 0.0, 0.0],
        [1.0, 1.0, 1.0]
    ]);
    let miniBatch = new Matrix([
        [0.5, 0.3, 0.8, 1],
        [0.5, 0.3, 0.8, 1],
        [0.5, 0.3, 0.8, 1]
    ]);

    // CALL
    let result = instance.feedForward(inputWeights, miniBatch);

    // ASSERT
    expect(ArrayUtils.arrayEquals(result.shape, [3, 4])).toBe(true);
    result.each(function (item, row, col) {
        if (col <= 2) {
            expect(item).toBeCloseTo(1.65);
        } else {
            expect(item).toBe(1);
        }
    });
});

/**
 * Imagine the layer we are testing is the output layer with 1 nodes.
 */
it ("backprop ouput layer", () => {
    // SETUP

    let instance = new Layer(2, ActivationFunctions.sigmoid, new LearningRate(1.0, 0.001, 100));

    let inputWeights = new Matrix([
        [0.3],
        [0.9]
    ]);
    let outputWeights = null; // output layer
    let nodeValues = new Matrix([[0.68, 0.6637]]);
    let nextLayerErrorsMiniBatch = new Matrix([[0.5]]);
    let values = instance.feedForward(inputWeights, nodeValues);
    expect(values.get(0, 0)).toBeCloseTo(0.69);

    // CALL
    let newInputWeights = instance.backProp(inputWeights, outputWeights, nextLayerErrorsMiniBatch, 0);

    // ASSERT
    expect(instance.errors.get(0, 0)).toBeCloseTo(-0.0406, 3); // ceil because negative

    expect(inputWeights.get(0, 0)).toBeCloseTo(0.3, 6);
    expect(inputWeights.get(1, 0)).toBeCloseTo(0.9, 6);

    expect(newInputWeights.get(0, 0)).toBeCloseTo(0.2723391, 6);
    expect(newInputWeights.get(1, 0)).toBeCloseTo(0.8730022, 6);

});

/**
 * Imagine the layer we are testing is the output layer with 1 nodes.
 */
it ("backprop output layer with bias", () => {
    // SETUP

    let instance = new Layer(2, ActivationFunctions.sigmoid, new LearningRate(1.0, 0.001, 100));
    instance.hasBias = true;
    let inputWeights = new Matrix([
        [0.3, 0.3],
        [0.9, 0.9],
        [1.0, 1.0]
    ]);
    let outputWeights = new Matrix([
        [0.3, 0.3, 0.3],
        [0.6, 0.6, 0.6]
    ]); // output layer
    let inputsMiniBatch = new Matrix([[0.68, 0.6637, 1.0]]);
    let nextLayerErrorsMiniBatch = new Matrix([[0.5, 0.5]]);
    instance.feedForward(inputWeights, inputsMiniBatch);
    // expect(values.get(0, 0)).toBeCloseTo(0.69);

    // CALL
    let newInputWeights = instance.backProp(inputWeights, outputWeights, nextLayerErrorsMiniBatch, 0);

    // ASSERT
    expect(newInputWeights !== null).toBe(true);
    expect(newInputWeights).toBeInstanceOf(Matrix);
    // expect(instance.errors.get(0, 0)).toBeCloseTo(-0.0406, 3); // ceil because negative
    //
    // expect(inputWeights.get(0, 0)).toBeCloseTo(0.3, 6);
    // expect(inputWeights.get(1, 0)).toBeCloseTo(0.9, 6);
    //
    // expect(newInputWeights.get(0, 0)).toBeCloseTo(0.2723391, 6);
    // expect(newInputWeights.get(1, 0)).toBeCloseTo(0.8730022, 6);

});

it ("backprop ouput layer - ADAM", () => {
    // SETUP

    let instance = new Layer(2, ActivationFunctions.sigmoid, new LearningRate(0.03, 0.001, 100), new ADAM());

    let inputWeights = new Matrix([
        [0.3],
        [0.9]
    ]);
    let outputWeights = null; // output layer
    let nodeValues = new Matrix([[0.68, 0.6637]]);
    let nextLayerErrorsMiniBatch = new Matrix([[0.5]]);
    let values = instance.feedForward(inputWeights, nodeValues);
    expect(values.get(0, 0)).toBeCloseTo(0.69);

    // CALL
    let newInputWeights = instance.backProp(inputWeights, outputWeights, nextLayerErrorsMiniBatch, 0);

    // ASSERT
    expect(instance.errors.get(0, 0)).toBeCloseTo(-0.0406, 3); // ceil because negative

    expect(inputWeights.get(0, 0)).toBeCloseTo(0.3, 6);
    expect(inputWeights.get(1, 0)).toBeCloseTo(0.9, 6);

    expect(newInputWeights.get(0, 0)).toBeCloseTo(0.2700000108456688, 6);
    expect(newInputWeights.get(1, 0)).toBeCloseTo(0.8700000111120306, 6);

});

it ("backPropagateHiddenNode works", () => {
    // SETUP
    let instance = new Layer(1, ActivationFunctions.sigmoid, new LearningRate(1.0, 0.001, 100));

    let inputWeights = new Matrix([
        [0.1],
        [0.8]
    ]);
    let outputWeights = new Matrix([
        [0.272392]
    ]); // output layer
    let nodeValues = new Matrix([
        [0.35, 0.9]
    ]);
    let nextLayerErrorsMiniBatch = new Matrix([[-0.0406]]);
    let values = instance.feedForward(inputWeights, nodeValues);
    expect(values.get(0, 0)).toBeCloseTo(0.68);

    // CALL
    let newInputWeights = instance.backProp(inputWeights, outputWeights, nextLayerErrorsMiniBatch, 0);

    // ASSERT
    expect(instance.errors.get(0, 0)).toBeCloseTo(-2.406e-3, 3);

    expect(inputWeights.get(0, 0)).toBeCloseTo(0.1, 5); // I tweaked the precious comparison here
    expect(inputWeights.get(1, 0)).toBeCloseTo(0.8, 4); // I tweaked the precious comparison here

    expect(newInputWeights.get(0, 0)).toBeCloseTo(0.09916, 5); // I tweaked the precious comparison here
    expect(newInputWeights.get(1, 0)).toBeCloseTo(0.7978, 4); // I tweaked the precious comparison here
});

it ("augment output with ones", () => {
    // SETUP
    let instance = new Layer(1, ActivationFunctions.sigmoid, new LearningRate(1.0, 0.001, 100));
    let outputMatrix = Matrix.zeros(2, 1);

    // CALL
    instance.augmentOutputWithOnes(outputMatrix);

    // ASSERT
    expect(ArrayUtils.arrayEquals(outputMatrix.shape, [2, 2])).toBe(true);
    expect(outputMatrix.get(0, 0)).toBe(0);
    expect(outputMatrix.get(1, 0)).toBe(0);
    expect(outputMatrix.get(0, 1)).toBe(1);
    expect(outputMatrix.get(1, 1)).toBe(1);
});