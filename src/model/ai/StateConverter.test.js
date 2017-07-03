import StateConverter from "./StateConverter";
import GameObjectContainerFactory from "../unittesting/GameObjectContainerFactory";
import Player from "../actors/Player";
import Ghost from "../actors/Ghost";
import PowerUp from "../actors/PowerUp";
import GameObjectContainer from "../GameObjectContainer";
import ArrayUtils from "../../utils/ArrayUtils";

it ("Constructor works", () => {
    // SETUP

    // CALL
    let instance = new StateConverter();

    // ASSERT
    expect(instance !== null).toBe(true);
});

it ("toFeatureVector returns an array", () => {
    // SETUP
    let goc = GameObjectContainerFactory.createGameObjectContainer();
    let sc = new StateConverter();

    // CALL
    let retVal = sc.toFeatureVector(goc);

    // ASSERT
    expect(retVal instanceof Array).toBe(true);
});

it ("capitalizeStartChar", () => {
    // SETUP
    let toCapitalize = "red";

    // CALL
    let retVal = StateConverter.capitalizeStartChar(toCapitalize);

    // ASSERT
    expect(retVal).toBe("Red");
});

it ("get trainingFeatureIndices", () => {
    // SETUP
    let newLength = Player.trainingFeatureIndices.length +
            Ghost.trainingFeatureIndices.length * 4 +
            PowerUp.trainingFeatureIndices.length +
            GameObjectContainer.trainingFeatureIndices.length;

    // CALL
    let retVal = StateConverter.trainingFeatureIndices;

    // ASSERT
    let distinctValues = ArrayUtils.distinctIntegers(retVal);
    expect(retVal.length).toBe(newLength);
    expect(distinctValues.length).toBe(retVal.length);
});

it ("test toFeatureVector", () => {
    // SETUP
    let goc = GameObjectContainerFactory.createGameObjectContainer();
    let sc = new StateConverter();
    let theLength = goc.player.toFeatureVector().length +
            goc.ghostBlue.toFeatureVector().length +
            goc.ghostRed.toFeatureVector().length +
            goc.ghostPink.toFeatureVector().length +
            goc.ghostOrange.toFeatureVector().length +
            goc.powerUp.toFeatureVector().length +
            goc.toFeatureVector().length;

    // CALL
    let retVal = sc.toFeatureVector(goc);

    // ASSERT
    expect(retVal.length).toBe(theLength);
});

it ("test setFeatureVector", () => {
    // SETUP
    let goc = GameObjectContainerFactory.createGameObjectContainer();
    let sc = new StateConverter();
    GameObjectContainer._nextKillScore = 800;
    let featureVector = sc.toFeatureVector(goc);
    GameObjectContainer._nextKillScore = 200;
    let otherGoc = GameObjectContainerFactory.createGameObjectContainer();

    // CALL
    sc.setFeatureVector(otherGoc, featureVector);

    // ASSERT
    expect(GameObjectContainer._nextKillScore).toBe(800);
});