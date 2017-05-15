import React from 'react';
import ReactDOM from 'react-dom';
import Level from "./Level.js";

it('renders without crashing', () => {
    const div = document.createElement('div');

    ReactDOM.render(<Level />, div);
});