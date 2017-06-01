import React from 'react';
import ReactDOM from 'react-dom';
import {default as PointsModel} from "./model/Points";
import Points from "./Points";

it('renders without crashing', () => {
    const div = document.createElement('div');
    let points = new PointsModel();

    ReactDOM.render(<Points dataSource={points} />, div);
});