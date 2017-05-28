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

const testGhostSpawnLocationChange = function (ghostColor, propName, editMode = false) {
    // SETUP
    let theLevel = new Level();
    theLevel[propName].set(1, 1);
    theLevel.editMode = editMode;
    let ghost = new Ghost(theLevel, ghostColor);
    ghost.editMode = editMode;
    let originalLocation = ghost.location.clone();

    // CALL
    theLevel[propName].set(1, 2);

    // ASSERT
    expect(ghost._spawnLocation.isEqualTo(1, 2)).toBe(true);
    if (!editMode) {
        expect(ghost.location.equals(originalLocation)).toBe(true);
    } else {
        expect(ghost.location.isEqualTo(1, 2)).toBe(true);
    }
};

it ("ghost spawn location updates on _nestedDataSourceChanged", () => {
    testGhostSpawnLocationChange(Ghost.RED, "ghostRedLocation", false);
    testGhostSpawnLocationChange(Ghost.BLUE, "ghostBlueLocation", false);
    testGhostSpawnLocationChange(Ghost.ORANGE, "ghostOrangeLocation", false);
    testGhostSpawnLocationChange(Ghost.PINK, "ghostPinkLocation", false);
});

it ("ghost spawn location updates on _nestedDataSourceChanged in editMode", () => {
    testGhostSpawnLocationChange(Ghost.RED, "ghostRedLocation", true);
    testGhostSpawnLocationChange(Ghost.BLUE, "ghostBlueLocation", true);
    testGhostSpawnLocationChange(Ghost.ORANGE, "ghostOrangeLocation", true);
    testGhostSpawnLocationChange(Ghost.PINK, "ghostPinkLocation", true);
});



// TODO: Fill out movement unit tests (test timerTick(e))