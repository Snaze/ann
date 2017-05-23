import Level from "./Level";
import Cell from "./Cell";
import BorderType from "./BorderType";
import Location from "./Location";
import Direction from "../utils/Direction";

it('addRow works', () => {
    let theLevel = new Level();
    let prevHeight = theLevel.height;

    theLevel.addRow();

    expect(theLevel._gameMatrix[prevHeight]).toEqual(expect.anything());
    expect(theLevel.height).toBe(prevHeight + 1);
});

it('removeRow works', () => {
    let theLevel = new Level();
    let prevHeight = theLevel.height;
    let prevLength = theLevel._gameMatrix.length;
    expect(prevHeight).toEqual(prevLength);

    theLevel.removeRow();

    expect(theLevel._gameMatrix.length).toEqual(prevLength - 1);
    expect(theLevel.height).toBe(prevHeight - 1);
});

it('addColumn works', () => {
    let theLevel = new Level();
    let prevWidth = theLevel.width;
    let prevLength = theLevel._gameMatrix[0].length;
    expect(prevWidth).toEqual(prevLength);

    theLevel.addColumn();

    expect(theLevel._gameMatrix[0].length).toEqual(prevWidth + 1);
    expect(theLevel.width).toBe(prevWidth + 1);
});

it('removeColumn works', () => {
    let theLevel = new Level();
    let prevWidth = theLevel.width;
    let prevLength = theLevel._gameMatrix[0].length;
    expect(prevWidth).toEqual(prevLength);

    theLevel.removeColumn();

    expect(theLevel._gameMatrix[0].length).toEqual(prevLength - 1);
    expect(theLevel.width).toBe(prevWidth - 1);
});

it('getCell works', () => {
    let theLevel = new Level();
    let cell0_0 = theLevel.getCell(0, 0);
    expect(cell0_0).toEqual(expect.any(Cell));
});

it("getCellById works", () => {
    let theLevel = new Level();
    let cell0_0 = theLevel.getCellById("0_0");
    expect(cell0_0).toEqual(expect.any(Cell));
});

it("fromJSON works", () => {
    let jsonObject = {
        "_width": 2,
        "_height": 2,
        "_gameMatrix": [
            [
                {
                    "_id": "0_0",
                    "_solidBorder": {
                        "_left": true,
                        "_top": true,
                        "_right": false,
                        "_bottom": false
                    },
                    "_partialBorder": {
                        "_left": false,
                        "_top": false,
                        "_right": false,
                        "_bottom": false
                    },
                    "_dotType": 0
                },
                {
                    "_id": "0_1",
                    "_solidBorder": {
                        "_left": false,
                        "_top": true,
                        "_right": true,
                        "_bottom": false
                    },
                    "_partialBorder": {
                        "_left": false,
                        "_top": false,
                        "_right": false,
                        "_bottom": false
                    },
                    "_dotType": 0
                }
            ],
            [
                {
                    "_id": "1_0",
                    "_solidBorder": {
                        "_left": true,
                        "_top": false,
                        "_right": false,
                        "_bottom": true
                    },
                    "_partialBorder": {
                        "_left": false,
                        "_top": false,
                        "_right": false,
                        "_bottom": false
                    },
                    "_dotType": 0
                },
                {
                    "_id": "1_1",
                    "_solidBorder": {
                        "_left": false,
                        "_top": false,
                        "_right": true,
                        "_bottom": true
                    },
                    "_partialBorder": {
                        "_left": false,
                        "_top": false,
                        "_right": false,
                        "_bottom": false
                    },
                    "_dotType": 0
                }
            ]
        ]
    };

    let theLevel = Level.fromJSON(jsonObject);
    expect(theLevel.width).toBe(2);
    expect(theLevel.height).toBe(2);
    // TODO: Perform better checks in here
});

