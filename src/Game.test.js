import React from 'react';
import ReactDOM from 'react-dom';
import Game from "./Game";
import {default as GameModel} from "./model/Game";

it ("Game Renders", () => {
    let game = new GameModel("Level1");
    const div = document.createElement('div');

    ReactDOM.render(<Game dataSource={game} />, div);
});