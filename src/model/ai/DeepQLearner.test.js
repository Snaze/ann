import DeepQLearner from "./DeepQLearner";
import ArrayUtils from "../../utils/ArrayUtils";

it ("constructor works", () => {
   let toCheck = new DeepQLearner(10);

   expect(toCheck !== null).toBe(true);
});

it ("createNodesPerLayerArray", () => {
    // SETUP

    // CALL
    let toCheck = DeepQLearner.createNodesPerLayerArray(4, 30, 3);

    // ASSERT
    expect(ArrayUtils.arrayEquals(toCheck, [30, 30, 30, 30, 4])).toBe(true);
});

it ("getActionWithLargestQValue", () => {
    // SETUP
    let numActions = 4;
    let learner = new DeepQLearner(14, numActions);
    let sPrime = [-0.5, 0.5, 0, 0.75, 0.35, -0.5, -0.1, -0.2, 0.7, 0.75, 0.934, 0.74, 0.29, 0.9];

    // CALL
    let toCheck = learner.getActionWithLargestQValue(sPrime);

    // ASSERT
    expect(toCheck).toBeGreaterThanOrEqual(0);
    expect(toCheck).toBeLessThan(numActions);
});

it ("getQValueForAllActions", () => {
    let numActions = 4;
    let learner = new DeepQLearner(14, numActions);
    let sPrime = [-0.5, 0.5, 0, 0.75, 0.35, -0.5, -0.1, -0.2, 0.7, 0.75, 0.934, 0.74, 0.29, 0.9];

    // CALL
    let toCheck = learner.getQValueForAllActions(sPrime);

    // ASSERT
    expect(toCheck.length).toBe(4);
});

it ("getAction", () => {
    // SETUP
    let numActions = 4;
    let rar = 0.98;
    let learner = new DeepQLearner(14, numActions, 0.2, 0.9, rar, 0.5);
    let sPrime = [-0.5, 0.5, 0, 0.75, 0.35, -0.5, -0.1, -0.2, 0.7, 0.75, 0.934, 0.74, 0.29, 0.9];

    // CALL
    let action = learner.getAction(sPrime, true);

    // ASSERT
    expect(action).toBeGreaterThanOrEqual(0);
    expect(action).toBeLessThan(numActions);
    expect(learner.rar).toBeCloseTo(rar / 2);
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
//     let qLearner = new DeepQLearner(1, 2, 0.2, 0.9, 0.98, 0.9999, false, 100, 1, 100);
//     // qLearner.weights = [ [ [] ],
//     //     [ [ -0.6658831202550373, -0.014930643238211947 ] ],
//     //     [ [ -0.12714260138377667, -0.11798448301514947 ] ],
//     //     [ [ -0.45485738530145053, -1.1363260387631637 ],
//     //         [ 0.5131084461299832, 1.046726844497299 ] ] ];
//     // let initialWeights = qLearner.weights;
//     let num_runs = 20000;
//     let goalPositions = [0, 5];
//
//     let startPos = 2;
//     let minSteps = Number.POSITIVE_INFINITY;
//     let playerPos = startPos;
//     let totalReward = 0;
//     let history = [];
//
//
//     for (let i = 0; i < num_runs; i++) {
//         playerPos = startPos;
//         let action = qLearner.querySetState([playerPos]);
//         let steps = 0;
//         console.log(`iteration = ${i}`);
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
//             let r = -0.01;
//             if (playerPos === 1) {
//                 r = -0.1;
//                 // r = -1;
//             } else if (goalPositions.indexOf(playerPos) >= 0) {
//                 r = 0.1;
//             }
//
//             action = qLearner.query([playerPos], r);
//             history.push({
//                 outputError: qLearner.outputError,
//                 totalError: qLearner.totalError,
//                 qValues: qLearner.getAllQValuesForAllStates(6)
//             });
//
//             totalReward += r;
//             steps++;
//         }
//
//         if (steps < minSteps) {
//             minSteps = steps;
//         }
//     }
//
//     // [ [ -0.9562615470412972, -0.6373994768352311 ],
//     //     [ -0.06584523004779941, 0.40756343756894214 ],
//     //     [ -19.401845430132198, 89.19455739766035 ],
//     //     [ -0.18111740857108172, 100.21617488628928 ],
//     //     [ -0.8465040432427031, 0.24019431809921743 ] ]
//     console.log(`totalReward = ${totalReward}`);
//     console.log(`minSteps = ${minSteps}`);
//     console.log(`rar = ${qLearner.rar}`);
//     for (let i = 0; i < num_runs; i += 100) {
//         let cur = history[i];
//         console.log(`${i}) error = ${cur.outputError}, totalError = ${cur.totalError}, qValues = ${cur.qValues}`);
//     }
//     // console.log(initialWeights);
//     // expect(minSteps).toBe(2);
//     expect(playerPos).toBe(5);
//
//
// });