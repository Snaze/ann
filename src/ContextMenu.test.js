import React from 'react';
import ReactDOM from 'react-dom';
import ContextMenu from "./ContextMenu.js";
import {default as CellModel} from "./model/Cell";
// import LevelFactory from "./model/LevelFactory";

it('renders without crashing', () => {
    const div = document.createElement('div');
    // const cell = LevelFactory.createLevel("level2");
    const cell = new CellModel("0_0");

    ReactDOM.render(<ContextMenu dataSource={cell} editMode={true} />, div);
});