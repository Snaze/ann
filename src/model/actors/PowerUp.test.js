import PowerUp from "./PowerUp";
import Level from "../Level";

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