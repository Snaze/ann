import React from 'react';
import ReactDOM from 'react-dom';
import GameFooter from "./GameFooter";
import {default as GameFooterModel} from "./model/GameFooter";
import Player from "./model/actors/Player";
import Level from "./model/Level";

it ("Game Renders", () => {
    const div = document.createElement('div');
    let level = new Level();
    let player = new Player(level, Player.MR_PAC_MAN);
    let player2 = new Player(level, Player.MRS_PAC_MAN);
    let gfm = new GameFooterModel(player, player2, level, GameFooterModel.ACTIVE_PLAYER_1);

    ReactDOM.render(<GameFooter dataSource={gfm} />, div);
});