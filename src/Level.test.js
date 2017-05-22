import React from 'react';
import ReactDOM from 'react-dom';
import Level from "./Level.js";
import LevelFactory from "./model/LevelFactory";

it('renders without crashing', () => {
    const div = document.createElement('div');
    const theLevel = LevelFactory.createLevel("Level1");

    ReactDOM.render(<Level dataSource={theLevel} />, div);
});