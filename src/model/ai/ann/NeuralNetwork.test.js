import NeuralNetwork from "./NeuralNetwork";
import ActivationFunctions from "./ActivationFunctions";
import NeuralNetworkParameter from "./NeuralNetworkParameter";
import ArrayUtils from "../../../utils/ArrayUtils";

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

it ("feedforward test 2", () => {
    // SETUP
    let nn = new NeuralNetwork([2, 2], true, ActivationFunctions.sigmoid);
    nn.setWeights([
        [
            [0.15, 0.2, 0.35],
            [0.25, 0.3, 0.35]
        ], // LAYER 0
        [
            [0.4, 0.45, 0.6],
            [0.5, 0.55, 0.6]
        ] // LAYER 1
    ]);
    let input = [0.05, 0.1, 1.0];

    // CALL
    let output = nn.feedForward([input]);

    // ASSERT
    expect(output !== null).toBe(true);
    expect(output.length === 1).toBe(true);
    expect(output[0].length === 2).toBe(true);
    expect(output[0][0]).toBeCloseTo(0.75136);
    expect(output[0][1]).toBeCloseTo(0.77292);
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


it ("backPropagate test 2", () => {
    // SETUP
    let nn = new NeuralNetwork([2, 2], true, ActivationFunctions.sigmoid, 0.5);
    nn.setWeights([
        [
            [0.15, 0.2, 0.35],
            [0.25, 0.3, 0.35]
        ], // LAYER 0
        [
            [0.4, 0.45, 0.6],
            [0.5, 0.55, 0.6]
        ] // LAYER 1
    ]);
    let input = [0.05, 0.1, 1.0];
    let output = nn.feedForward([input]);
    expect(output !== null).toBe(true);
    expect(output.length === 1).toBe(true);
    expect(output[0].length === 2).toBe(true);
    expect(output[0][0]).toBeCloseTo(0.75136);
    expect(output[0][1]).toBeCloseTo(0.77292);

    let expectedOutput = [[0.01, 0.99]];
    let destWeights = [
        [
            [0.149780716, 0.19956143],
            [0.24975114, 0.29950229]
        ],
        [
            [0.35891648, 0.408666186],
            [0.511301270, 0.561370121],
        ]
    ];

    // CALL
    nn.backPropagate(expectedOutput);

    // ASSERT
    let newWeights = nn.getWeights();
    for (let layerIndex = 0; layerIndex < destWeights.length; layerIndex++) {
        let layer = destWeights[layerIndex];

        for (let nodeIndex = 0; nodeIndex < layer.length; nodeIndex++) {
            let node = layer[nodeIndex];

            for (let weightIndex = 0; weightIndex < node.length; weightIndex++) {
                // console.log(`layerIndex = ${layerIndex}`);
                // console.log(`nodeIndex = ${nodeIndex}`);
                // console.log(`weightIndex = ${weightIndex}`);

                let newWeight = newWeights[layerIndex][nodeIndex][weightIndex];
                let destWeight = destWeights[layerIndex][nodeIndex][weightIndex];
                expect(newWeight).toBeCloseTo(destWeight, 8);
            }
        }
    }

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

it ("train works", () => {
    jest.useFakeTimers();

    // SETUP
    let nn = new NeuralNetwork([2, 1]);
    let input = []; // [0.35, 0.9]
    let expectedOutput = []; // [0.5]
    let maxEpochs = 1000;
    let error = 1e-3;

    for (let i = 0; i < 1000; i++) {
        input.push([0.35, 0.9]);
        expectedOutput.push([0.5]);
    }

    let numEpochs = 0;
    const epochCompleteCallback = function () {
        numEpochs++;
    };

    let trainingFinished = false;
    const trainingFinishedCallback = function () {
        trainingFinished = true;
    };
    let nnp = new NeuralNetworkParameter();
    nnp.inputs = input;
    nnp.expectedOutputs = expectedOutput;
    nnp.miniBatchSize = 10;
    nnp.normalizeInputs = false;
    nnp.maxEpochs = maxEpochs;
    nnp.minError = error;
    nnp.minWeightDelta = null;
    nnp.cacheMinError = false;
    nnp.epochCompleteCallback = epochCompleteCallback;
    nnp.finishedTrainingCallback = trainingFinishedCallback;

    // CALL
    let maxError = nn.train(nnp);

    jest.runAllTimers();

    let result = nn.feedForward([[0.35, 0.9]]);

    // ASSERT
    if (nn.epochs < maxEpochs) {
        expect(maxError).toBeCloseTo(1e-3);
    }

    expect(result[0][0]).toBeCloseTo(0.5, 2);
    expect(trainingFinished).toBe(true);
    expect(numEpochs > 0).toBe(true);

    jest.useRealTimers();
});

const reluTest = function () {
    // SETUP
    let nn = new NeuralNetwork([3, 2], false, ActivationFunctions.relu, 1.0, 2);
    nn.setWeights([
        [
            [0.25, 0.1],
            [-0.25, -0.1],
            [0.5, 0.5]
        ], // LAYER 0
        [
            [0.5, 0.3, 0.5],
            [0.4, -0.4, -0.3]
        ] // LAYER 1
    ]);
    let input = [-5, -5];
    let expectedOutput = [[0.525, 0.0]];
    let lastOutput = null;

    // CALL
    lastOutput = nn.feedForward([input]);

    // ASSERT
    expect(lastOutput[0][0]).toBeCloseTo(expectedOutput[0][0]);
    expect(lastOutput[0][1]).toBeCloseTo(expectedOutput[0][1]);

    return nn;
};

it ("relu feedForward test", () => {
    reluTest();
});

it ("relu backprop test", () => {
    let nn = reluTest();

    // CALL
    nn.backPropagate([[1, 0]]);

    // ASSERT
    let weightsShouldEqual = [
        [
            [0.25, 0.1],
            [-0.9625, -0.8125],
            [0.5, 0.5]
        ], // LAYER 0
        [
            [0.5, 1.13125, 0.5],
            [0.4, -0.4, -0.3]
        ] // LAYER 1
    ];
    let weights = nn.getWeights();

    let flattenedWeights = ArrayUtils.flatten(weights);
    let flattenedShouldEqualWeights = ArrayUtils.flatten(weightsShouldEqual);

    console.log(flattenedWeights);
    console.log(flattenedShouldEqualWeights);

    expect(ArrayUtils.arrayApproxEquals(flattenedWeights, flattenedShouldEqualWeights)).toBe(true);



});