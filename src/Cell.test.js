import React from 'react';
import ReactDOM from 'react-dom';
import Cell from "./Cell.js";
import Border from "./model/Border";
import {default as CellModel} from "./model/Cell";

it('renders without crashing', () => {
    const table = document.createElement('table');
    table.appendChild(document.createElement('tbody'));
    const theRow = document.createElement('tr');
    table.appendChild(theRow);
    let cell = new CellModel("1");

    ReactDOM.render(<Cell dataSource={cell} />, theRow);
});

it('it sets the color css class names appropriately', () => {
    // SETUP
    const table = document.createElement('table');
    table.appendChild(document.createElement('tbody'));
    const theRow = document.createElement('tr');
    table.appendChild(theRow);
    let cell = new CellModel("0_0");
    cell.solidBorder.color = Border.COLOR_PINK;
    cell.solidBorder.left = true;
    cell.solidBorder.top = true;
    cell.solidBorder.right = true;
    cell.solidBorder.bottom = true;

    let theCell = ReactDOM.render(<Cell dataSource={cell} />, theRow);

    // CALL
    let theClassName = theCell.className;

    // ASSERT
    expect(theClassName.indexOf("CellSolidLeftBorderPink") >= 0).toBe(true);
    expect(theClassName.indexOf("CellSolidRightBorderPink") >= 0).toBe(true);
    expect(theClassName.indexOf("CellSolidTopBorderPink") >= 0).toBe(true);
    expect(theClassName.indexOf("CellSolidBottomBorderPink") >= 0).toBe(true);
});