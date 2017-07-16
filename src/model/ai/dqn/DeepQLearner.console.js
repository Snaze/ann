import math from "mathjs";
import DeepQLearner from "./DeepQLearner";

/**
 * Commenting this out for now since it takes forever.
 */
const testDeepQLearnerConverges = function (num_runs, finalRar=0.0000001) {

    let rar = 0.98;
    let radr = Math.pow((finalRar / rar), 1/ num_runs);

    if (radr <= 0) {
        throw new Error("Invalid radr");
    }

    let qLearner = new DeepQLearner(1, 2, 0.03, 0.99, rar, radr, false, 10, 2, num_runs);
    // let num_runs = 10000;
    let goalPositions = [1, 6];

    let startPos = 3;
    let minSteps = Number.POSITIVE_INFINITY;
    let playerPos = startPos;
    let steps = Number.POSITIVE_INFINITY;
    let executeActionCallback = function (source, action) {
        if (action === 0) {
            playerPos--;
        } else if (action === 1) {
            playerPos++;
        } else {
            throw new Error("Unknown Action");
        }

        let r = -0.01;
        let isTerminal = false;
        if (playerPos === 2) {
            r = -0.1;
            // r = -1;
        } else if (goalPositions.indexOf(playerPos) >= 0) {
            r = 0.1;
            isTerminal = true;
        }

        steps++;
        return { reward: r, state: [playerPos/10], isTerminal: isTerminal };
    };

    let prevEpoch = -1;
    while (qLearner.epochNum < num_runs) {
        if (qLearner.epochNum !== prevEpoch) {
            if (steps < minSteps) {
                minSteps = steps;
            }
            steps = 0;
            playerPos = startPos;
        }
        prevEpoch = qLearner.epochNum;

        qLearner.learnOne(executeActionCallback, [startPos / 10]);
    }

    return playerPos === 6;
};

function doWork() {

    let numCorrect = 0;
    let results = [];
    // let numRunsArray = [100, 200, 400, 800, 1600, 3200, 6400, 12800];
    // let numRunsArray = [100, 200, 400, 800, 1600];
    // let numRunsToAverage = 3;
    let numRunsArray = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1250, 1500, 1750, 2000];
    let numRunsToAverage = 3;
    let totalTests = 100;
    // let numRunsArray = [100];
    // let numRunsToAverage = 3;
    // let totalTests = 100;

    console.log("Running DeepQLearner.console.js");
    console.log(`numRunsArray = ${numRunsArray}`);
    console.log(`totalTests = ${totalTests}`);

    numRunsArray.forEach(function (numRuns, index) {

        let currentResults = [];

        for (let runNum = 0; runNum < numRunsToAverage; runNum++) {
            numCorrect = 0;

            for (let i = 0; i < totalTests; i++) {
                if (testDeepQLearnerConverges(numRuns)) {
                    numCorrect++;
                }
            }

            let percentCorrect = Math.floor((numCorrect / totalTests) * 100);
            console.log(`Intermediate Results for ${numRuns} runs = ${percentCorrect}`);
            currentResults.push(percentCorrect);
        }

        let toRecord = math.mean(currentResults);
        results.push(toRecord);
        console.log(`Results for ${numRuns} runs = ${toRecord}`);
    });

    numRunsArray.forEach(function (numRuns, index) {
        console.log(`Results for ${numRuns} runs = ${results[index]}`);
    });
    // 100 runs = 77% percent correct
    // 200 runs = 82% percent correct - 84%
    // 300 runs = 81% percent correct
    // 400 runs = 84% percent correct - 3m 16s - 87%
    // 500 runs = 82% percent correct - 3m 59s
    // 600 runs = 84% percent correct - 5m 3s
    // 700 runs =
    // 800 runs = 91% correct
    // 900 runs =
    // 1000 runs = 84% - 8m 10s, 73%   with decaying learning rate., 83%, 70%, 74% with prioritized. (11m 19s though).
    // 10000 runs = 87% - 1h 25 m 38 s with decaying learning rate
    // 20000 runs = 90%   2h 42 m 34 s with decaying learning rate - 7:32
    // expect(percentCorrect).toBeGreaterThanOrEqual(90);

    // Tweaked experience replay to only store unique Transitions
    // 200 runs = 84%
    // 400 runs = 87%
    // 800 runs = 91%
    // 1200 runs = 91%
    // 1600 runs = 95%
    // 3200 runs = 90%/91% - 31m 24s
    // 6400 runs  - 85% 3:05 it should be done.
}

doWork();