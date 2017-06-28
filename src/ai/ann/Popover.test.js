import React from 'react';
import ReactDOM from 'react-dom';
import Popover from "./Popover";

it('renders without crashing', () => {
    const div = document.createElement('div');

    ReactDOM.render(<Popover
        width={200}
        height={200}
        stroke={"DarkGreen"}
        roundedCorners={20}
        fill={"green"}
        strokeWidth={4} />, div);
});

