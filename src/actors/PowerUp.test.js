import React from 'react';
import ReactDOM from 'react-dom';
import PowerUp from './PowerUp';
import {default as PowerUpModel} from "../model/actors/PowerUp";
import Level from "../model/Level";
import Player from "../model/actors/Player";

it('renders without crashing', () => {
    const div = document.createElement('div');
    const level = new Level();
    // const player = new Player(level, Player.MR_PAC_MAN);
    const powerUpModel = new PowerUpModel(level, PowerUpModel.POWER_UP_CHERRY);

    ReactDOM.render(<PowerUp dataSource={powerUpModel}/>, div);
});