it("mirrorHorizontally", () => {
    let theLevel = new Level(1, 1);

    theLevel.gameMatrix[0][0].setSolidBorder(BorderType.LEFT, true);
    theLevel.gameMatrix[0][0].setSolidBorder(BorderType.TOP, true);
    theLevel.gameMatrix[0][0].setSolidBorder(BorderType.RIGHT, true);
    theLevel.gameMatrix[0][0].setSolidBorder(BorderType.BOTTOM, true);

    theLevel.mirrorHorizontally();

    expect(theLevel.gameMatrix[0][1].getSolidBorder(BorderType.LEFT)).toBe(true);
    expect(theLevel.gameMatrix[0][1].getSolidBorder(BorderType.TOP)).toBe(true);
    expect(theLevel.gameMatrix[0][1].getSolidBorder(BorderType.RIGHT)).toBe(true);
    expect(theLevel.gameMatrix[0][1].getSolidBorder(BorderType.BOTTOM)).toBe(true);
});

it("spawnChangedCallback works correctly", () => {

    // SETUP
    let theLevel = new Level(10, 1);
    theLevel.gameMatrix[0][0].isPlayerSpawn = true;
    theLevel.gameMatrix[0][1].isGhostRedSpawn = true;
    theLevel.gameMatrix[0][2].isGhostBlueSpawn = true;
    theLevel.gameMatrix[0][3].isGhostOrangeSpawn = true;
    theLevel.gameMatrix[0][4].isGhostPinkSpawn = true;

    expect(theLevel.playerSpawnLocation.isEqualTo(0, 0)).toBe(true);
    expect(theLevel.ghostRedLocation.isEqualTo(1, 0)).toBe(true);
    expect(theLevel.ghostBlueLocation.isEqualTo(2, 0)).toBe(true);
    expect(theLevel.ghostOrangeLocation.isEqualTo(3, 0)).toBe(true);
    expect(theLevel.ghostPinkLocation.isEqualTo(4, 0)).toBe(true);

    // CALL
    theLevel.gameMatrix[0][5].isPlayerSpawn = true;
    theLevel.gameMatrix[0][6].isGhostRedSpawn = true;
    theLevel.gameMatrix[0][7].isGhostBlueSpawn = true;
    theLevel.gameMatrix[0][8].isGhostOrangeSpawn = true;
    theLevel.gameMatrix[0][9].isGhostPinkSpawn = true;

    // ASSERT
    expect(theLevel.gameMatrix[0][0].isPlayerSpawn).toBe(false);
    expect(theLevel.gameMatrix[0][1].isGhostRedSpawn).toBe(false);
    expect(theLevel.gameMatrix[0][2].isGhostBlueSpawn).toBe(false);
    expect(theLevel.gameMatrix[0][3].isGhostOrangeSpawn).toBe(false);
    expect(theLevel.gameMatrix[0][4].isGhostPinkSpawn).toBe(false);

    expect(theLevel.gameMatrix[0][5].isPlayerSpawn).toBe(true);
    expect(theLevel.gameMatrix[0][6].isGhostRedSpawn).toBe(true);
    expect(theLevel.gameMatrix[0][7].isGhostBlueSpawn).toBe(true);
    expect(theLevel.gameMatrix[0][8].isGhostOrangeSpawn).toBe(true);
    expect(theLevel.gameMatrix[0][9].isGhostPinkSpawn).toBe(true);

    expect(theLevel.playerSpawnLocation.isEqualTo(5, 0)).toBe(true);
    expect(theLevel.ghostRedLocation.isEqualTo(6, 0)).toBe(true);
    expect(theLevel.ghostBlueLocation.isEqualTo(7, 0)).toBe(true);
    expect(theLevel.ghostOrangeLocation.isEqualTo(8, 0)).toBe(true);
    expect(theLevel.ghostPinkLocation.isEqualTo(9, 0)).toBe(true);

});

