import React from 'react';
import ReactDOM from 'react-dom';
import ContextMenu from "./ContextMenu.js";
import Cell from "./model/Cell";

it('renders without crashing', () => {
    const div = document.createElement('div');
    const cell = new Cell("0_0");

    ReactDOM.render(<ContextMenu cell={cell} />, div);
});