import React from 'react';
import ReactDOM from 'react-dom';
import ContextMenu from "./ContextMenu.js";
// import Cell from "./model/Cell";
import LevelFactory from "./model/LevelFactory";

it('renders without crashing', () => {
    const div = document.createElement('div');
    const level = LevelFactory.createLevel("Level1");

    ReactDOM.render(<ContextMenu dataSource={level} />, div);
});