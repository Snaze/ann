import React from 'react';
import ReactDOM from 'react-dom';
import NeuralNetworkNodeDetail from "./NeuralNetworkNodeDetail";
import {default as NeuralNetworkNodeModel} from "../../model/ai/ann/NeuralNetworkNode";
import NeuralNetworkNodeDS from "../../model/NeuralNetworkNodeDS";
import EdgeStore from "../../model/ai/ann/EdgeStore";
import ActivationFunctions from "../../model/ai/ann/ActivationFunctions";

// TODO: there is a code smell here.  You need to isolate that stuff as much as possible
const createNNN = function () {
    let edgeStore = new EdgeStore([3, 3, 3], true, ActivationFunctions.sigmoid);
    return new NeuralNetworkNodeModel(0, 0, edgeStore, 3, 3);
};

it ("basic test", () => {
    const div = document.createElement('div');
    let nnnModel = createNNN();
    let nnnDS = new NeuralNetworkNodeDS(nnnModel);
    nnnDS.activationInput = [1.0];
    nnnDS.error = [1.0];
    nnnDS.weights = [1.0];
    nnnDS.output = [1.0];

    ReactDOM.render(<NeuralNetworkNodeDetail
        dataSource={nnnDS} />, div);
});