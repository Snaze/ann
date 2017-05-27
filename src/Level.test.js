import React from 'react';
import ReactDOM from 'react-dom';
import Level from "./Level.js";
import LevelFactory from "./model/LevelFactory";
import GameObjectContainer from "./model/GameObjectContainer";

it('renders without crashing', () => {
    const div = document.createElement('div');
    const theLevel = LevelFactory.createLevel("Level1");
    const gameObjectContainer = new GameObjectContainer(theLevel);

    ReactDOM.render(<Level dataSource={theLevel} gameObjectContainer={gameObjectContainer} />, div);
});