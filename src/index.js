import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';


import App from './App';
ReactDOM.render(
  <App />,
  document.getElementById('root')
);

// import NeuralNetworkTest from "./tests/NeuralNetworkTest";
// ReactDOM.render(
//     <NeuralNetworkTest />,
//     document.getElementById("root")
// );

// import NeuralNetwork from "./ai/ann/NeuralNetwork";
// import {default as NeuralNetworkModel} from "./model/ai/ann/NeuralNetwork";
// import NeuralNetworkDS from "./model/NeuralNetworkDS";
// let nn = new NeuralNetworkModel([8, 8, 3], true);
// let nnDS = new NeuralNetworkDS(nn);
// ReactDOM.render(
//     <NeuralNetwork dataSource={nnDS} height={512} width={512} />,
//     document.getElementById("root")
// );

// import NeuralNetworkVisualizerTest from "./tests/NeuralNetworkVisualizerTest";
//
// ReactDOM.render(
//     <NeuralNetworkVisualizerTest />,
//     document.getElementById("root")
// );