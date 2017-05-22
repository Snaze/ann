import React, {Component} from 'react';
import './App.css';
import Game from "./Game";
import {default as GameModel} from "./model/Game";

class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            game: new GameModel("Level1")
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
