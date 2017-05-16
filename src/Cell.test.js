import React from 'react';
import ReactDOM from 'react-dom';
import Cell from "./Cell.js";
import {default as CellModel} from "./model/Cell";

it('renders without crashing', () => {
    const table = document.createElement('table');
    table.appendChild(document.createElement('tbody'));
    const theRow = document.createElement('tr');
    table.appendChild(theRow);
    let cell = new CellModel("1");

    ReactDOM.render(<Cell cell={cell} />, theRow);
});