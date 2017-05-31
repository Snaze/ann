import React from 'react';
import ReactDOM from 'react-dom';
import GameHeader from "./GameHeader";
import Player from "./model/actors/Player";
import Level from "./model/Level";

it ("Game Renders", () => {
    const div = document.createElement('div');
    let level = new Level();
    let player = new Player(level, Player.MR_PAC_MAN);

    ReactDOM.render(<GameHeader dataSource={player} />, div);
});