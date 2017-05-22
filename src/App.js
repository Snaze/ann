import React, {Component} from 'react';
import './App.css';
import Game from "./Game";
import {default as GameModel} from "./model/Game";

class App extends Component {

    constructor(props) {
        super(props);

        let theGame = new GameModel("Level1");
        // theGame.editMode = false;

        this.state = {
            game: theGame
        };
    }

    render() {
        return (
            <div className="App" style={{backgroundColor: "Gray"}}>
                <Game dataSource={this.state.game} />
            </div>
        );
    }
}

export default App;
