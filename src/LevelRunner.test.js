import React from 'react';
import ReactDOM from 'react-dom';
import LevelRunner from "./LevelRunner";
import {default as LevelRunnerModel} from "./model/LevelRunner";

it ("Game Renders", () => {
    let levelRunner = new LevelRunnerModel("Level2WithPaths");
    const div = document.createElement('div');

    ReactDOM.render(<LevelRunner dataSource={levelRunner} />, div);
});