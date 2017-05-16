import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import Level from "./Level";
import ContextMenu from "./ContextMenu";

class App extends Component {
  render() {
    return (
      <div className="App">
        <ContextMenu/>
      </div>
    );
  }
}

export default App;
