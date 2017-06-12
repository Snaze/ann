import React from 'react';
import ReactDOM from 'react-dom';
import Player from './Player';
import {default as PlayerModel} from "../model/actors/Player";
import Level from "../model/Level";

it('renders without crashing', () => {
    const div = document.createElement('div');
    const level = new Level();
    const player = new PlayerModel(level, PlayerModel.MR_PAC_MAN);

    ReactDOM.render(<Player dataSource={player} />, div);
});
