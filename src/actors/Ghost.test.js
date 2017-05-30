import React from 'react';
import ReactDOM from 'react-dom';
import Ghost from './Ghost';
import {default as GhostModel} from "../model/actors/Ghost";
import Level from "../model/Level";
import Player from "../model/actors/Player";

it('renders without crashing', () => {
    const div = document.createElement('div');
    const level = new Level();
    const player = new Player(level, Player.MR_PAC_MAN);
    const ghost = new GhostModel(level, GhostModel.RED, player);

    ReactDOM.render(<Ghost dataSource={ghost}/>, div);
});
