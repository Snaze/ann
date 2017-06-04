import React from 'react';
import ReactDOM from 'react-dom';
import {default as GameModel} from "./model/Game";
import Game from "./Game";

it ("Game Renders", () => {
    const div = document.createElement('div');
    const game = new GameModel();

    ReactDOM.render(<Game dataSource={game} />, div);
});