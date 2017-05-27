import Ghost from "./Ghost";
import Level from "../Level";

const moveInDirectionCallback_DoesNothing = function (newLocation) {
    // TO NOTHING
};

it ("Ghost constructor works", () => {

    let level = new Level();
    let ghost = new Ghost(level, Ghost.RED);


});

it ("Ghost set color works", () => {

    let level = new Level();
    let ghost = new Ghost(level, Ghost.RED);
    ghost.color = Ghost.BLUE;

    expect(ghost.color).toBe(Ghost.BLUE);

});

const testGhostConstructorForSpawnLocation = function (ghostColor, levelProp) {
    // SETUP
    let theLevel = new Level();
    theLevel[levelProp].set(1, 1);

    // CALL
    let theGhost = new Ghost(theLevel, ghostColor);

    // ASSERT
    expect(theGhost.location.isEqualTo(1, 1)).toBe(true);
    expect(theGhost._spawnLocation.isEqualTo(1, 1)).toBe(true);
};

it ("Ghost Constructor Sets initial location to redGhostSpawn", () => {
    testGhostConstructorForSpawnLocation(Ghost.RED, "ghostRedLocation");
});

it ("Ghost Constructor Sets initial location to blueGhostSpawn", () => {
    testGhostConstructorForSpawnLocation(Ghost.BLUE, "ghostBlueLocation");
});

it ("Ghost Constructor Sets initial location to pinkGhostSpawn", () => {
    testGhostConstructorForSpawnLocation(Ghost.PINK, "ghostPinkLocation");
});

it ("Ghost Constructor Sets initial location to orangeGhostSpawn", () => {
    testGhostConstructorForSpawnLocation(Ghost.ORANGE, "ghostOrangeLocation");
});

it ("moveBackToSpawn", () => {
    // SETUP
    let theLevel = new Level();
    theLevel.ghostRedLocation.set(1, 1);
    let ghost = new Ghost(theLevel, Ghost.RED);

    // CALL
    ghost.moveBackToSpawn();

    // ASSERT
    expect(ghost.location.equals(ghost._spawnLocation)).toBe(true);
    expect(ghost._spawnLocation.isEqualTo(1, 1)).toBe(true);
});

// TODO: Fill out movement unit tests (test timerTick(e))