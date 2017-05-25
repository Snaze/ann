import ActorBase from "./ActorBase";
import BorderType from "../../model/BorderType";
import Direction from "../../utils/Direction";
import Level from "../../model/Level";
import Location from "../../model/Location";

it ("canMoveInDirection solid rightBorder works", () => {
    // SETUP
    let theLevel = new Level();
    theLevel.gameMatrix[0][0].setSolidBorder(BorderType.RIGHT, true);
    let actorBase = new ActorBase(Direction.LEFT, new Location(0, 0), theLevel);

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
    let actorBase = new ActorBase(Direction.LEFT, new Location(0, 0), theLevel);

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
    theLevel.player.location.set(0, 0);
    let actorBase = new ActorBase(Direction.LEFT, new Location(0, 0), theLevel);

    // CALL
    actorBase.moveInDirection(Direction.RIGHT);

    // ASSERT
    expect(actorBase.location.isEqualTo(0, 0)).toBe(true);
});

it ("moveInDirection not blocked works", () => {
    // SETUP
    let theLevel = new Level();
    theLevel.gameMatrix[0][0].setSolidBorder(BorderType.RIGHT, true);
    theLevel.player.location.set(0, 0);
    let actorBase = new ActorBase(Direction.LEFT, new Location(0, 0), theLevel);

    // CALL
    actorBase.moveInDirection(Direction.DOWN);

    // ASSERT
    expect(actorBase.location.isEqualTo(0, 1)).toBe(true);
});