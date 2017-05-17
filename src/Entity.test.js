import React from 'react';
import ReactDOM from 'react-dom';
import Entity from "./Entity";

it('renders without crashing', () => {
    const div = document.createElement('div');

    ReactDOM.render(<Entity />, div);
});