import EasingFunctions from "./EasingFunctions";

it ("test doCalculation minValue", () => {
    // SETUP
    let t = 0;
    let minValue = 0.15;
    let maxValue = 0.25;

    // CALL
    let nextValue = EasingFunctions.doCalculation(EasingFunctions.easeInCubic,
                                                  t, minValue, maxValue);

    // ASSERT
    expect(nextValue).toBe(minValue);
});

it ("test doCalculation maxValue", () => {
    // SETUP
    let t = 1;
    let minValue = 0.15;
    let maxValue = 0.25;

    // CALL
    let nextValue = EasingFunctions.doCalculation(EasingFunctions.easeInCubic,
        t, minValue, maxValue);

    // ASSERT
    expect(nextValue).toBe(maxValue);
});

it ("test doCalculation between values", () => {
    // SETUP
    let t = 0.5;
    let minValue = 0.15;
    let maxValue = 0.25;

    // CALL
    let nextValue = EasingFunctions.doCalculation(EasingFunctions.easeInCubic,
        t, minValue, maxValue);

    // ASSERT
    expect(minValue < nextValue && maxValue > nextValue).toBe(true);
});

it ("test doCalculation min and max are equal", () => {
    // SETUP
    let t = 0.5;
    let minAndMaxValue = 0.25;

    // CALL
    let nextValue = EasingFunctions.doCalculation(EasingFunctions.easeInCubic,
        t, minAndMaxValue, minAndMaxValue);

    // ASSERT
    expect(nextValue).toBe(minAndMaxValue);
});

it ("test getTime min = t", () => {
    // SETUP
    let t = 1;
    let minTime = 1;
    let maxTime = 17;

    // CALL
    let nextTime = EasingFunctions.getTime(minTime, maxTime, t);
    let nextTimeInvert = EasingFunctions.getTime(minTime, maxTime, t, true);

    // ASSERT
    expect(nextTime).toBe(0);
    expect(nextTimeInvert).toBe(1);
});

it ("test getTime max = t", () => {
    // SETUP
    let t = 17;
    let minTime = 1;
    let maxTime = 17;

    // CALL
    let nextTime = EasingFunctions.getTime(minTime, maxTime, t);
    let nextTimeInvert = EasingFunctions.getTime(minTime, maxTime, t, true);

    // ASSERT
    expect(nextTime).toBe(1);
    expect(nextTimeInvert).toBe(0);
});

it ("test getTime t is between", () => {
    // SETUP
    let t = 8;
    let minTime = 1;
    let maxTime = 17;

    // CALL
    let nextTime = EasingFunctions.getTime(minTime, maxTime, t);
    let nextTimeInvert = EasingFunctions.getTime(minTime, maxTime, t, true);

    // ASSERT
    expect(nextTime > 0 && nextTime < 1).toBe(true);
    expect(nextTimeInvert > 0 && nextTimeInvert < 1).toBe(true);
});