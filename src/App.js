import React, {Component} from 'react';
// import logo from './logo.svg';
import './App.css';
import Level from "./Level";
import ContextMenu from "./ContextMenu";
import Entity from "./Entity";
import EntityStyleDebug from "./EntityStyleDebug";
import EntityAnimationDebug from "./EntityAnimationDebug";
import Game from "./Game";
import {default as GameModel} from "./model/Game";
import Dummy from "./tests/Dummy";
import {default as DummyModel} from "./model/Dummy";
import PropChangeTest from "./tests/PropChangeTest";
import GameTimerTest from "./tests/GameTimerTest";

class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            game: new GameModel("Level1")
        };

        this._dummy = new DummyModel();
    }

    render() {
        return (
            <div className="App" style={{backgroundColor: "Gray"}}>
                <GameTimerTest />
            </div>
        );
    }
}

export default App;
