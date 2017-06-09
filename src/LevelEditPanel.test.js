import React from 'react';
import ReactDOM from 'react-dom';
import LevelEditPanel from './LevelEditPanel';
import LevelFactory from "./model/LevelFactory";
import LevelModel from "./model/Level";
import {default as BorderModel} from "./model/Border";

it('renders without crashing', () => {
    const div = document.createElement('div');
    let theLevel = LevelFactory.createLevel("level2");
    ReactDOM.render(<LevelEditPanel dataSource={theLevel} onLoadComplete={(e) => alert("Load Complete")} />, div);
});

it ("onDropDownChange(e) sets the color for the color dropdown", () => {
    // SETUP
    const div = document.createElement('div');
    let theLevel = new LevelModel(2, 2);
    let originalColor = theLevel.color;
    let lep = ReactDOM.render(<LevelEditPanel dataSource={theLevel} onLoadComplete={(e) => alert("Load Complete")} />, div);

    // CALL
    lep.onFormEvent({target: {
        value: BorderModel.COLOR_PINK,
        id: "ddlColor"
    }});

    // ASSERT
    expect(theLevel.color).toBe(BorderModel.COLOR_PINK);

});