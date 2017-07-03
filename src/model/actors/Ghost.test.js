import Ghost from "./Ghost";
import Level from "../Level";
import Player from "./Player";
import GhostBrainManual from "./GhostBrains/GhostBrainManual";
import Direction from "../../utils/Direction";
import Location from "../Location";

it ("Ghost constructor works", () => {

    let level = new Level();
    let player = new Player(level, Player.MR_PAC_MAN);
    let ghost = new Ghost(level, Ghost.RED, player);

    expect(ghost !== null).toBe(true);

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

it ("toFeatureVector", () => {
    // SETUP
    let theLevel = new Level(3, 3);
    theLevel.ghostRedLocation.set(2, 2);
    let thePlayer = new Player(theLevel, Player.MR_PAC_MAN);
    let ghostRed = new Ghost(theLevel, Ghost.RED, thePlayer);
    ghostRed.prevLocation.set(2, 2);
    ghostRed.location.set(2, 1);
    ghostRed.isAlive = true;
    ghostRed.direction = Direction.UP;
    ghostRed._prevKilledByAttackModeId = 3;
    ghostRed.brainState = GhostBrainManual.GHOST_STATE_WANDER;
    ghostRed._ghostBrain.destinationLocation = new Location(2, 0);

    // toRet.push(this.location.x);                    // location                 0
    // toRet.push(this.location.y);                    // location                 1
    // toRet.push(delta.x);                            //                          2
    // toRet.push(delta.y);                            //                          3
    // toRet.push(this.isAlive ? 1 : 0);               // isAlive                  4
    // toRet.push(this.prevLocation.x);                // prevLocation             5
    // toRet.push(this.prevLocation.y);                // prevLocation             6
    // toRet.push(Direction.directionToDecimal(this.direction)); // direction      7
    // toRet.push(this._prevKilledByAttackModeId);     // prevKilledByAttackModeId 8
    // toRet.push(this.brainState);                    // brainState               9
    // toRet.push(this._ghostBrain.destinationLocation.x); // destinationLocationX 10
    // toRet.push(this._ghostBrain.destinationLocation.y); // destinationLocationY 11

    // CALL
    let featureVector = ghostRed.toFeatureVector();

    // ASSERT
    expect(featureVector.length).toBe(12);
    expect(featureVector[0]).toBe(2);
    expect(featureVector[1]).toBe(1);
    expect(featureVector[2]).toBe(0);
    expect(featureVector[3]).toBe(-1);
    expect(featureVector[4]).toBe(1);
    expect(featureVector[5]).toBe(2);
    expect(featureVector[6]).toBe(2);
    expect(featureVector[7]).toBe(Direction.directionToDecimal(Direction.UP));
    expect(featureVector[8]).toBe(3);
    expect(featureVector[9]).toBe(GhostBrainManual.GHOST_STATE_WANDER);
    expect(featureVector[10]).toBe(2);
    expect(featureVector[11]).toBe(0);

});

it ("setFeatureVector", () => {
    // SETUP
    let theLevel = new Level(3, 3);
    theLevel.ghostRedLocation.set(2, 2);
    let thePlayer = new Player(theLevel, Player.MR_PAC_MAN);
    let ghostRed = new Ghost(theLevel, Ghost.RED, thePlayer);
    ghostRed.prevLocation.set(2, 2);
    ghostRed.location.set(2, 1);
    ghostRed.isAlive = true;
    ghostRed.direction = Direction.UP;
    ghostRed._prevKilledByAttackModeId = 3;
    ghostRed.brainState = GhostBrainManual.GHOST_STATE_WANDER;
    ghostRed._ghostBrain.destinationLocation = new Location(2, 0);
    let featureVector = ghostRed.toFeatureVector();
    let otherGhost = new Ghost(theLevel, Ghost.BLUE, thePlayer);

    // CALL
    otherGhost.setFeatureVector(featureVector);

    // ASSERT
    expect(otherGhost.location.equals(ghostRed.location)).toBe(true);
    expect(otherGhost.prevLocation.equals(ghostRed.prevLocation)).toBe(true);
    expect(otherGhost.isAlive).toBe(ghostRed.isAlive);
    expect(otherGhost.direction).toBe(ghostRed.direction);
    expect(otherGhost._prevKilledByAttackModeId).toBe(ghostRed._prevKilledByAttackModeId);
    expect(otherGhost.brainState).toBe(ghostRed.brainState);
    expect(otherGhost._ghostBrain.destinationLocation.equals(ghostRed._ghostBrain.destinationLocation)).toBe(true);

});

it ("featureVectorLength", () => {
    // SETUP
    let theLevel = new Level(3, 3);
    theLevel.ghostRedLocation.set(2, 2);
    let thePlayer = new Player(theLevel, Player.MR_PAC_MAN);
    let ghostRed = new Ghost(theLevel, Ghost.RED, thePlayer);
    ghostRed.prevLocation.set(2, 2);
    ghostRed.location.set(2, 1);
    ghostRed.isAlive = true;
    ghostRed.direction = Direction.UP;
    ghostRed._prevKilledByAttackModeId = 3;
    ghostRed.brainState = GhostBrainManual.GHOST_STATE_WANDER;
    ghostRed._ghostBrain.destinationLocation = new Location(2, 0);

    let featureVector = ghostRed.toFeatureVector();

    // CALL
    let length = Ghost.featureVectorLength;

    // ASSERT
    expect(length).toBe(featureVector.length);

});