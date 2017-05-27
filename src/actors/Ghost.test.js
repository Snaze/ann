import React from 'react';
import ReactDOM from 'react-dom';
import Ghost from './Ghost';
import Direction from "../utils/Direction";
import {default as GhostModel} from "../model/actors/Ghost";
import {default as LocationModel} from "../model/Location";
import Level from "../model/Level";

it('renders without crashing', () => {
    const div = document.createElement('div');
    const level = new Level();
    const ghost = new GhostModel(level, GhostModel.RED);

    ReactDOM.render(<Ghost dataSource={ghost}/>, div);
});
