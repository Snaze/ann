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
    // expect(cell.screenLocation.numCallbacks).toBe(1);

    // CALL
    cell.removeAllCallbacks();

    // ASSERT
    expect(cell.solidBorder.numCallbacks).toBe(0);
    expect(cell.partialBorder.numCallbacks).toBe(0);
    expect(cell.location.numCallbacks).toBe(0);
    // expect(cell.screenLocation.numCallbacks).toBe(0);
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

/** canTraverseTo - DOWN **/

it ("canTraverseTo up to down -- no border", () => {
    // SETUP
    let topCell = new Cell("0_0");
    let bottomCell = new Cell("1_0");

    // CALL
    let retVal = topCell.canTraverseTo(bottomCell, 3, 3);

    // ASSERT
    expect(retVal).toBe(true);
});

it ("canTraverseTo up to down -- border", () => {
    // SETUP
    let topCell = new Cell("0_0");
    topCell.solidBorder.bottom = true;
    let bottomCell = new Cell("1_0");

    // CALL
    let retVal = topCell.canTraverseTo(bottomCell, 3, 3);

    // ASSERT
    expect(retVal).toBe(false);
});

it ("canTraverseTo up to down -- wrap", () => {
    // SETUP
    let topCell = new Cell("2_0");
    // topCell.solidBorder.bottom = true;
    let bottomCell = new Cell("0_0");

    // CALL
    let retVal = topCell.canTraverseTo(bottomCell, 3, 3);

    // ASSERT
    expect(retVal).toBe(true);
});

it ("canTraverseTo up to down -- wrap border", () => {
    // SETUP
    let topCell = new Cell("2_0");
    topCell.solidBorder.bottom = true;
    let bottomCell = new Cell("0_0");

    // CALL
    let retVal = topCell.canTraverseTo(bottomCell, 3, 3);

    // ASSERT
    expect(retVal).toBe(false);
});


/** canTraverseTo - LEFT **/

it ("canTraverseTo right to left -- no border", () => {
    // SETUP
    let leftCell = new Cell("0_0");
    let rightCell = new Cell("0_1");

    // CALL
    let retVal = rightCell.canTraverseTo(leftCell, 3, 3);

    // ASSERT
    expect(retVal).toBe(true);
});

it ("canTraverseTo right to left -- border", () => {
    // SETUP
    let leftCell = new Cell("0_0");
    let rightCell = new Cell("0_1");
    rightCell.solidBorder.left = true;

    // CALL
    let retVal = rightCell.canTraverseTo(leftCell, 3, 3);

    // ASSERT
    expect(retVal).toBe(false);
});

it ("canTraverseTo right to left -- wrap", () => {
    // SETUP
    let rightCell = new Cell("0_0");
    let leftCell = new Cell("2_0");

    // CALL
    let retVal = rightCell.canTraverseTo(leftCell, 3, 3);

    // ASSERT
    expect(retVal).toBe(true);
});

it ("canTraverseTo right to left -- wrap border", () => {
    // SETUP
    let rightCell = new Cell("0_0");
    rightCell.solidBorder.left = true;
    let leftCell = new Cell("0_2");

    // CALL
    let retVal = rightCell.canTraverseTo(leftCell, 3, 3);

    // ASSERT
    expect(retVal).toBe(false);
});


/** canTraverseTo - RIGHT **/

it ("canTraverseTo left to right -- no border", () => {
    // SETUP
    let leftCell = new Cell("0_0");
    let rightCell = new Cell("0_1");

    // CALL
    let retVal = leftCell.canTraverseTo(rightCell, 3, 3);

    // ASSERT
    expect(retVal).toBe(true);
});

it ("canTraverseTo left to right -- border", () => {
    // SETUP
    let leftCell = new Cell("0_0");
    leftCell.solidBorder.right = true;
    let rightCell = new Cell("0_1");

    // CALL
    let retVal = leftCell.canTraverseTo(rightCell, 3, 3);

    // ASSERT
    expect(retVal).toBe(false);
});

