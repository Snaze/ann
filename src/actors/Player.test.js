import React from 'react';
import ReactDOM from 'react-dom';
import Player from './Player';
import {default as PlayerModel} from "../model/Player";
import Direction from "../utils/Direction";
import {default as LocationModel} from "../model/Location";

it('renders without crashing', () => {
    const div = document.createElement('div');
    const player = new PlayerModel(Direction.LEFT,
        new LocationModel(-1, -1), PlayerModel.MR_PAC_MAN);

    ReactDOM.render(<Player dataSource={player} />, div);
});
