import LahiriSampler from "./LahiriSampler";
import ArrayUtils from "../../../utils/ArrayUtils";

it ("constructor", () => {
    let toCheck = new LahiriSampler();

    expect(toCheck !== null).toBe(true);
});

it ("setMaxIfMax", () => {
    // SETUP
    let toTest = new LahiriSampler();
    let theArray = [];

    // CALL and ASSERT
    theArray.push(1);
    toTest.setMaxIfMax(1);
    expect(toTest.max).toBe(1);
    expect(!Number.isFinite(toTest.prevMax[toTest.prevMax.length - 1])).toBe(true);

    theArray.push(2);
    toTest.setMaxIfMax(2);
    expect(toTest.max).toBe(2);
    expect(toTest.prevMax[toTest.prevMax.length - 1]).toBe(1);

    theArray.push(0.5);
    toTest.setMaxIfMax(0.5);
    expect(toTest.max).toBe(2);
    expect(toTest.prevMax[toTest.prevMax.length - 1]).toBe(1);
});

it ("removeMaxIfMax", () => {
    // SETUP
    let toTest = new LahiriSampler();
    let theArray = [];
    theArray.push(1);
    toTest.setMaxIfMax(1);
    theArray.push(2);
    toTest.setMaxIfMax(2);
    theArray.push(0.5);
    toTest.setMaxIfMax(0.5);

    // CALL and ASSERT
    let toRemove = theArray.pop();
    toTest.removeMaxIfMax(toRemove);
    expect(toTest.max).toBe(2);
    expect(toTest.prevMax[toTest.prevMax.length - 1]).toBe(1);

    toRemove = theArray.pop();
    toTest.removeMaxIfMax(toRemove);
    expect(toTest.max).toBe(1);
    expect(!Number.isFinite(toTest.prevMax[toTest.prevMax.length - 1])).toBe(true);

    toRemove = theArray.pop();
    toTest.removeMaxIfMax(toRemove);
    expect(!Number.isFinite(toTest.max)).toBe(true);

});

/**
 * This method is probabilistic in nature so it CAN fail with a small probability.
 */
it ("sample", () => {

    // SETUP
    let toTest = new LahiriSampler();
    let theArray = [];
    theArray.push(2);
    toTest.setMaxIfMax(2);
    theArray.push(3);
    toTest.setMaxIfMax(3);
    theArray.push(1);
    toTest.setMaxIfMax(1);

    // CALL
    let sample = [];

    for (let i = 0; i < 100; i++) {
        ArrayUtils.extend(sample, toTest.sample(theArray, null, 10));
    }

    // ASSERT
    expect(sample.length).toBe(1000);

    let num3s = 0;
    let num2s = 0;
    let num1s = 0;

    sample.forEach(function (sample) {
        if (sample === 3) { num3s++; }
        if (sample === 2) { num2s++; }
        if (sample === 1) { num1s++; }
    });

    expect(num3s).toBeGreaterThanOrEqual(num2s);
    expect(num3s).toBeGreaterThanOrEqual(num1s);
    expect(num2s).toBeGreaterThanOrEqual(num1s);
});