it("selected change works correctly", () => {

    // SETUP
    let theLevel = new Level(3, 1);

    // CALL
    theLevel.gameMatrix[0][0].selected = true;
    theLevel.gameMatrix[0][1].selected = false;
    theLevel.gameMatrix[0][2].selected = false;

    // ASSERT
    expect(theLevel.gameMatrix[0][0].selected).toBe(true);
    expect(theLevel.gameMatrix[0][1].selected).toBe(false);
    expect(theLevel.gameMatrix[0][2].selected).toBe(false);
    expect(theLevel.selectedLocation.isEqualTo(0, 0)).toBe(true);


    // CALL
    theLevel.gameMatrix[0][2].selected = true;

    // ASSERT
    expect(theLevel.gameMatrix[0][0].selected).toBe(false);
    expect(theLevel.gameMatrix[0][1].selected).toBe(false);
    expect(theLevel.gameMatrix[0][2].selected).toBe(true);
    expect(theLevel.selectedLocation.isEqualTo(2, 0)).toBe(true);

});

it("setSelectedLocation", () => {

    // SETUP
    let theLevel = new Level(3, 1);

    // CALL
    theLevel.gameMatrix[0][0].selected = true;
    theLevel.gameMatrix[0][1].selected = false;
    theLevel.gameMatrix[0][2].selected = false;

    // ASSERT
    expect(theLevel.gameMatrix[0][0].selected).toBe(true);
    expect(theLevel.gameMatrix[0][1].selected).toBe(false);
    expect(theLevel.gameMatrix[0][2].selected).toBe(false);
    expect(theLevel.selectedLocation.isEqualTo(0, 0)).toBe(true);


    // CALL
    theLevel.setSelectedLocation(new Location(2, 0));

    // ASSERT
    expect(theLevel.gameMatrix[0][0].selected).toBe(false);
    expect(theLevel.gameMatrix[0][1].selected).toBe(false);
    expect(theLevel.gameMatrix[0][2].selected).toBe(true);
    expect(theLevel.selectedLocation.isEqualTo(2, 0)).toBe(true);

});

it ("test setSpawnValue - Simple switch cell", () => {
    // SETUP
    let theLevel = new Level();

    theLevel._playerSpawnLocation.set(1, 1);
    theLevel._player.location.set(1, 1);
    theLevel.gameMatrix[1][1]._isPlayerSpawn = true;

    // CALL
    theLevel._setSpawnValue("_isPlayerSpawn", new Location(2, 2), true);

    // ASSERT
    expect(theLevel._playerSpawnLocation.isEqualTo(2, 2)).toBe(true);
    expect(theLevel._player.location.isEqualTo(2, 2)).toBe(true);
    expect(theLevel.gameMatrix[1][1]._isPlayerSpawn).toBe(false);
    expect(theLevel.gameMatrix[2][2]._isPlayerSpawn).toBe(true);
});

it ("test setSpawnValue - Switch Spawn Type of Same Cell", () => {
    // SETUP
    let theLevel = new Level();

    theLevel._playerSpawnLocation.set(1, 1);
    theLevel._player.location.set(1, 1);
    theLevel.gameMatrix[1][1]._isPlayerSpawn = true;

    theLevel._ghostRedLocation.set(2, 2);
    theLevel._ghostRed.location.set(2, 2);
    theLevel.gameMatrix[2][2]._isGhostRedSpawn = true;

    // CALL
    theLevel._setSpawnValue("_isGhostRedSpawn", new Location(1, 1), true);

    // ASSERT
    expect(theLevel._playerSpawnLocation.isEqualTo(-1, -1)).toBe(true);
    expect(theLevel._player.location.isEqualTo(-1, -1)).toBe(true);
    expect(theLevel.gameMatrix[1][1]._isPlayerSpawn).toBe(false);

    expect(theLevel._ghostRedLocation.isEqualTo(1, 1)).toBe(true);
    expect(theLevel._ghostRed.location.isEqualTo(1, 1)).toBe(true);
    expect(theLevel.gameMatrix[1][1]._isGhostRedSpawn).toBe(true);
    expect(theLevel.gameMatrix[2][2]._isGhostRedSpawn).toBe(false);
});

