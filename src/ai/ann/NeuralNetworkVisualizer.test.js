import React from 'react';
import ReactDOM from 'react-dom';
import NeuralNetworkVisualizer from "./NeuralNetworkVisualizer";
import {default as NeuralNetworkModel} from "../../model/ai/ann/NeuralNetwork";
import NeuralNetworkDS from "../../model/NeuralNetworkDS";
// import EdgeStore from "../../model/ai/ann/EdgeStore";
// import ActivationFunctions from "../../model/ai/ann/ActivationFunctions";

it ("basic test", () => {
    const div = document.createElement('div');
    let nn = new NeuralNetworkModel([2, 2, 1]);
    let nnDS = new NeuralNetworkDS(nn);

    ReactDOM.render(<NeuralNetworkVisualizer
        dataSource={nnDS} />, div);
});