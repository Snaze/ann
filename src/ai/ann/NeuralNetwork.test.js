import React from 'react';
import ReactDOM from 'react-dom';
import NeuralNetwork from "./NeuralNetwork";
import {default as NeuralNetworkModel} from "../../model/ai/ann/NeuralNetwork";
import NeuralNetworkDS from "../../model/NeuralNetworkDS";



it('renders without crashing', () => {
    const div = document.createElement('div');
    let nn = new NeuralNetworkModel([3, 3, 3]);
    let nnDS = new NeuralNetworkDS(nn);

    ReactDOM.render(<NeuralNetwork dataSource={nnDS} width={640} height={512} />, div);
});

it ("getOptimalLocation works", () => {
    let toCheck = NeuralNetwork.getOptimalLocation(1, 4, 128, 16);

    expect(toCheck).toBeCloseTo(40);
});