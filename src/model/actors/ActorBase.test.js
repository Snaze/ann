import ActorBase from "./ActorBase";
import BorderType from "../../model/BorderType";
import Direction from "../../utils/Direction";
import Level from "../../model/Level";
import Location from "../../model/Location";

it ("canMoveInDirection solid rightBorder works", () => {
    // SETUP
    let theLevel = new Level();
    theLevel.gameMatrix[0][0].setSolidBorder(BorderType.RIGHT, true);
    let actorBase = new ActorBase(theLevel);
    actorBase.location.set(0, 0);

    // CALL
    let moveRightResult = actorBase.canMoveInDirection(new Location(0, 0), Direction.RIGHT);
    let moveDownResult = actorBase.canMoveInDirection(new Location(0, 0), Direction.DOWN);

    // ASSERT
    expect(moveRightResult).toBe(false);
    expect(moveDownResult).toBe(true);
});

it ("canMoveInDirection partial rightBorder works", () => {
    // SETUP
    let theLevel = new Level();
    theLevel.gameMatrix[0][0].setPartialBorder(BorderType.RIGHT, true);
    let actorBase = new ActorBase(theLevel);
    actorBase.location.set(0, 0);

    // CALL
    let moveRightResult = actorBase.canMoveInDirection(new Location(0, 0), Direction.RIGHT);
    let moveDownResult = actorBase.canMoveInDirection(new Location(0, 0), Direction.DOWN);

    // ASSERT
    expect(moveRightResult).toBe(false);
    expect(moveDownResult).toBe(true);
});

it ("moveInDirection blocked works", () => {
    // SETUP
    let theLevel = new Level();
    theLevel.gameMatrix[0][0].setSolidBorder(BorderType.RIGHT, true);
    let actorBase = new ActorBase(theLevel);
    actorBase.location.set(0, 0);

    // CALL
    actorBase.moveInDirection(Direction.RIGHT);

    // ASSERT
    expect(actorBase.location.isEqualTo(0, 0)).toBe(true);
});

it ("moveInDirection not blocked works", () => {
    // SETUP
    let theLevel = new Level();
    theLevel.gameMatrix[0][0].setSolidBorder(BorderType.RIGHT, true);
    let actorBase = new ActorBase(theLevel);
    actorBase.location.set(0, 0);

    // CALL
    actorBase.moveInDirection(Direction.DOWN);

    // ASSERT
    expect(actorBase.location.isEqualTo(0, 1)).toBe(true);
});

it ("level change unwire events test", () => {
    // SETUP
    let theLevel = new Level();
    let actorBase = new ActorBase(theLevel);
    let newLevel = new Level();
    let fired = false;
    let theCallback = function (e) {
        fired = true;
    };
    actorBase.level = newLevel;
    actorBase.addOnChangeCallback(theCallback);

    // CALL
    theLevel.editMode = true;

    // ASSERT
    expect(fired).toBe(false);

    // CALL AGAIN
    newLevel.editMode = true;

    // ASSERT
    expect(fired).toBe(true);
});
