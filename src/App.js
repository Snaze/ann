import React, {Component} from 'react';
import './App.css';
import NeuralNetworkTest from "./tests/NeuralNetworkTest";

class App extends Component {

    render() {
        return (
            <div className="App" style={{backgroundColor: "Gray"}}>
                <NeuralNetworkTest />
            </div>
        );
    }
}

export default App;
