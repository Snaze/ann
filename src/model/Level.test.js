import Level from "./Level";
import Cell from "./Cell";

it('addRow works', () => {
    let theLevel = new Level();
    let prevHeight = theLevel.height;

    theLevel.addRow();

    expect(theLevel._gameMatrix[prevHeight]).toEqual(expect.anything());
    expect(theLevel.height).toBe(prevHeight+1);
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

    expect(theLevel._gameMatrix[0].length).toEqual(prevWidth+1);
    expect(theLevel.width).toBe(prevWidth+1);
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

it ("getCellById works", () => {
    let theLevel = new Level();
    let cell0_0 = theLevel.getCellById("0_0");
    expect(cell0_0).toEqual(expect.any(Cell));
});