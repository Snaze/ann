import React from 'react';
import ReactDOM from 'react-dom';
import GameEntities from "./GameEntities";
import LevelFactory from "./model/LevelFactory";

it ("Game Renders", () => {
    const div = document.createElement('div');
    let level = LevelFactory.createLevel("Level1");

    ReactDOM.render(<GameEntities level={level} />, div);
});