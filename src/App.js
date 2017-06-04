import React, {Component} from 'react';
import './App.css';
import LevelRunner from "./LevelRunner";
import {default as LevelRunnerModel} from "./model/LevelRunner";

class App extends Component {

    constructor(props) {
        super(props);

        let levelRunner = new LevelRunnerModel("Level5WithPaths");
        // theGame.editMode = false;

        this.state = {
            levelRunner: levelRunner
        };
    }

    render() {
        return (
            <div className="App" style={{backgroundColor: "Gray"}}>
                <LevelRunner dataSource={this.state.levelRunner} />
            </div>
        );
    }
}

export default App;
