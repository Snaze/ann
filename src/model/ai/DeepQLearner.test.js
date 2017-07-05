import DeepQLearner from "./DeepQLearner";
import ArrayUtils from "../../utils/ArrayUtils";

it ("constructor works", () => {
   let toCheck = new DeepQLearner(10);

   expect(toCheck !== null).toBe(true);
});

it ("createNodesPerLayerArray", () => {
    // SETUP

    // CALL
    let toCheck = DeepQLearner.createNodesPerLayerArray(10000, 4, 30, 3);

    // ASSERT
    expect(ArrayUtils.arrayEquals(toCheck, [32, 32, 32, 32, 14])).toBe(true);
});

it ("createNNInput input", () => {
    // SETUP
    let toCheck = new DeepQLearner(4);
    let trainingVector = [1, 2, 3, 4];
    let action = 0;
    let action2 = 3;

    // CALL
    let nnInput = toCheck.createNNInput(trainingVector, action);
    let nnInput2 = toCheck.createNNInput(trainingVector, action2);

    // ASSERT
    expect(ArrayUtils.arrayEquals(nnInput, [1, 2, 3, 4, -1, -1])).toBe(true);
    expect(ArrayUtils.arrayEquals(nnInput2, [1, 2, 3, 4, 1, 1])).toBe(true);
});

it ("createNNMiniBatchInput input", () => {
    // SETUP
    let toCheck = new DeepQLearner(4);
    let trainingVector = [
        [1, 2, 3, 4],
        [5, 6, 7, 8]
    ];
    let actions = [1, 2];

    // CALL
    let nnInput = toCheck.createNNMiniBatchInput(trainingVector, actions);

    // ASSERT
    expect(nnInput.length).toBe(2);
    expect(ArrayUtils.arrayEquals(nnInput[0], [1, 2, 3, 4, -1, 1])).toBe(true);
    expect(ArrayUtils.arrayEquals(nnInput[1], [5, 6, 7, 8, 1, -1])).toBe(true);
});

it ("convertRawNNOutputToDecimal works", () => {
    // SETUP
    let learner = new DeepQLearner(4, 4, 10000);
    let output = [-0.5, 0.5, 0, 0.75, 0.35, -0.5, -0.1, -0.2, 0.7, 0.75, 0.934, 0.74, 0.29, 0.9];
    // 01011000111111
    // 1 + 2 + 4

    // CALL
    let toCheck = learner.convertRawNNOutputToDecimal(output);

    // ASSERT
    expect(toCheck).toBe(5695);
});

it ("convertRawNNMiniBatchToDecimal works", () => {
    // SETUP
    let learner = new DeepQLearner(4, 4, 10000);
    let toClone = [-0.5, 0.5, 0, 0.75, 0.35, -0.5, -0.1, -0.2, 0.7, 0.75, 0.934, 0.74, 0.29, 0.9];
    let outputs = [];
    outputs.push(ArrayUtils.copy(toClone));
    outputs.push(ArrayUtils.copy(toClone));
    outputs.push(ArrayUtils.copy(toClone));

    // 01011000111111
    // 1 + 2 + 4

    // CALL
    let toCheck = learner.convertRawNNMiniBatchToDecimal(outputs);

    // ASSERT
    // 5695
    expect(toCheck.length).toBe(3);
    expect(toCheck[0]).toBe(5695);
    expect(toCheck[1]).toBe(5695);
    expect(toCheck[2]).toBe(5695);
});

it ("feedForwardMiniBatch", () => {
    // SETUP
    let learner = new DeepQLearner(14, 4, 10000);
    let toClone = [-0.5, 0.5, 0, 0.75, 0.35, -0.5, -0.1, -0.2, 0.7, 0.75, 0.934, 0.74, 0.29, 0.9];
    let inputs = [];
    inputs.push(ArrayUtils.copy(toClone));
    inputs.push(ArrayUtils.copy(toClone));
    inputs.push(ArrayUtils.copy(toClone));

    // CALL
    let toCheck = learner.feedForwardMiniBatch(inputs, [0, 1, 2]);

    // ASSERT
    expect(toCheck.length).toBe(3);
    expect(toCheck[0]).toBeGreaterThanOrEqual(0);
    expect(toCheck[0]).toBeLessThanOrEqual(Math.pow(2, learner._nodesPerLayer[learner._nodesPerLayer.length - 1]));

    expect(toCheck[1]).toBeGreaterThanOrEqual(0);
    expect(toCheck[1]).toBeLessThanOrEqual(Math.pow(2, learner._nodesPerLayer[learner._nodesPerLayer.length - 1]));

    expect(toCheck[2]).toBeGreaterThanOrEqual(0);
    expect(toCheck[2]).toBeLessThanOrEqual(Math.pow(2, learner._nodesPerLayer[learner._nodesPerLayer.length - 1]));
});

