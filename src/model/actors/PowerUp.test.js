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