import MinMaxNormalizer from "./MinMaxNormalizer";
import ArrayUtils from "../../utils/ArrayUtils";

it ("constructor", () => {
    let instance = new MinMaxNormalizer();

    expect(instance !== null).toBe(true);
});

it ("normalize", () => {
    // SETUP
    let normalizer = new MinMaxNormalizer("test", true);

    // CALL
    let normalizedArray = normalizer.normalize([-5, 0, 5]);
    let secondNormalizedArray = normalizer.normalize([-2.5, 2.5]);

    // ASSERT
    expect(ArrayUtils.arrayIsCloseTo(normalizedArray, [0, 0.5, 1.0]));
    expect(ArrayUtils.arrayIsCloseTo(secondNormalizedArray, [0.25, 0.75]));
});