import React, {Component} from 'react';
// import logo from './logo.svg';
import './App.css';
import Level from "./Level";
import ContextMenu from "./ContextMenu";
import Entity from "./Entity";
import EntityStyleDebug from "./EntityStyleDebug";
import EntityAnimationDebug from "./EntityAnimationDebug";

class App extends Component {

    render() {
        return (
            <div className="App" style={{backgroundColor: "Gray"}}>
                <EntityAnimationDebug />
            </div>
        );
    }
}

export default App;
