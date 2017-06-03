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