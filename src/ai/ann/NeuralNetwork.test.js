import React from 'react';
import ReactDOM from 'react-dom';
import NeuralNetwork from "./NeuralNetwork";
import {default as NeuralNetworkModel} from "../../model/ai/ann/NeuralNetwork";
import NeuralNetworkDS from "../../model/NeuralNetworkDS";
import NeuralNetworkParameter from "../../model/ai/ann/NeuralNetworkParameter";



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

it ("test line key", () => {
    // SETUP
    let sourceNode = 2;
    let sourceLayer = 1;
    let destNode = 4;
    let destLayer = 3;

    // CALL
    let lineKey = NeuralNetwork.getLineKey(sourceLayer, sourceNode, destLayer, destNode);
    let retrieved = NeuralNetwork.parseLineKey(lineKey);

    // ASSERT
    expect(lineKey).toBe(`${sourceLayer}_${sourceNode}__${destLayer}_${destNode}`);
    expect(retrieved.src.layerIdx).toBe(sourceLayer);
    expect(retrieved.src.nodeIdx).toBe(sourceNode);
    expect(retrieved.dest.layerIdx).toBe(destLayer);
    expect(retrieved.dest.nodeIdx).toBe(destNode);

});

it ("_colorLines is called after each backprop is complete", () => {
    // SETUP
    jest.useFakeTimers();

    const div = document.createElement('div');
    let nn = new NeuralNetworkModel([2, 2, 2]);
    let nnDS = new NeuralNetworkDS(nn);
    let numCalled = 0;

    let temp = ReactDOM.render(<NeuralNetwork dataSource={nnDS} width={640} height={512} />, div);

    temp._colorLines = function () {
        numCalled++;
    };
    let trainData = [[1, 1]];
    let trainLabel = [[1.0, -1.0]];
    let nntp = new NeuralNetworkParameter();
    nntp.inputs = trainData;
    nntp.expectedOutputs = trainLabel;
    nntp.maxEpochs = 5;

    // CALL
    nn.train(nntp);

    jest.runAllTimers();

    // ASSERT
    expect(numCalled).toBeGreaterThan(4);

    jest.useRealTimers();
});