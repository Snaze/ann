import React from 'react';
import ReactDOM from 'react-dom';
import Player from './Player';
import {default as PlayerModel} from "../model/Player";
import Direction from "../utils/Direction";
import {default as LocationModel} from "../model/Location";
import LevelFactory from "../model/LevelFactory";

it('renders without crashing', () => {
    const div = document.createElement('div');
    const player = new PlayerModel(Direction.LEFT,
        new LocationModel(-1, -1), PlayerModel.MR_PAC_MAN);
    const level = LevelFactory.createLevel("Level1");

    ReactDOM.render(<Player dataSource={player} level={level} />, div);
});
