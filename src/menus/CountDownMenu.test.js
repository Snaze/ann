import React from 'react';
import ReactDOM from 'react-dom';
import CountDownMenu from './CountDownMenu';
import {default as CountDownMenuModel} from "../model/menus/CountDownMenu";

it('renders without crashing', () => {
    const div = document.createElement('div');
    const cdmm = new CountDownMenuModel();

    ReactDOM.render(<CountDownMenu dataSource={cdmm} />, div);
});