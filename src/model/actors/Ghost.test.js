import Ghost from "./Ghost";
import Level from "../Level";
import Player from "./Player";
import GhostBrainManual from "./GhostBrains/GhostBrainManual";

const moveInDirectionCallback_DoesNothing = function (newLocation) {
    // TO NOTHING
};

it ("Ghost constructor works", () => {

    let level = new Level();
    let player = new Player(level, Player.MR_PAC_MAN);
    let ghost = new Ghost(level, Ghost.RED, player);


});

const testGhostConstructorForSpawnLocation = function (ghostColor, levelProp) {
    // SETUP
    let theLevel = new Level();
    theLevel[levelProp].set(1, 1);
    let player = new Player(theLevel, Player.MR_PAC_MAN);


    // CALL
    let theGhost = new Ghost(theLevel, ghostColor, player);

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
    let player = new Player(theLevel, Player.MR_PAC_MAN);
    let ghost = new Ghost(theLevel, Ghost.RED, player);

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
    let player = new Player(theLevel, Player.MR_PAC_MAN);

    let ghost = new Ghost(theLevel, ghostColor, player);
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

it ("ghost timer tick doesn't bomb is location is invalid", () => {
    // SETUP
    let theLevel = new Level();
    theLevel.playerSpawnLocation.set(-1, -1);
    theLevel.ghostRedLocation.set(-1, -1);
    let player = new Player(theLevel, Player.MR_PAC_MAN);
    let ghost = new Ghost(theLevel, Ghost.RED, player);

    // CALL
    ghost.timerTick({});
});

// TODO: Fill out movement unit tests (test timerTick(e))

it ("reset locations when setting a new level", () => {
    // SETUP
    let theLevel = new Level(3, 3);
    theLevel.ghostRedLocation.set(2, 2);
    let thePlayer = new Player(theLevel, Player.MR_PAC_MAN);
    let ghostRed = new Ghost(theLevel, Ghost.RED, thePlayer);
    let secondLevel = new Level(3, 3);
    secondLevel.ghostRedLocation.set(1, 1);

    // CALL
    ghostRed.level = secondLevel;

    // ASSERT
    expect(ghostRed.location.isEqualTo(1, 1)).toBe(true);
    expect(ghostRed.spawnLocation.isEqualTo(1, 1)).toBe(true);
    expect(ghostRed.prevLocation.isEqualTo(1, 1)).toBe(true);
});

it ("reset ghost brain when setting a new level", () => {
    // SETUP
    let theLevel = new Level(3, 3);
    theLevel.ghostRedLocation.set(2, 2);
    let thePlayer = new Player(theLevel, Player.MR_PAC_MAN);
    let ghostRed = new Ghost(theLevel, Ghost.RED, thePlayer);
    ghostRed._ghostBrain.enterState(GhostBrainManual.GHOST_STATE_ATTACK);
    let secondLevel = new Level(3, 3);
    secondLevel.ghostRedLocation.set(1, 1);

    // CALL
    ghostRed.level = secondLevel;

    // ASSERT
    expect(ghostRed._ghostBrain._currentState === GhostBrainManual.GHOST_STATE_HOLDING_PIN).toBe(true);

});