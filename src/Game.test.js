import React from 'react';
import ReactDOM from 'react-dom';
import Game from "./Game";
import {default as GameModel} from "./model/Game";

it ("Game Renders", () => {
    const div = document.createElement('div');
    let game = new GameModel("Level1");

    ReactDOM.render(<Game game={game} />, div);
});