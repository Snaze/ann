import React from 'react';
import ReactDOM from 'react-dom';
import Entity from "./Entity";

it('renders without crashing', () => {
    const div = document.createElement('div');

    ReactDOM.render(<Entity designator={Entity.DESIGNATOR_MRS_PAC_MAN}
                            modifier={Entity.MODIFIER_DIRECTION_UP}
                            stepNumber={0} />, div);
});

it('blink adds correct class', () => {
    // SETUP
    const div = document.createElement('div');

    let toCheck = ReactDOM.render(<Entity designator={Entity.DESIGNATOR_MRS_PAC_MAN}
                            modifier={Entity.MODIFIER_DIRECTION_UP}
                            stepNumber={0} blink={true} />, div);

    // CALL
    let className = toCheck.currentClassName();

    // ASSERT
    expect(className.indexOf(" EntityBlink") >= 0).toBe(true);
});

it('when blink = false that class is not added', () => {
    // SETUP
    const div = document.createElement('div');

    let toCheck = ReactDOM.render(<Entity designator={Entity.DESIGNATOR_MRS_PAC_MAN}
                                          modifier={Entity.MODIFIER_DIRECTION_UP}
                                          stepNumber={0} blink={false} />, div);

    // CALL
    let className = toCheck.currentClassName();

    // ASSERT
    expect(className.indexOf(" EntityBlink") < 0).toBe(true);
});