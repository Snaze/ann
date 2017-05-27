import React from 'react';
import ReactDOM from 'react-dom';
import GameEntities from "./GameEntities";
import LevelFactory from "./model/LevelFactory";
import GameObjectContainer from "./model/GameObjectContainer";

it ("Game Renders", () => {
    const div = document.createElement('div');
    let level = LevelFactory.createLevel("Level1");
    const gameObjectContainer = new GameObjectContainer(level);

    ReactDOM.render(<GameEntities dataSource={gameObjectContainer} />, div);
});