import Level from "./Level";
import Cell from "./Cell";
import Border from "./Border";
import BorderType from "./BorderType";
import Location from "./Location";
import _ from "../../node_modules/lodash/lodash";

it('addRow works', () => {
    let theLevel = new Level();
    let prevHeight = theLevel.height;

    theLevel.addRow();

    expect(theLevel._gameMatrix[prevHeight]).toEqual(expect.anything());
    expect(theLevel.height).toBe(prevHeight + 1);
});


it('addRow wires up events', () => {
    // SETUP
    let theLevel = new Level();
    let prevHeight = theLevel.height;

    let numFired = 0;
    let theCallback = function(e) {
        if (_.endsWith(e.source, "selected") && e.newValue) {
            numFired++;
        }
        // console.log(e.source);
    };
    theLevel.addOnChangeCallback(theCallback);


    // CALL
    theLevel.addRow();

    for (let x = 0; x < theLevel.width; x++) {
        theLevel.getCell(x, prevHeight).selected = true;
    }

    // ASSERT
    expect(numFired).toBe(theLevel.width);
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

it('removeRow unwires events', () => {
    // SETUP
    let theLevel = new Level();
    let prevHeight = theLevel.height;
    let lastCell = theLevel.getCell(0, prevHeight - 1);
    let fired = false;
    let theCallback = function (e) {
        fired = true;
    };

    theLevel.removeRow();
    theLevel.addOnChangeCallback(theCallback);

    // CALL
    lastCell.selected = true;

    // ASSERT
    expect(fired).toBe(false);
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

it('addColumn wires up events', () => {
    // SETUP
    let theLevel = new Level();
    let prevWidth = theLevel.width;

    let numFired = 0;
    let theCallback = function(e) {
        if (_.endsWith(e.source, "selected") && e.newValue) {
            numFired++;
        }
        // console.log(e.source);
    };
    theLevel.addOnChangeCallback(theCallback);


    // CALL
    theLevel.addColumn();

    for (let y = 0; y < theLevel.height; y++) {
        theLevel.getCell(prevWidth, y).selected = true;
    }

    // ASSERT
    expect(numFired).toBe(theLevel.height);
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

it('removeColumn unwires events', () => {
    // SETUP
    let theLevel = new Level();
    let prevWidth = theLevel.width;
    let lastCell = theLevel.getCell(prevWidth - 1, 0);
    let fired = false;
    let theCallback = function (e) {
        fired = true;
    };

    theLevel.removeColumn();
    theLevel.addOnChangeCallback(theCallback);

    // CALL
    lastCell.selected = true;

    // ASSERT
    expect(fired).toBe(false);
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

it("mirrorVertically", () => {
    let theLevel = new Level(1, 1);

    theLevel.gameMatrix[0][0].setSolidBorder(BorderType.LEFT, true);
    theLevel.gameMatrix[0][0].setSolidBorder(BorderType.TOP, true);
    theLevel.gameMatrix[0][0].setSolidBorder(BorderType.RIGHT, true);
    theLevel.gameMatrix[0][0].setSolidBorder(BorderType.BOTTOM, true);

    theLevel.mirrorVertically();

    expect(theLevel.gameMatrix[1][0].getSolidBorder(BorderType.LEFT)).toBe(true);
    expect(theLevel.gameMatrix[1][0].getSolidBorder(BorderType.TOP)).toBe(true);
    expect(theLevel.gameMatrix[1][0].getSolidBorder(BorderType.RIGHT)).toBe(true);
    expect(theLevel.gameMatrix[1][0].getSolidBorder(BorderType.BOTTOM)).toBe(true);
});

it("mirrorVertically Callback works on newly created cells", () => {
    // SETUP
    let theLevel = new Level(1, 1);
    let theCallbackFired = false;
    let theCallback = function(e) {
        theCallbackFired = true;
    };
    theLevel.addOnChangeCallback(theCallback);
    theLevel.mirrorVertically();

    // CALL
    theLevel.getCell(0, 1).selected = true;

    // ASSERT
    expect(theCallbackFired).toBe(true);
});

it("mirrorHorizontally Callback works on newly created cells", () => {
    // SETUP
    let theLevel = new Level(1, 1);
    let theCallbackFired = false;
    let theCallback = function(e) {
        theCallbackFired = true;
    };
    theLevel.addOnChangeCallback(theCallback);
    theLevel.mirrorHorizontally();

    // CALL
    theLevel.getCell(1, 0).selected = true;

    // ASSERT
    expect(theCallbackFired).toBe(true);
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
    expect(theLevel._selectedLocation.isEqualTo(0, 0)).toBe(true);


    // CALL
    theLevel.gameMatrix[0][2].selected = true;

    // ASSERT
    expect(theLevel.gameMatrix[0][0].selected).toBe(false);
    expect(theLevel.gameMatrix[0][1].selected).toBe(false);
    expect(theLevel.gameMatrix[0][2].selected).toBe(true);
    expect(theLevel._selectedLocation.isEqualTo(2, 0)).toBe(true);

});

it("change selected location", () => {

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
    expect(theLevel._selectedLocation.isEqualTo(0, 0)).toBe(true);


    // CALL
    theLevel.getCell(2, 0).selected = true;

    // ASSERT
    expect(theLevel.gameMatrix[0][0].selected).toBe(false);
    expect(theLevel.gameMatrix[0][1].selected).toBe(false);
    expect(theLevel.gameMatrix[0][2].selected).toBe(true);
    expect(theLevel._selectedLocation.isEqualTo(2, 0)).toBe(true);

});

it ("cell_0_0.isPlayerSpawn set to true -- simple case", () => {
    // SETUP
    let myLevel = new Level(5, 1);
    let cell_0_0 = myLevel.getCell(0, 0);

    // CALL
    cell_0_0.isPlayerSpawn = true;

    // ASSERT
    expect(myLevel.playerSpawnLocation.isEqualTo(0, 0)).toBe(true);
    expect(myLevel.ghostRedLocation.isEqualTo(-1, -1)).toBe(true);
    expect(myLevel.ghostBlueLocation.isEqualTo(-1, -1)).toBe(true);
    expect(myLevel.ghostOrangeLocation.isEqualTo(-1, -1)).toBe(true);
    expect(myLevel.ghostPinkLocation.isEqualTo(-1, -1)).toBe(true);
    expect(myLevel.getCell(0, 0).isPlayerSpawn).toBe(true);
    expect(myLevel.getCell(1, 0).isPlayerSpawn).toBe(false);
    expect(myLevel.getCell(2, 0).isPlayerSpawn).toBe(false);
    expect(myLevel.getCell(3, 0).isPlayerSpawn).toBe(false);
    expect(myLevel.getCell(4, 0).isPlayerSpawn).toBe(false);
});

it ("cell_0_0.isPlayerSpawn set to true -- remove existing value", () => {
    // SETUP
    let myLevel = new Level(5, 1);
    let cell_0_0 = myLevel.getCell(0, 0);
    let cell_1_0 = myLevel.getCell(1, 0);
    cell_1_0._isPlayerSpawn = true;
    myLevel._playerSpawnLocation.set(1, 0);

    // CALL
    cell_0_0.isPlayerSpawn = true;

    // ASSERT
    expect(myLevel.playerSpawnLocation.isEqualTo(0, 0)).toBe(true);
    expect(myLevel.ghostRedLocation.isEqualTo(-1, -1)).toBe(true);
    expect(myLevel.ghostBlueLocation.isEqualTo(-1, -1)).toBe(true);
    expect(myLevel.ghostOrangeLocation.isEqualTo(-1, -1)).toBe(true);
    expect(myLevel.ghostPinkLocation.isEqualTo(-1, -1)).toBe(true);
    expect(myLevel.getCell(0, 0).isPlayerSpawn).toBe(true);
    expect(myLevel.getCell(1, 0).isPlayerSpawn).toBe(false);
    expect(myLevel.getCell(2, 0).isPlayerSpawn).toBe(false);
    expect(myLevel.getCell(3, 0).isPlayerSpawn).toBe(false);
    expect(myLevel.getCell(4, 0).isPlayerSpawn).toBe(false);
});

it ("cell_0_0.isPlayerSpawn set to false -- simple case", () => {
    // SETUP
    let myLevel = new Level(5, 1);
    let cell_0_0 = myLevel.getCell(0, 0);
    cell_0_0._isPlayerSpawn = true;
    myLevel._playerSpawnLocation.set(0, 0);

    // CALL
    cell_0_0.isPlayerSpawn = false;

    // ASSERT
    expect(myLevel.playerSpawnLocation.isEqualTo(-1, -1)).toBe(true);
    expect(myLevel.ghostRedLocation.isEqualTo(-1, -1)).toBe(true);
    expect(myLevel.ghostBlueLocation.isEqualTo(-1, -1)).toBe(true);
    expect(myLevel.ghostOrangeLocation.isEqualTo(-1, -1)).toBe(true);
    expect(myLevel.ghostPinkLocation.isEqualTo(-1, -1)).toBe(true);
    expect(myLevel.getCell(0, 0).isPlayerSpawn).toBe(false);
    expect(myLevel.getCell(1, 0).isPlayerSpawn).toBe(false);
    expect(myLevel.getCell(2, 0).isPlayerSpawn).toBe(false);
    expect(myLevel.getCell(3, 0).isPlayerSpawn).toBe(false);
    expect(myLevel.getCell(4, 0).isPlayerSpawn).toBe(false);
});

it ("cell_0_0.isPlayerSpawn set to true -- toggle from ghost spawn on same cell", () => {
    // SETUP
    let myLevel = new Level(5, 1);
    let cell_0_0 = myLevel.getCell(0, 0);
    cell_0_0._isGhostRedSpawn = true;
    myLevel.ghostRedLocation.set(0, 0);

    // CALL
    cell_0_0.isPlayerSpawn = true;

    // ASSERT
    expect(myLevel.playerSpawnLocation.isEqualTo(0, 0)).toBe(true);
    expect(myLevel.ghostRedLocation.isEqualTo(-1, -1)).toBe(true);
    expect(myLevel.ghostBlueLocation.isEqualTo(-1, -1)).toBe(true);
    expect(myLevel.ghostOrangeLocation.isEqualTo(-1, -1)).toBe(true);
    expect(myLevel.ghostPinkLocation.isEqualTo(-1, -1)).toBe(true);
    expect(myLevel.getCell(0, 0).isPlayerSpawn).toBe(true);
    expect(myLevel.getCell(0, 0).isGhostRedSpawn).toBe(false);
});

it ("cell_0_0.isPlayerSpawn set to true -- toggle from different cell.isPlayerSpawn = true", () => {
    // SETUP
    let myLevel = new Level(5, 1);
    let cell_0_0 = myLevel.getCell(0, 0);
    let cell_1_0 = myLevel.getCell(1, 0);
    cell_1_0._isPlayerSpawn = true;
    myLevel.playerSpawnLocation.set(1, 0);

    // CALL
    cell_0_0.isPlayerSpawn = true;

    // ASSERT
    expect(myLevel.playerSpawnLocation.isEqualTo(0, 0)).toBe(true);

    expect(myLevel.getCell(0, 0).isPlayerSpawn).toBe(true);
    expect(myLevel.getCell(1, 0).isPlayerSpawn).toBe(false);
});

it ("selectedCell change -- make sure it doesn't toggle other values", () => {
    // SETUP
    let myLevel = new Level(5, 1);
    let cell_0_0 = myLevel.getCell(0, 0);
    cell_0_0._isPlayerSpawn = true;
    myLevel.playerSpawnLocation.set(0, 0);

    // CALL
    cell_0_0.selected = true;

    // ASSERT
    expect(myLevel.playerSpawnLocation.isEqualTo(0, 0)).toBe(true);
    expect(cell_0_0.isPlayerSpawn).toBe(true);
    expect(myLevel._selectedLocation.isEqualTo(0, 0)).toBe(true);
    expect(cell_0_0.selected).toBe(true);
});

it ("selectedCell change -- make sure it does toggle other selected Cells", () => {
    // SETUP
    let myLevel = new Level(5, 1);
    let cell_1_0 = myLevel.getCell(1, 0);
    let cell_0_0 = myLevel.getCell(0, 0);
    cell_0_0._selected = true;
    myLevel._selectedLocation.set(0, 0);

    // CALL
    cell_1_0.selected = true;

    // ASSERT
    expect(myLevel._selectedLocation.isEqualTo(1, 0)).toBe(true);
    expect(cell_1_0.selected).toBe(true);
    expect(cell_0_0.selected).toBe(false);
});

it ("test editMode toggle", () => {
    // SETUP
    let theLevel = new Level();
    let theCell = theLevel.getCell(0, 0);

    // CALL
    theLevel.editMode = true;

    // ASSERT
    theLevel.iterateOverCells(function (cell, theLevel) {
        expect(cell.editMode).toBe(true);
    });

    // CALL AGAIN
    theLevel.editMode = false;

    // ASSERT AGAIN
    theLevel.iterateOverCells(function (cell, theLevel) {
        expect(cell.editMode).toBe(false);
    });
});

const testOnKeyDown = function (fromLocation, key, destLocation) {
    // SETUP
    let theLevel = new Level();
    theLevel.editMode = true;
    theLevel.getCellByLocation(fromLocation).selected = true;
    expect(theLevel._selectedLocation.equals(fromLocation)).toBe(true);
    expect(theLevel.getCellByLocation(fromLocation).selected).toBe(true);

    // CALL
    theLevel.onKeyDown(key);

    // ASSERT
    if (!fromLocation.equals(destLocation)) {
        expect(theLevel.getCellByLocation(fromLocation).selected).toBe(false);
    }
    expect(theLevel.getCellByLocation(destLocation).selected).toBe(true);
    expect(theLevel._selectedLocation.equals(destLocation)).toBe(true);
};

it ("test onKeyDown - ArrowDown from (0, 0) ", () => {
    testOnKeyDown(new Location(0, 0), "ArrowDown", new Location(0, 1));
});

it ("test onKeyDown - ArrowDown from bottom ", () => {
    let bottomLocation = new Location(0, Level.DEFAULT_HEIGHT - 1);
    testOnKeyDown(bottomLocation, "ArrowDown", bottomLocation);
});

it ("test onKeyDown - ArrowUp from (0, 0) ", () => {
    testOnKeyDown(new Location(0, 0), "ArrowUp", new Location(0, 0));
});

it ("test onKeyDown - ArrowUp from bottom ", () => {
    let bottomLocation = new Location(0, Level.DEFAULT_HEIGHT - 1);
    let secondToBottomLocation = new Location(0, Level.DEFAULT_HEIGHT - 2);
    testOnKeyDown(bottomLocation, "ArrowUp", secondToBottomLocation);
});

it ("test onKeyDown - ArrowLeft from (0, 0) ", () => {
    testOnKeyDown(new Location(0, 0), "ArrowLeft", new Location(0, 0));
});

it ("test onKeyDown - ArrowLeft from right", () => {
    let rightLocation = new Location(Level.DEFAULT_WIDTH - 1, 0);
    let secondFromRightLoc = new Location(Level.DEFAULT_WIDTH - 2, 0);
    testOnKeyDown(rightLocation, "ArrowLeft", secondFromRightLoc);
});

it ("test onKeyDown - ArrowRight from (0, 0) ", () => {
    testOnKeyDown(new Location(0, 0), "ArrowRight", new Location(1, 0));
});

it ("test onKeyDown - ArrowRight from right", () => {
    let rightLocation = new Location(Level.DEFAULT_WIDTH - 1, 0);
    testOnKeyDown(rightLocation, "ArrowRight", rightLocation);
});

it ("test selected cell changed", () => {
    // SETUP
    let theLevel = new Level();
    theLevel.getCell(0, 0).selected = true;
    expect(theLevel._selectedLocation.isEqualTo(0, 0)).toBe(true);
    expect(theLevel.getCell(0, 0).selected).toBe(true);

    // CALL
    theLevel.getCell(1, 0).selected = true;

    // ASSERT
    expect(theLevel._selectedLocation.isEqualTo(1, 0)).toBe(true);
    expect(theLevel.getCell(0, 0).selected).toBe(false);
    expect(theLevel.getCell(1, 0).selected).toBe(true);
});

it ("selectedCell returns null if selectedLocation is invalid", () => {
    // SETUP
    let theLevel = new Level();

    // CALL
    let theSelectedCell = theLevel.selectedCell;

    // ASSERT
    expect(theSelectedCell).toBe(null);
});

it ("regeneratePaths works", () => {
    // SETUP
    let theLevel = new Level(2, 2);
    let oldFloydWarshall = theLevel.floydWarshall;

    // CALL
    let newFloydWarshall = theLevel.regeneratePaths();

    // ASSERT
    expect(newFloydWarshall !== oldFloydWarshall).toBe(true);
});

it ("get color works", () => {
    // SETUP
    let theLevel = new Level(2, 2);
    // let oldFloydWarshall = theLevel.floydWarshall;

    // CALL
    let theColor = theLevel.color;

    // ASSERT
    expect(theColor).toBe(Border.COLOR_CLASSIC);
});

it ("set color works", () => {
    // SETUP
    let theLevel = new Level(2, 2);
    // let oldFloydWarshall = theLevel.floydWarshall;

    // CALL
    theLevel.color = Border.COLOR_PINK;

    // ASSERT
    expect(theLevel.color).toBe(Border.COLOR_PINK);
    expect(theLevel.getCell(0, 0).solidBorder.color).toBe(Border.COLOR_PINK);
    expect(theLevel.getCell(0, 1).solidBorder.color).toBe(Border.COLOR_PINK);
    expect(theLevel.getCell(1, 0).solidBorder.color).toBe(Border.COLOR_PINK);
    expect(theLevel.getCell(1, 1).solidBorder.color).toBe(Border.COLOR_PINK);
});

it ("removeColumn removes spawn values if they are in that col", () => {
    // SETUP
    let theLevel = new Level(2, 2);
    let cell_1_0 = theLevel.getCell(1, 0);
    cell_1_0.isPlayerSpawn = true;
    expect(theLevel.playerSpawnLocation.isEqualTo(1, 0)).toBe(true);

    // CALL
    theLevel.removeColumn();

    // ASSERT
    expect(theLevel.playerSpawnLocation.isEqualTo(-1, -1)).toBe(true);
    expect(cell_1_0.isPlayerSpawn).toBe(false);
});

it ("removeColumn doesnt let less than 1 col", () => {
    // SETUP
    let theLevel = new Level(1, 1);

    // CALL
    theLevel.removeColumn();

    // ASSERT
    expect(theLevel.width).toBe(1);
});

it ("addColumn adds cell of the same color", () => {
    // SETUP
    let theLevel = new Level(1, 1);
    let cell_0_0 = theLevel.getCell(0, 0);
    theLevel.color = Border.COLOR_AQUA;
    expect(cell_0_0.solidBorder.color === Border.COLOR_AQUA).toBe(true);

    // CALL
    theLevel.addColumn();

    // ASSERT
    let cell_1_0 = theLevel.getCell(1, 0);
    expect(cell_1_0.solidBorder.color === Border.COLOR_AQUA).toBe(true);
});

it ("removeRow removes spawn values if they are in that row", () => {
    // SETUP
    let theLevel = new Level(2, 2);
    let cell_0_1 = theLevel.getCell(0, 1);
    cell_0_1.isPlayerSpawn = true;
    expect(theLevel.playerSpawnLocation.isEqualTo(0, 1)).toBe(true);

    // CALL
    theLevel.removeRow();

    // ASSERT
    expect(theLevel.playerSpawnLocation.isEqualTo(-1, -1)).toBe(true);
    expect(cell_0_1.isPlayerSpawn).toBe(false);
});

it ("removeRow doesnt let less than 1 row", () => {
    // SETUP
    let theLevel = new Level(1, 1);

    // CALL
    theLevel.removeRow();

    // ASSERT
    expect(theLevel.height).toBe(1);
});

it ("addRow adds cell of the same color", () => {
    // SETUP
    let theLevel = new Level(1, 1);
    let cell_0_0 = theLevel.getCell(0, 0);
    theLevel.color = Border.COLOR_AQUA;
    expect(cell_0_0.solidBorder.color === Border.COLOR_AQUA).toBe(true);

    // CALL
    theLevel.addRow();

    // ASSERT
    let cell_0_1 = theLevel.getCell(0, 1);
    expect(cell_0_1.solidBorder.color === Border.COLOR_AQUA).toBe(true);
});

it ("addRow should add the cells in edit mode", () => {
    // SETUP
    let theLevel = new Level(1, 1);
    let cell_0_0 = theLevel.getCell(0, 0);
    theLevel.editMode = true;

    // CALL
    theLevel.addRow();

    // ASSERT
    let cell_0_1 = theLevel.getCell(0, 1);
    expect(cell_0_1.editMode).toBe(true);
});

it ("addColumn should add the cells in edit mode", () => {
    // SETUP
    let theLevel = new Level(1, 1);
    let cell_0_0 = theLevel.getCell(0, 0);
    theLevel.editMode = true;

    // CALL
    theLevel.addColumn();

    // ASSERT
    let cell_1_0 = theLevel.getCell(1, 0);
    expect(cell_1_0.editMode).toBe(true);
});

it ("getCellByLocation returns null if cell doesn't exist", () => {
    // SETUP
    let theLevel = new Level(1, 1);

    // CALL
    let theValue = theLevel.getCellByLocation(new Location(2, 2));

    // ASSERT
    expect(theValue === null).toBe(true);
});

it ("mirrorHorizontal assigns new ids and locations to clone cells", () => {
    // SETUP
    let theLevel = new Level(2, 1);
    let cell_0_0 = theLevel.getCell(0, 0);
    let cell_1_0 = theLevel.getCell(1, 0);
    expect(cell_0_0.id).toBe("0_0");
    expect(cell_1_0.id).toBe("0_1");

    // CALL
    theLevel.mirrorHorizontally();

    // ASSERT
    expect(theLevel.getCell(2, 0).id).toBe("0_2");
    expect(theLevel.getCell(2, 0).location.isEqualTo(2, 0)).toBe(true);
    expect(theLevel.getCell(3, 0).id).toBe("0_3");
    expect(theLevel.getCell(3, 0).location.isEqualTo(3, 0)).toBe(true);
});

it ("mirrorVertical assigns new ids and locations to clone cells", () => {
    // SETUP
    let theLevel = new Level(1, 2);
    let cell_0_0 = theLevel.getCell(0, 0);
    let cell_0_1 = theLevel.getCell(0, 1);
    expect(cell_0_0.id).toBe("0_0");
    expect(cell_0_1.id).toBe("1_0");

    // CALL
    theLevel.mirrorVertically();

    // ASSERT
    expect(theLevel.getCell(0, 2).id).toBe("2_0");
    expect(theLevel.getCell(0, 2).location.isEqualTo(0, 2)).toBe(true);
    expect(theLevel.getCell(0, 3).id).toBe("3_0");
    expect(theLevel.getCell(0, 3).location.isEqualTo(0, 3)).toBe(true);
});

it ("getLevelNumAsTimeRange basic test", () => {
    // SETUP
    let theLevel = new Level(2, 2);
    theLevel.levelNum = 1;

    // CALL
    let theValue = theLevel.getLevelNumAsTimeRange();

    // ASSERT
    expect(theValue).toBe(0);
});

it ("getLevelNumAsTimeRange basic test 2", () => {
    // SETUP
    let theLevel = new Level(2, 2);
    theLevel.levelNum = 17;

    // CALL
    let theValue = theLevel.getLevelNumAsTimeRange();

    // ASSERT
    expect(theValue).toBe(1);
});

it ("getLevelNumAsTimeRange crazy high level num test", () => {
    // SETUP
    let theLevel = new Level(2, 2);
    theLevel.levelNum = 36;

    // CALL
    let theValue = theLevel.getLevelNumAsTimeRange();

    // ASSERT
    expect(theValue).toBe(1);
});

it ("getLevelNumAsTimeRange low level num test", () => {
    // SETUP
    let theLevel = new Level(2, 2);
    theLevel.levelNum = 0;

    // CALL
    let theValue = theLevel.getLevelNumAsTimeRange();

    // ASSERT
    expect(theValue).toBe(0);
});

it ("BlinkBorder setter works", () => {
    // SETUP
    let level = new Level(2, 2);

    // CALL
    level.blinkBorder = true;

    // ASSERT
    expect(level.getCell(0, 0).blinkBorder).toBe(true);
    expect(level.getCell(0, 1).blinkBorder).toBe(true);
    expect(level.getCell(1, 0).blinkBorder).toBe(true);
    expect(level.getCell(1, 1).blinkBorder).toBe(true);
});

it ("test toBinary", () => {
    // SETUP
    let level = new Level(2, 2);

    // CALL
    let toCheck = level.toBinary();

    // ASSERT
    expect(toCheck[0][0] !== null && typeof(toCheck[0][0]) === "string").toBe(true);
    expect(toCheck[0][1] !== null && typeof(toCheck[0][1]) === "string").toBe(true);
    expect(toCheck[1][0] !== null && typeof(toCheck[1][0]) === "string").toBe(true);
    expect(toCheck[1][1] !== null && typeof(toCheck[1][1]) === "string").toBe(true);
});