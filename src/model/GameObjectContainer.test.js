import GameObjectContainer from "./GameObjectContainer";
import Level from "./Level";
import Location from "./Location";

it ("Constructor works", () => {
    let theLevel = new Level();
    new GameObjectContainer(theLevel);
});

it ("Get Level works", () => {
    // SETUP
    let theLevel = new Level();
    let goc = new GameObjectContainer(theLevel);

    // CALL
    let toCheck = goc.level;

    // ASSERT
    expect(theLevel === toCheck).toBe(true);
});

it ("Set Level works", () => {
    // SETUP
    let theLevel = new Level();
    let goc = new GameObjectContainer(theLevel);
    let level2 = new Level();

    // CALL
    goc.level = level2;

    // ASSERT
    expect(goc.player.level === level2).toBe(true);
    expect(goc.ghostRed.level === level2).toBe(true);
    expect(goc.ghostBlue.level === level2).toBe(true);
    expect(goc.ghostPink.level === level2).toBe(true);
    expect(goc.ghostOrange.level === level2).toBe(true);
    expect(goc.level === level2).toBe(true);
});

it ("moveAllBackToSpawn", () => {
    // SETUP
    let playerSpawnLocation = new Location(0, 0);
    let ghostRedLocation = new Location(1, 1);
    let ghostBlueLocation = new Location(2, 2);
    let ghostPinkLocation = new Location(3, 3);
    let ghostOrangeLocation = new Location(4, 4);

    let theLevel = new Level();
    theLevel.playerSpawnLocation.setWithLocation(playerSpawnLocation);
    theLevel.ghostRedLocation.setWithLocation(ghostRedLocation);
    theLevel.ghostBlueLocation.setWithLocation(ghostBlueLocation);
    theLevel.ghostPinkLocation.setWithLocation(ghostPinkLocation);
    theLevel.ghostOrangeLocation.setWithLocation(ghostOrangeLocation);

    let goc = new GameObjectContainer(theLevel);
    goc.player.location.set(10, 10);
    goc.ghostRed.location.set(11, 11);
    goc.ghostBlue.location.set(12, 12);
    goc.ghostPink.location.set(13, 13);
    goc.ghostOrange.location.set(14, 14);

    // CALL
    goc.moveAllBackToSpawn();

    // ASSERT
    expect(goc.player.location.equals(playerSpawnLocation)).toBe(true);
    expect(goc.ghostRed.location.equals(ghostRedLocation)).toBe(true);
    expect(goc.ghostBlue.location.equals(ghostBlueLocation)).toBe(true);
    expect(goc.ghostPink.location.equals(ghostPinkLocation)).toBe(true);
    expect(goc.ghostOrange.location.equals(ghostOrangeLocation)).toBe(true);
});