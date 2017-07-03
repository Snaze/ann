import PowerUp from "./PowerUp";
import Level from "../Level";
import moment from "../../../node_modules/moment/moment";
import Direction from "../../utils/Direction";

it ("Constructor works", () => {
    // SETUP
    let level = new Level(10, 10);
    new PowerUp(level, PowerUp.POWER_UP_APPLE);

});

it ("TimerTick works", () => {
    // SETUP
    let level = new Level(2, 2);
    let powerUp = new PowerUp(level, PowerUp.POWER_UP_APPLE);
    powerUp.location.set(0, 0);
    let originalLocation = powerUp.location.clone();

    // CALL
    powerUp.timerTick({});

    // ASSERT
    expect(!originalLocation.equals(powerUp.location)).toBe(true);
});

it ("setPowerUpTypeByName works", () => {
    // SETUP
    let level = new Level(2, 2);
    let powerUp = new PowerUp(level, PowerUp.POWER_UP_APPLE);

    // CALL & ASSERT
    powerUp.setPowerUpTypeByName("Cherry");
    expect(powerUp.powerUpType === PowerUp.POWER_UP_CHERRY).toBe(true);

    // CALL & ASSERT
    powerUp.setPowerUpTypeByName("Strawberry");
    expect(powerUp.powerUpType === PowerUp.POWER_UP_STRAWBERRY).toBe(true);

    // CALL & ASSERT
    powerUp.setPowerUpTypeByName("Orange");
    expect(powerUp.powerUpType === PowerUp.POWER_UP_ORANGE).toBe(true);

    // CALL & ASSERT
    powerUp.setPowerUpTypeByName("Pretzel");
    expect(powerUp.powerUpType === PowerUp.POWER_UP_PRETZEL).toBe(true);

    // CALL & ASSERT
    powerUp.setPowerUpTypeByName("Apple");
    expect(powerUp.powerUpType === PowerUp.POWER_UP_APPLE).toBe(true);

    // CALL & ASSERT
    powerUp.setPowerUpTypeByName("Pear");
    expect(powerUp.powerUpType === PowerUp.POWER_UP_PEAR).toBe(true);

    // CALL & ASSERT
    powerUp.setPowerUpTypeByName("Banana");
    expect(powerUp.powerUpType === PowerUp.POWER_UP_BANANA).toBe(true);

});

it ("locations get reset on level set", () => {
    // SETUP
    let theLevel = new Level(3, 3);
    let powerUp = new PowerUp(theLevel, PowerUp.POWER_UP_BANANA);
    powerUp.location.set(2, 2);
    powerUp._spawnLocation.set(2, 2);
    powerUp._prevLocation.set(2, 2);
    powerUp._destinationLocation.set(2, 2);

    // CALL
    powerUp.level = new Level(4, 4);

    // ASSERT
    expect(powerUp.location.isEqualTo(-1, -1)).toBe(true);
    expect(powerUp._spawnLocation.isEqualTo(-1, -1)).toBe(true);
    expect(powerUp._prevLocation.isEqualTo(-1, -1)).toBe(true);
    expect(powerUp._destinationLocation.isEqualTo(-1, -1)).toBe(true);
});

it ("spawn set expiration and blink times", () => {
    // SETUP
    let theLevel = new Level(3, 3);
    let powerUp = new PowerUp(theLevel, PowerUp.POWER_UP_BANANA);

    // CALL
    powerUp.spawn();

    // ASSERT
    let now = moment();
    expect(powerUp._blinkTime > now && powerUp._lifeExpirationTime > powerUp._blinkTime).toBe(true);
});

it ("toFeatureVector test", () => {
    // SETUP
    let theLevel = new Level(3, 3);
    let powerUp = new PowerUp(theLevel, PowerUp.POWER_UP_BANANA);
    powerUp.location.set(2, 2);
    powerUp.isAlive = true;
    powerUp.prevLocation.set(1, 2);
    powerUp.direction = Direction.RIGHT;
    powerUp._destinationLocation.set(2, 1);
    powerUp.blink = true;
    powerUp._lifeExpirationTime = moment().add(2.9, "s");
    powerUp._blinkTime = moment().add(1.9, "s");

    // CALL
    let featureVector = powerUp.toFeatureVector();

    // ASSERT
    expect(featureVector.length).toBe(14);
    expect(featureVector[0]).toBe(2);
    expect(featureVector[1]).toBe(2);
    expect(featureVector[2]).toBe(1);
    expect(featureVector[3]).toBe(0);
    expect(featureVector[4]).toBe(1);
    expect(featureVector[5]).toBe(1);
    expect(featureVector[6]).toBe(2);
    expect(featureVector[7]).toBe(Direction.directionToDecimal(Direction.RIGHT));
    expect(featureVector[8]).toBe(2);
    expect(featureVector[9]).toBe(1);
    expect(featureVector[10]).toBe(1);
    expect(featureVector[11]).toBe(PowerUp.POWER_UP_BANANA);
    expect(Math.floor(featureVector[12] / 1000)).toBe(2);
    expect(Math.floor(featureVector[13] / 1000)).toBe(1);
});

it ("setFeatureVector test", () => {
    // SETUP
    let theLevel = new Level(3, 3);
    let powerUp = new PowerUp(theLevel, PowerUp.POWER_UP_BANANA);
    powerUp.location.set(2, 2);
    powerUp.isAlive = true;
    powerUp.prevLocation.set(1, 2);
    powerUp.direction = Direction.RIGHT;
    powerUp._destinationLocation.set(2, 1);
    powerUp.blink = true;
    powerUp._lifeExpirationTime = moment().add(2.9, "s");
    powerUp._blinkTime = moment().add(1.9, "s");
    let featureVector = powerUp.toFeatureVector();
    let otherPowerUp = new PowerUp(theLevel, PowerUp.POWER_UP_STRAWBERRY);

    // CALL
    otherPowerUp.setFeatureVector(featureVector);

    // ASSERT
    expect(otherPowerUp.location.equals(powerUp.location)).toBe(true);
    expect(otherPowerUp.isAlive).toBe(powerUp.isAlive);
    expect(otherPowerUp.prevLocation.equals(powerUp.prevLocation)).toBe(true);
    expect(otherPowerUp.direction).toBe(powerUp.direction);
    expect(otherPowerUp._destinationLocation.equals(powerUp._destinationLocation)).toBe(true);
    expect(otherPowerUp.blink).toBe(powerUp.blink);
    expect(Math.floor(otherPowerUp._lifeExpirationTime.diff(moment()) / 1000)).toBe(2);
    expect(Math.floor(otherPowerUp._blinkTime.diff(moment()) / 1000)).toBe(1);
    expect(otherPowerUp.powerUpType).toBe(powerUp.powerUpType);
});

it ("toFeatureVector test", () => {
    // SETUP
    let theLevel = new Level(3, 3);
    let powerUp = new PowerUp(theLevel, PowerUp.POWER_UP_BANANA);
    powerUp.location.set(2, 2);
    powerUp.isAlive = true;
    powerUp.prevLocation.set(1, 2);
    powerUp.direction = Direction.RIGHT;
    powerUp._destinationLocation.set(2, 1);
    powerUp.blink = true;
    powerUp._lifeExpirationTime = moment().add(2.9, "s");
    powerUp._blinkTime = moment().add(1.9, "s");
    let featureVector = powerUp.toFeatureVector();

    // CALL
    let length = PowerUp.featureVectorLength;

    // ASSERT
    expect(featureVector.length).toBe(length);
});