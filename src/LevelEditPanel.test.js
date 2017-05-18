import React from 'react';
import ReactDOM from 'react-dom';
import LevelEditPanel from './LevelEditPanel';
import {default as CellModel} from "./model/Cell";

it('renders without crashing', () => {
    const div = document.createElement('div');
    let cell = new CellModel("-1_-1");
    ReactDOM.render(<LevelEditPanel cell={cell} />, div);
});
