import React from 'react';
import ReactDOM from 'react-dom';
import MainMenu from './MainMenu';
import MainMenuModel from "../model/menus/MainMenu";
import GameMode from "../model/GameMode";

it('renders without crashing', () => {
    const div = document.createElement('div');
    const mm = new MainMenuModel();
    const callback = function (e) {

    };

    ReactDOM.render(<MainMenu dataSource={mm} onSelectionCallback={callback} />, div);
});

it('key down works crashing', () => {
    // SETUP
    const div = document.createElement('div');
    const mmm = new MainMenuModel();
    const callback = function (e) {

    };

    let mm = ReactDOM.render(<MainMenu dataSource={mmm} onSelectionCallback={callback} />, div);

    // CALL
    mm.keyDown("ArrowUp");

    // ASSERT
    expect(mmm.selectedValue).toBe(GameMode.WATCH_PRE_TRAINED);
});