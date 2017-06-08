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

const testGetModifier = function (designator, modifier, animating, returnedModifier) {
    // SETUP
    const div = document.createElement('div');

    let toCheck = ReactDOM.render(<Entity designator={designator}
                                          modifier={modifier}
                                          animating={animating} />, div);

    // CALL
    let modifierToCheck = toCheck.getModifier();

    // ASSERT
    expect(modifierToCheck).toBe(returnedModifier);
};

const testGetModifierForDesignator = function (designator) {
    testGetModifier(designator, Entity.MODIFIER_DIRECTION_UP, true, Entity.MODIFIER_DIRECTION_UP);
    testGetModifier(designator, Entity.MODIFIER_DIRECTION_UP, false, Entity.MODIFIER_DIRECTION_UP_PAUSED);
    testGetModifier(designator, Entity.MODIFIER_DIRECTION_LEFT, true, Entity.MODIFIER_DIRECTION_LEFT);
    testGetModifier(designator, Entity.MODIFIER_DIRECTION_LEFT, false, Entity.MODIFIER_DIRECTION_LEFT_PAUSED);
    testGetModifier(designator, Entity.MODIFIER_DIRECTION_RIGHT, true, Entity.MODIFIER_DIRECTION_RIGHT);
    testGetModifier(designator, Entity.MODIFIER_DIRECTION_RIGHT, false, Entity.MODIFIER_DIRECTION_RIGHT_PAUSED);
    testGetModifier(designator, Entity.MODIFIER_DIRECTION_DOWN, true, Entity.MODIFIER_DIRECTION_DOWN);
    testGetModifier(designator, Entity.MODIFIER_DIRECTION_DOWN, false, Entity.MODIFIER_DIRECTION_DOWN_PAUSED);
    testGetModifier(designator, Entity.MODIFIER_DEAD, true, Entity.MODIFIER_DEAD);
    testGetModifier(designator, Entity.MODIFIER_DEAD, false, Entity.MODIFIER_DEAD_PAUSED);
};

it('test getModifier', () => {
    testGetModifierForDesignator(Entity.DESIGNATOR_PAC_MAN);
    testGetModifierForDesignator(Entity.DESIGNATOR_MRS_PAC_MAN);
});