it ("test setSpawnValue - Simple Uncheck", () => {
    // SETUP
    let theLevel = new Level();

    theLevel._playerSpawnLocation.set(1, 1);
    theLevel._player.location.set(1, 1);
    theLevel.gameMatrix[1][1]._isPlayerSpawn = true;

    theLevel._ghostRedLocation.set(3, 3);
    theLevel._ghostRed.location.set(3, 3);
    theLevel.gameMatrix[3][3]._isGhostRedSpawn = true;

    // CALL
    theLevel._setSpawnValue("_isPlayerSpawn", new Location(2, 2), false);

    // ASSERT
    expect(theLevel._playerSpawnLocation.isEqualTo(2, 2)).toBe(false);
    expect(theLevel._player.location.isEqualTo(2, 2)).toBe(false);
    expect(theLevel.gameMatrix[1][1]._isPlayerSpawn).toBe(false);
    expect(theLevel.gameMatrix[2][2]._isPlayerSpawn).toBe(false);

    expect(theLevel._ghostRedLocation.isEqualTo(3, 3)).toBe(true);
    expect(theLevel._ghostRed.location.isEqualTo(3, 3)).toBe(true);
    expect(theLevel.gameMatrix[3][3]._isGhostRedSpawn).toBe(true);
});

it ("test removeSpawnLocation", () => {
    // SETUP
    let theLevel = new Level();

    theLevel._playerSpawnLocation.set(1, 1);
    theLevel._player.location.set(1, 1);
    theLevel.gameMatrix[1][1]._isPlayerSpawn = true;
    theLevel._ghostRedLocation.set(2, 2);
    theLevel._ghostRed.location.set(2, 2);
    theLevel.gameMatrix[2][2]._isGhostRedSpawn = true;
    theLevel._ghostBlueLocation.set(3, 3);
    theLevel._ghostBlue.location.set(3, 3);
    theLevel.gameMatrix[3][3]._isGhostBlueSpawn = true;
    theLevel._ghostPinkLocation.set(4, 4);
    theLevel._ghostPink.location.set(4, 4);
    theLevel.gameMatrix[4][4]._isGhostPinkSpawn = true;
    theLevel._ghostOrangeLocation.set(5, 5);
    theLevel._ghostOrange.location.set(5, 5);
    theLevel.gameMatrix[5][5]._isGhostOrangeSpawn = true;

    // CALL
    theLevel._removeSpawnLocation(new Location(1, 1));

    // ASSERT
    expect(theLevel._playerSpawnLocation.isEqualTo(-1, -1)).toBe(true);
    expect(theLevel._player.location.isEqualTo(-1, -1)).toBe(true);
    expect(theLevel.gameMatrix[1][1]._isPlayerSpawn).toBe(false);

    expect(theLevel._ghostRedLocation.isEqualTo(2, 2)).toBe(true);
    expect(theLevel._ghostRed.location.isEqualTo(2, 2)).toBe(true);
    expect(theLevel.gameMatrix[2][2]._isGhostRedSpawn).toBe(true);

    expect(theLevel._ghostBlueLocation.isEqualTo(3, 3)).toBe(true);
    expect(theLevel._ghostBlue.location.isEqualTo(3, 3)).toBe(true);
    expect(theLevel.gameMatrix[3][3]._isGhostBlueSpawn).toBe(true);

    expect(theLevel._ghostPinkLocation.isEqualTo(4, 4)).toBe(true);
    expect(theLevel._ghostPink.location.isEqualTo(4, 4)).toBe(true);
    expect(theLevel.gameMatrix[4][4]._isGhostPinkSpawn).toBe(true);

    expect(theLevel._ghostOrangeLocation.isEqualTo(5, 5)).toBe(true);
    expect(theLevel._ghostOrange.location.isEqualTo(5, 5)).toBe(true);
    expect(theLevel.gameMatrix[5][5]._isGhostOrangeSpawn).toBe(true);

    // CALL AGAIN
    theLevel._removeSpawnLocation(new Location(2, 2));
    theLevel._removeSpawnLocation(new Location(3, 3));
    theLevel._removeSpawnLocation(new Location(4, 4));
    theLevel._removeSpawnLocation(new Location(5, 5));

    // ASSERT
    expect(theLevel._playerSpawnLocation.isEqualTo(-1, -1)).toBe(true);
    expect(theLevel._player.location.isEqualTo(-1, -1)).toBe(true);
    expect(theLevel.gameMatrix[1][1]._isPlayerSpawn).toBe(false);

    expect(theLevel._ghostRedLocation.isEqualTo(-1, -1)).toBe(true);
    expect(theLevel._ghostRed.location.isEqualTo(-1, -1)).toBe(true);
    expect(theLevel.gameMatrix[2][2]._isGhostRedSpawn).toBe(false);

    expect(theLevel._ghostBlueLocation.isEqualTo(-1, -1)).toBe(true);
    expect(theLevel._ghostBlue.location.isEqualTo(-1, -1)).toBe(true);
    expect(theLevel.gameMatrix[3][3]._isGhostBlueSpawn).toBe(false);

    expect(theLevel._ghostPinkLocation.isEqualTo(-1, -1)).toBe(true);
    expect(theLevel._ghostPink.location.isEqualTo(-1, -1)).toBe(true);
    expect(theLevel.gameMatrix[4][4]._isGhostPinkSpawn).toBe(false);

    expect(theLevel._ghostOrangeLocation.isEqualTo(-1, -1)).toBe(true);
    expect(theLevel._ghostOrange.location.isEqualTo(-1, -1)).toBe(true);
    expect(theLevel.gameMatrix[5][5]._isGhostOrangeSpawn).toBe(false);
});

