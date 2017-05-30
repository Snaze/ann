import GhostBrainStrategyWander from "./GhostBrainStrategyWander";
import Location from "../../../Location";
import Level from "../../../Level";

it ("GhostBrainStrategyWander._getRandomLocation", () => {
    // SETUP
    // let strategy = new GhostBrainStrategyWander();
    let currentLocation = new Location(0, 0);
    let level = new Level();

    // CALL
    let randomLocation = GhostBrainStrategyWander._getRandomLocation(currentLocation, level);

    // SETUP
    expect(!randomLocation.equals(currentLocation)).toBe(true);
    expect(randomLocation.x < level.width).toBe(true);
    expect(randomLocation.x >= 0).toBe(true);
    expect(randomLocation.y < level.height).toBe(true);
    expect(randomLocation.y >= 0).toBe(true);
});