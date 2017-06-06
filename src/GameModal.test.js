import React from 'react';
import ReactDOM from 'react-dom';
import GameModal from "./GameModal";
import {default as GameModalModel} from "./model/GameModal";

it ("GameModal Renders", () => {
    const div = document.createElement('div');
    let gm = new GameModalModel();

    ReactDOM.render(<GameModal dataSource={gm} />, div);
});