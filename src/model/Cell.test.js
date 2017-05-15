import Cell from "./Cell";
import BorderType from "./BorderType";
import Dot from "./Dot";

it('test get/set solidBorder', () => {
    let theCell = new Cell("1");

    theCell.setSolidBorder(BorderType.LEFT, true);
    expect(theCell.getSolidBorder(BorderType.LEFT)).toBe(true);

    theCell.setSolidBorder(BorderType.LEFT, false);
    expect(theCell.getSolidBorder(BorderType.LEFT)).toBe(false);
});

it('test get/set partialBorder', () => {
    let theCell = new Cell("1");

    theCell.setPartialBorder(BorderType.LEFT, true);
    expect(theCell.getPartialBorder(BorderType.LEFT)).toBe(true);

    theCell.setPartialBorder(BorderType.LEFT, false);
    expect(theCell.getPartialBorder(BorderType.LEFT)).toBe(false);
});

it('test get id', () => {
    let theCell = new Cell("1");
    expect(theCell.id).toBe("1");
});

it('test get/set DotType', () => {
    let theCell = new Cell("1");
    theCell.dotType = Dot.BIG;
    expect(theCell.dotType).toBe(Dot.BIG);
});
