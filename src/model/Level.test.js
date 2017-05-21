import Level from "./Level";
import Cell from "./Cell";
import BorderType from "./BorderType";
import _ from "../../node_modules/lodash/lodash";

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