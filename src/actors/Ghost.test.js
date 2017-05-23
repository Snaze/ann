import React from 'react';
import ReactDOM from 'react-dom';
import Ghost from './Ghost';
import Direction from "../utils/Direction";
import {default as GhostModel} from "../model/Ghost";
import {default as LocationModel} from "../model/Location";
import LevelFactory from "../model/LevelFactory";

it('renders without crashing', () => {
    const div = document.createElement('div');
    const ghost = new GhostModel(Direction.LEFT, new LocationModel(-1, -1), GhostModel.RED);
    const level = LevelFactory.createLevel("Level1");

    ReactDOM.render(<Ghost dataSource={ghost} level={level} />, div);
});
