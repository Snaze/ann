import SimpleStateConveter from "./SimpleStateConverter";
import GameObjectContainerFactory from "../unittesting/GameObjectContainerFactory";
import ArrayUtils from "../../utils/ArrayUtils";

it ("constructor", () => {
    let instance = new SimpleStateConveter();

    expect(instance !== null).toBe(true);
});

it ("toFeatureVector", () => {
    // SETUP
    let goc = GameObjectContainerFactory.createGameObjectContainer();
    let instance = new SimpleStateConveter();
    let shouldBeFeatureVector = [
        15,
        2, 1, 2,
        41, 0, 2,
        41, 0, 2,
        41, 0, 2,
        2, 2, 2, 200,
        1, 4,
        2, 4
    ];

    // CALL
    let featureVector = instance.toFeatureVector(goc);

    // ASSERT
    // console.log(`feature = ${featureVector}`);
    // console.log(`should  = ${shouldBeFeatureVector}`);
    expect(featureVector).toBeInstanceOf(Array);
    expect(ArrayUtils.arrayEquals(featureVector, shouldBeFeatureVector)).toBe(true);
});