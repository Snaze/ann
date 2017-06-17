import StateHelper from "./StateHelper";
import Level from "../Level";
import Dot from "../Dot";
import GameObjectContainer from "../GameObjectContainer";
import PowerUp from "../actors/PowerUp";
import Direction from "../../utils/Direction";
import Location from "../Location";

const setTwoWayBorder = function (level, x, y, direction, value) {

    let cell = level.getCell(x, y);
    let otherLocation = new Location(x, y);
    otherLocation.moveInDirection(direction, level.height, level.width);
    let otherCell = level.getCellByLocation(otherLocation);

    cell.setSolidBorder(direction, value);
    otherCell.setSolidBorder(Direction.getOpposite(direction), value);

};

const createTestLevel = function () {
    let toRet = new Level(5, 5);

    setTwoWayBorder(toRet, 2, 0, Direction.LEFT, true);
    setTwoWayBorder(toRet, 2, 0, Direction.UP, true);
    setTwoWayBorder(toRet, 2, 0, Direction.RIGHT, true);
    toRet.getCell(2, 0).dotType = Dot.BIG;

    setTwoWayBorder(toRet, 2, 1, Direction.LEFT, true);
    setTwoWayBorder(toRet, 2, 1, Direction.RIGHT, true);
    toRet.getCell(2, 1).dotType = Dot.LITTLE;

    toRet.getCell(2, 2).isPlayerSpawn = true;

    setTwoWayBorder(toRet, 2, 3, Direction.LEFT, true);
    setTwoWayBorder(toRet, 2, 3, Direction.RIGHT, true);
    toRet.getCell(2, 3).dotType = Dot.LITTLE;

    setTwoWayBorder(toRet, 2, 4, Direction.LEFT, true);
    setTwoWayBorder(toRet, 2, 4, Direction.RIGHT, true);
    setTwoWayBorder(toRet, 2, 4, Direction.DOWN, true);
    toRet.getCell(2, 4).dotType = Dot.LITTLE;
    toRet.getCell(2, 4).isGhostRedSpawn = true;

    setTwoWayBorder(toRet, 1, 2, Direction.UP, true);
    setTwoWayBorder(toRet, 1, 2, Direction.DOWN, true);
    toRet.getCell(1, 2).solidBorder.top = true;
    toRet.getCell(1, 2).solidBorder.bottom = true;
    toRet.getCell(1, 2).dotType = Dot.LITTLE;

    setTwoWayBorder(toRet, 0, 2, Direction.UP, true);
    setTwoWayBorder(toRet, 0, 2, Direction.DOWN, true);
    setTwoWayBorder(toRet, 0, 2, Direction.LEFT, true);
    toRet.getCell(0, 2).dotType = Dot.LITTLE;

    setTwoWayBorder(toRet, 3, 2, Direction.UP, true);
    setTwoWayBorder(toRet, 3, 2, Direction.DOWN, true);
    toRet.getCell(3, 2).dotType = Dot.LITTLE;

    setTwoWayBorder(toRet, 4, 2, Direction.UP, true);
    setTwoWayBorder(toRet, 4, 2, Direction.DOWN, true);
    setTwoWayBorder(toRet, 4, 2, Direction.RIGHT, true);
    toRet.getCell(4, 2).dotType = Dot.LITTLE;

    return toRet;
};

const createTestGameObjectContainer = function () {
    let level = createTestLevel();
    let goc = new GameObjectContainer(level);
    goc.powerUp.location.set(4, 2);
    goc.powerUp.powerUpType = PowerUp.POWER_UP_STRAWBERRY;

    return goc;
};

it ("getGhostHeuristic max distance", () => {
    // SETUP
    let stateHelper = new StateHelper();
    let level = createTestLevel();
    let goc = new GameObjectContainer(level);

    // CALL
    let heuristic = stateHelper.getGhostHeuristic(stateHelper.searchDepth, goc.ghostRed, goc);

    // ASSERT
    expect(heuristic).toBe(0);
});

it ("getGhostHeuristic min distance", () => {
    // SETUP
    let stateHelper = new StateHelper();
    let level = createTestLevel();
    let goc = new GameObjectContainer(level);

    // CALL
    let heuristic = stateHelper.getGhostHeuristic(0, goc.ghostRed, goc);

    // ASSERT
    expect(heuristic).toBe(stateHelper.deathValue);
});

it ("getGhostHeuristic middle distance", () => {
    // SETUP
    let stateHelper = new StateHelper();
    let level = createTestLevel();
    let goc = new GameObjectContainer(level);

    // CALL
    let heuristic = stateHelper.getGhostHeuristic(Math.floor(stateHelper.searchDepth / 2), goc.ghostRed, goc);

    // ASSERT
    expect(heuristic < 0 && heuristic > stateHelper.deathValue).toBe(true);
});

it ("getPowerUpHeuristic max distance", () => {
    // SETUP
    let stateHelper = new StateHelper();


    // CALL
    let heuristic = stateHelper.getDiscountedHeuristic(stateHelper.searchDepth, 100);

    // ASSERT
    expect(heuristic).toBe(0);
});

it ("getPowerUpHeuristic min distance", () => {
    // SETUP
    let stateHelper = new StateHelper();

    // CALL
    let heuristic = stateHelper.getDiscountedHeuristic(0, 100);

    // ASSERT
    expect(heuristic).toBe(100);
});

it ("getPowerUpHeuristic mid distance", () => {
    // SETUP
    let stateHelper = new StateHelper();

    // CALL
    let heuristic = stateHelper.getDiscountedHeuristic(Math.floor(stateHelper.searchDepth / 2), 100);

    // ASSERT
    expect(heuristic > 0 && heuristic < 100).toBe(true);
});

it ("test getHeuristic", () => {
    // SETUP
    let goc = createTestGameObjectContainer();
    let stateHelper = new StateHelper();
    let startLocation = goc.player.location.clone().moveInDirection(Direction.UP, goc.level.width, goc.level.height);

    // CALL
    let topHeuristic = stateHelper.getHeuristic(goc, startLocation);

    // ASSERT
    expect(topHeuristic > 0).toBe(true);
});

it ("test getStateNumber", () => {
    // SETUP
    let goc = createTestGameObjectContainer();
    let stateHelper = new StateHelper();

    // CALL
    let theStateNumber = stateHelper.getStateNumber(goc);

    // ASSERT
    expect(theStateNumber > 0 && theStateNumber <= StateHelper.NUM_STATES).toBe(true);
});

it ("test getBinnedHeuristics", () => {
    // SETUP
    let stateHelper = new StateHelper();
    let heuristics = [null, 0, 0, null];
    let min = 0;
    let max = 0;

    // CALL
    let binnedHeuristics = stateHelper.getBinnedHeuristics(heuristics, min, max);

    // ASSERT
    binnedHeuristics.forEach(function (bh) {
        expect(bh !== "NaN").toBe(true);
    });
});