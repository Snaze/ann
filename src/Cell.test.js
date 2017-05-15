import React from 'react';
import ReactDOM from 'react-dom';
import Cell from "./Cell.js";

it('renders without crashing', () => {
    const table = document.createElement('table');
    table.appendChild(document.createElement('tbody'));
    const theRow = document.createElement('tr');
    table.appendChild(theRow);

    ReactDOM.render(<Cell />, theRow);
});