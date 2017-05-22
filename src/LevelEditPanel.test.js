import React from 'react';
import ReactDOM from 'react-dom';
import LevelEditPanel from './LevelEditPanel';
import {default as CellModel} from "./model/Cell";
import LevelFactory from "./model/LevelFactory";

it('renders without crashing', () => {
    const div = document.createElement('div');
    let theLevel = LevelFactory.createLevel("Level1");
    ReactDOM.render(<LevelEditPanel dataSource={theLevel} onLoadComplete={(e) => alert("Load Complete")} />, div);
});
