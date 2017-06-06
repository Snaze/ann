import React, {Component} from 'react';
import './App.css';
import Game from "./Game";
import {default as GameModel} from "./model/Game";

class App extends Component {

    constructor(props) {
        super(props);

        let game = new GameModel();

        this.state = {
            game: game
        };
    }

    render() {
        return (
            <div className="App" style={{backgroundColor: "Gray"}}>
                <Game className="AppGame" dataSource={this.state.game} />
            </div>
        );
    }
}

export default App;
