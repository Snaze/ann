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
        15 / SimpleStateConveter.MAX_DIRECTION,

        2 / SimpleStateConveter.MAX_DISTANCE,
        1 / SimpleStateConveter.MAX_DIRECTION,
        2 / SimpleStateConveter.MAX_LIVING_STATE,

        41 / SimpleStateConveter.MAX_DISTANCE,
        0 / SimpleStateConveter.MAX_DIRECTION,
        2 / SimpleStateConveter.MAX_LIVING_STATE,

        41 / SimpleStateConveter.MAX_DISTANCE,
        0 / SimpleStateConveter.MAX_DIRECTION,
        2 / SimpleStateConveter.MAX_LIVING_STATE,

        41 / SimpleStateConveter.MAX_DISTANCE,
        0 / SimpleStateConveter.MAX_DIRECTION,
        2 / SimpleStateConveter.MAX_LIVING_STATE,

        2 / SimpleStateConveter.MAX_DISTANCE,
        2 / SimpleStateConveter.MAX_DIRECTION,
        2 / SimpleStateConveter.MAX_LIVING_STATE,
        200 / SimpleStateConveter.MAX_POWER_UP_VALUE,

        1 / SimpleStateConveter.MAX_DISTANCE,
        4 / SimpleStateConveter.MAX_DIRECTION,

        2 / SimpleStateConveter.MAX_DISTANCE,
        4 / SimpleStateConveter.MAX_DIRECTION
    ];

    // CALL
    let featureVector = instance.toFeatureVector(goc);

    // ASSERT
    // console.log(`feature = ${featureVector}`);
    // console.log(`should  = ${shouldBeFeatureVector}`);
    expect(featureVector).toBeInstanceOf(Array);
    expect(ArrayUtils.arrayIsCloseTo(featureVector, shouldBeFeatureVector)).toBe(true);
});