it ("canMoveInDirection solid rightBorder works", () => {
    // SETUP
    let theLevel = new Level();
    theLevel.gameMatrix[0][0].setSolidBorder(BorderType.RIGHT, true);

    // CALL
    let moveRightResult = theLevel.canMoveInDirection(new Location(0, 0), Direction.RIGHT);
    let moveDownResult = theLevel.canMoveInDirection(new Location(0, 0), Direction.DOWN);

    // ASSERT
    expect(moveRightResult).toBe(false);
    expect(moveDownResult).toBe(true);
});

it ("canMoveInDirection partial rightBorder works", () => {
    // SETUP
    let theLevel = new Level();
    theLevel.gameMatrix[0][0].setPartialBorder(BorderType.RIGHT, true);

    // CALL
    let moveRightResult = theLevel.canMoveInDirection(new Location(0, 0), Direction.RIGHT);
    let moveDownResult = theLevel.canMoveInDirection(new Location(0, 0), Direction.DOWN);

    // ASSERT
    expect(moveRightResult).toBe(false);
    expect(moveDownResult).toBe(true);
});

it ("moveInDirection blocked works", () => {
    // SETUP
    let theLevel = new Level();
    theLevel.gameMatrix[0][0].setSolidBorder(BorderType.RIGHT, true);
    theLevel.player.location.set(0, 0);

    // CALL
    theLevel.moveInDirection(theLevel.player, Direction.RIGHT);

    // ASSERT
    expect(theLevel.player.location.isEqualTo(0, 0)).toBe(true);
});

it ("moveInDirection not blocked works", () => {
    // SETUP
    let theLevel = new Level();
    theLevel.gameMatrix[0][0].setSolidBorder(BorderType.RIGHT, true);
    theLevel.player.location.set(0, 0);

    // CALL
    theLevel.moveInDirection(theLevel.player, Direction.DOWN);

    // ASSERT
    expect(theLevel.player.location.isEqualTo(0, 1)).toBe(true);
});