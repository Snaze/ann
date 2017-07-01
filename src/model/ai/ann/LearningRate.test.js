import LearningRate from "./LearningRate";

it ("basic test", () => {
    let value = new LearningRate();

    expect(value !== null).toBe(true);
});

it ("test getGrowthConstant", () => {
    // SETUP
    let startValue = 100;
    let endValue = 450;
    let numEpochs = 6;

    // CALL
    let growthConstant = LearningRate.getGrowthConstant(startValue, endValue, numEpochs);

    // ASSERT
    expect(growthConstant).toBeCloseTo(0.2506);
});

it ("test getLearningRate", () => {
    // SETUP
    let lr = new LearningRate(1.0, 0.001, 100);
    // let k = -0.069077552789821;

    // CALL
    let learningRate = lr.getLearningRate(50);

    // ASSERT
    expect(learningRate).toBeCloseTo(0.031622776601684);
});