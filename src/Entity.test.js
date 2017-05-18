import React from 'react';
import ReactDOM from 'react-dom';
import Entity from "./Entity";

it('renders without crashing', () => {
    const div = document.createElement('div');

    ReactDOM.render(<Entity designator={Entity.DESIGNATOR_MRS_PAC_MAN}
                            modifier={Entity.MODIFIER_DIRECTION_UP}
                            stepNumber={0} />, div);
});