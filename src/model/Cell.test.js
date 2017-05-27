import Cell from "./Cell";
import BorderType from "./BorderType";
import Dot from "./Dot";

it ('test get/set solidBorder', () => {
    let theCell = new Cell("1");

    theCell.setSolidBorder(BorderType.LEFT, true);
    expect(theCell.getSolidBorder(BorderType.LEFT)).toBe(true);

    theCell.setSolidBorder(BorderType.LEFT, false);
    expect(theCell.getSolidBorder(BorderType.LEFT)).toBe(false);
});

it ('test get/set partialBorder', () => {
    let theCell = new Cell("1");

    theCell.setPartialBorder(BorderType.LEFT, true);
    expect(theCell.getPartialBorder(BorderType.LEFT)).toBe(true);

    theCell.setPartialBorder(BorderType.LEFT, false);
    expect(theCell.getPartialBorder(BorderType.LEFT)).toBe(false);
});

it ('test get id', () => {
    let theCell = new Cell("1");
    expect(theCell.id).toBe("1");
});

it ('test get/set DotType', () => {
    let theCell = new Cell("1");
    theCell.dotType = Dot.BIG;
    expect(theCell.dotType).toBe(Dot.BIG);
});

it ("clone works", () => {
    let theCell = new Cell("1");
    let theClone = theCell.clone("2");
    expect(theCell._solidBorder.equals(theClone._solidBorder) &&
           theCell._partialBorder.equals(theClone._partialBorder) &&
           theCell.dotType === theClone.dotType).toBe(true);
    expect(theClone.id).toBe("2");
});

it ("test solid border changed nested event", () => {
    // SETUP
    let cell = new Cell("0_0");
    let wasCalledCorrectly = false;
    let theCallback = function(value) {
        if (value.source === "_solidBorder._left" &&
            !value.oldValue && value.newValue) {
            wasCalledCorrectly = true;
        }
    };
    cell.addOnChangeCallback(theCallback);

    // CALL
    cell.setSolidBorder(BorderType.LEFT, true);

    // ASSERT
    expect(wasCalledCorrectly).toBe(true);
});

it ("test partial border changed nested event", () => {
    // SETUP
    let cell = new Cell("0_0");
    let wasCalledCorrectly = false;
    let theCallback = function(value) {
        if (value.source === "_partialBorder._top" &&
            !value.oldValue && value.newValue) {
            wasCalledCorrectly = true;
        }
    };
    cell.addOnChangeCallback(theCallback);

    // CALL
    cell.setPartialBorder(BorderType.TOP, true);

    // ASSERT
    expect(wasCalledCorrectly).toBe(true);
});

it ("test location changed nested event", () => {
    // SETUP
    let cell = new Cell("-1_-1");
    let wasCalledCorrectly = false;
    let theCallback = function(value) {
        if (value.source === "_location._x" &&
            (value.oldValue === -1) && (value.newValue === 0)) {
            wasCalledCorrectly = true;
        }
    };
    cell.addOnChangeCallback(theCallback);

    // CALL
    cell.location.x = 0;

    // ASSERT
    expect(wasCalledCorrectly).toBe(true);
});

it ("test remove all callbacks work", () => {
    // SETUP
    let cell = new Cell("-1_-1");

    expect(cell.solidBorder.numCallbacks).toBe(1);
    expect(cell.partialBorder.numCallbacks).toBe(1);
    expect(cell.location.numCallbacks).toBe(1);
    expect(cell.screenLocation.numCallbacks).toBe(1);

    // CALL
    cell.removeAllCallbacks();

    // ASSERT
    expect(cell.solidBorder.numCallbacks).toBe(0);
    expect(cell.partialBorder.numCallbacks).toBe(0);
    expect(cell.location.numCallbacks).toBe(0);
    expect(cell.screenLocation.numCallbacks).toBe(0);
});

it ("test set isPlayerSpawn -- toggle case", () => {
    // SETUP
    let cell = new Cell("-1_-1");
    cell._isGhostRedSpawn = true;
    cell._isGhostPinkSpawn = true;
    cell._isGhostBlueSpawn = true;
    cell._isGhostOrangeSpawn = true;

    // CALL
    cell.isPlayerSpawn = true;

    // ASSERT
    expect(cell.isPlayerSpawn).toBe(true);
    expect(cell.isGhostRedSpawn).toBe(false);
    expect(cell.isGhostPinkSpawn).toBe(false);
    expect(cell.isGhostBlueSpawn).toBe(false);
    expect(cell.isGhostOrangeSpawn).toBe(false);
});