it ("canTraverseTo left to right -- wrap", () => {
    // SETUP
    let rightCell = new Cell("0_0");
    let leftCell = new Cell("2_0");

    // CALL
    let retVal = leftCell.canTraverseTo(rightCell, 3, 3);

    // ASSERT
    expect(retVal).toBe(true);
});

it ("canTraverseTo left to right -- wrap border", () => {
    // SETUP
    let rightCell = new Cell("0_0");
    let leftCell = new Cell("0_2");
    leftCell.solidBorder.right = true;

    // CALL
    let retVal = leftCell.canTraverseTo(rightCell, 3, 3);

    // ASSERT
    expect(retVal).toBe(false);
});


/** canTraverseTo - UP **/

it ("canTraverseTo down to up -- no border", () => {
    // SETUP
    let topCell = new Cell("0_0");
    let bottomCell = new Cell("1_0");

    // CALL
    let retVal = bottomCell.canTraverseTo(topCell, 3, 3);

    // ASSERT
    expect(retVal).toBe(true);
});

it ("canTraverseTo down to up -- border", () => {
    // SETUP
    let topCell = new Cell("0_0");
    let bottomCell = new Cell("1_0");
    bottomCell.solidBorder.top = true;

    // CALL
    let retVal = bottomCell.canTraverseTo(topCell, 3, 3);

    // ASSERT
    expect(retVal).toBe(false);
});

it ("canTraverseTo down to up -- wrap", () => {
    // SETUP
    let topCell = new Cell("2_0");
    // topCell.solidBorder.bottom = true;
    let bottomCell = new Cell("0_0");

    // CALL
    let retVal = bottomCell.canTraverseTo(topCell, 3, 3);

    // ASSERT
    expect(retVal).toBe(true);
});

it ("canTraverseTo down to up -- wrap border", () => {
    // SETUP
    let topCell = new Cell("2_0");
    // topCell.solidBorder.bottom = true;
    let bottomCell = new Cell("0_0");
    bottomCell.solidBorder.top = true;

    // CALL
    let retVal = bottomCell.canTraverseTo(topCell, 3, 3);

    // ASSERT
    expect(retVal).toBe(false);
});

it ("canTraverseTo non adjacent test", () => {
    // SETUP
    let topCell = new Cell("1_1");
    let bottomCell = new Cell("2_2");

    // CALL
    let retVal = bottomCell.canTraverseTo(topCell, 10, 10);

    // ASSERT
    expect(retVal).toBe(false);
});

it ("is teleport cell", () => {
    // SETUP
    let topCell = new Cell("0_1");
    let leftCell = new Cell("1_0");
    let bottomCell = new Cell("9_1");
    let rightCell = new Cell("8_9");

    // ASSERT
    expect(topCell.isTeleportCell(10, 10)).toBe(true);
    expect(leftCell.isTeleportCell(10, 10)).toBe(true);
    expect(bottomCell.isTeleportCell(10, 10)).toBe(true);
    expect(rightCell.isTeleportCell(10, 10)).toBe(true);
});

it ("is not teleport cell", () => {
    // SETUP
    let topCell = new Cell("0_1");
    topCell.solidBorder.top = true;
    let leftCell = new Cell("1_0");
    leftCell.solidBorder.left = true;
    let bottomCell = new Cell("9_1");
    bottomCell.solidBorder.bottom = true;
    let rightCell = new Cell("8_9");
    rightCell.solidBorder.right = true;

    // ASSERT
    expect(topCell.isTeleportCell(10, 10)).toBe(false);
    expect(leftCell.isTeleportCell(10, 10)).toBe(false);
    expect(bottomCell.isTeleportCell(10, 10)).toBe(false);
    expect(rightCell.isTeleportCell(10, 10)).toBe(false);
});