it ("getActionWithLargestQValue", () => {
    // SETUP
    let numActions = 4;
    let learner = new DeepQLearner(14, numActions, 10000);
    let sPrime = [-0.5, 0.5, 0, 0.75, 0.35, -0.5, -0.1, -0.2, 0.7, 0.75, 0.934, 0.74, 0.29, 0.9];

    // CALL
    let toCheck = learner.getActionWithLargestQValue(sPrime);

    // ASSERT
    expect(toCheck).toBeGreaterThanOrEqual(0);
    expect(toCheck).toBeLessThan(numActions);
});

it ("getAction", () => {
    // SETUP
    let numActions = 4;
    let rar = 0.98;
    let learner = new DeepQLearner(14, numActions, 10000, 0.2, 0.9, rar, 0.5);
    let sPrime = [-0.5, 0.5, 0, 0.75, 0.35, -0.5, -0.1, -0.2, 0.7, 0.75, 0.934, 0.74, 0.29, 0.9];

    // CALL
    let action = learner.getAction(sPrime, true);

    // ASSERT
    expect(action).toBeGreaterThanOrEqual(0);
    expect(action).toBeLessThan(numActions);
    expect(learner.rar).toBeCloseTo(rar / 2);
});

it ("convertDecimalToBackPropArray", () => {
    // SETUP
    let learner = new DeepQLearner(4);

    // CALL
    let theArray = learner.convertDecimalToBackPropArray(1);
    let theArray2 = learner.convertDecimalToBackPropArray(16383);
    let theArray3 = learner.convertDecimalToBackPropArray(0);

    // ASSERT
    expect(theArray.length).toBe(14);
    for (let i = 0; i < 13; i++) {
        expect(theArray[i]).toBeCloseTo(-1);
    }
    expect(theArray[13]).toBeCloseTo(1);

    expect(theArray2.length).toBe(14);
    theArray2.forEach(function (item) {
        expect(item).toBeCloseTo(1.0);
    });

    expect(theArray3.length).toBe(14);
    theArray3.forEach(function (item) {
        expect(item).toBeCloseTo(-1.0);
    });
});

it ("query", () => {
    // SETUP
    let learner = new DeepQLearner(4);
    learner._s = [0, 1, 2, 3];

    // CALL
    let newAction = learner.query([1, 2, 3, 4], 1);

    // ASSERT
    expect(newAction).toBeGreaterThanOrEqual(0);
    expect(newAction).toBeLessThan(learner.numActions);
});

it ("querySetState", () => {
    // SETUP
    let learner = new DeepQLearner(4);
    let origRAR = learner.rar;

    // CALL
    let newAction = learner.querySetState([0, 1, 2, 3]);

    // ASSERT
    expect(newAction).toBeGreaterThanOrEqual(0);
    expect(newAction).toBeLessThan(learner.numActions);
    expect(origRAR).toBe(learner.rar); // it shouldn't update the rar
});

// it ("DeepQLearner Converges", () => {
//     let qLearner = new DeepQLearner(1, 2, 4, 0.2, 0.9, 0.2, 0.9, false, 10, 2, 100);
//     let num_runs = 10000;
//     let goalPositions = [0, 5];
//
//     let startPos = 2;
//     let minSteps = Number.POSITIVE_INFINITY;
//     let playerPos = startPos;
//
//     for (let i = 0; i < num_runs; i++) {
//         playerPos = startPos;
//         let action = qLearner.querySetState([playerPos]);
//         let steps = 0;
//
//         while (goalPositions.indexOf(playerPos) < 0) {
//             if (action === 0) {
//                 playerPos--;
//             } else if (action === 1) {
//                 playerPos++;
//             } else {
//                 throw new Error("Unknown Action");
//             }
//
//             let r = -1;
//             if (playerPos === 1) {
//                 r = -1;
//                 // r = -1;
//             } else if (goalPositions.indexOf(playerPos) >= 0) {
//                 r = 1;
//             }
//
//             action = qLearner.query([playerPos], r);
//             steps++;
//         }
//
//         if (steps < minSteps) {
//             minSteps = steps;
//         }
//     }
//
//     // expect(minSteps).toBe(2);
//     expect(playerPos).toBe(5);
//
// });