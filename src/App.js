import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Square from './Square';
import GameBoard from "./GameBoard";

class App extends Component {
  render() {
    return (
      <div className="App">
        <GameBoard/>
      </div>
    );
  }
}

export default App;
