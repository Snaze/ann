import Normalizer from "./Normalizer";
import ActivationFunctions from "./ActivationFunctions";
import ArrayUtils from "../../../utils/ArrayUtils";

// it ("normalize column removes negative values if relu and normalizes between 0 and 1", () => {
//     let toNormalize = [[5, 10, 15],
//         [10, 15, 20],
//         [15, 20, 25]];
//     let nn = new Normalizer(ActivationFunctions.relu);
//
//     // CALL
//     let result = nn.normalize(toNormalize, true);
//
//     // ASSERT
//     let flattenedResult = ArrayUtils.flatten(result);
//     let filteredResult = ArrayUtils.filter(flattenedResult, (item) => item >= 0 && item <= 1);
//     expect(flattenedResult.length).toBe(filteredResult.length);
//     expect(flattenedResult.length).toBe(9);
// });

it ("normalize column works", () => {
    // SETUP
    let toNormalize = [1, 3, 5];
    // let stdDev = 2;
    let normalizer = new Normalizer(ActivationFunctions.sigmoid);

    // CALL
    let toCheck = normalizer.normalizeColumn(toNormalize).data;

    // ASSERT
    // minMaxNormalization
    expect(toCheck[0]).toBeCloseTo(0);
    expect(toCheck[1]).toBeCloseTo(0.5);
    expect(toCheck[2]).toBeCloseTo(1);
});

it ("normalize works", () => {
    // SETUP
    let toNormalize = [[5, 10, 15],
        [10, 15, 20],
        [15, 20, 25]];
    // let stddev = 5;
    // let mean = [10, 15, 20];
    let normalizer = new Normalizer(ActivationFunctions.sigmoid);

    // CALL
    let result = normalizer.normalize(toNormalize, true);

    // console.log(result);

    // ASSERT
    // min-max normalization
    expect(ArrayUtils.arrayApproxEquals(result[0], [0.0, 0.0, 0.0])).toBe(true);
    expect(ArrayUtils.arrayApproxEquals(result[1], [0.5, 0.5, 0.5])).toBe(true);
    expect(ArrayUtils.arrayApproxEquals(result[2], [1.0, 1.0, 1.0])).toBe(true);
    // for (let y = 0; y < result.length; y++) {
    //
    //     for (let x = 0; x < result[y].length; x++) {
    //         let expectedValue = (toNormalize[y][x] - mean[x]) / stddev;
    //         expect(result[y][x]).toBeCloseTo(expectedValue);
    //     }
    // }
});