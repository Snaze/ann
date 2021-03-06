import QLearner from "./QLearner";


it ("Constructor works", () => {
    let qLearner = new QLearner(5);

    expect(qLearner !== null).toBe(true);
});

it ("QLearner Converges", () => {
    let qLearner = new QLearner(5, 2, 0.2, 0.9, 0.2, 0.9);
    let num_runs = 10000;
    let goalPositions = [0, 4];

    let startPos = 2;
    let minSteps = Number.POSITIVE_INFINITY;
    let playerPos = startPos;

    for (let i = 0; i < num_runs; i++) {
        playerPos = startPos;
        let action = qLearner.querySetState(playerPos);
        let steps = 0;

        while (goalPositions.indexOf(playerPos) < 0) {
            if (action === 0) {
                playerPos--;
            } else if (action === 1) {
                playerPos++;
            } else {
                throw new Error("Unknown Action");
            }

            let r = -1;
            if (playerPos === 1) {
                r = -100;
                // r = -1;
            } else if (goalPositions.indexOf(playerPos) >= 0) {
                r = 100;
            }

            // console.log(`i = ${i}, playerPos = ${playerPos}`);

            action = qLearner.query(playerPos, r);
            steps++;
        }

        if (steps < minSteps) {
            minSteps = steps;
        }
    }

    console.log(window.q);
    // expect(minSteps).toBe(2);
    expect(playerPos).toBe(4);

});