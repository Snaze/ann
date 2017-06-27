import React from 'react';
import ReactDOM from 'react-dom';
import NeuralNetworkNode from "./NeuralNetworkNode";
import {default as NeuralNetworkNodeModel} from "../../model/ai/ann/NeuralNetworkNode";
import NeuralNetworkNodeDS from "../../model/NeuralNetworkNodeDS";
import EdgeStore from "../../model/ai/ann/EdgeStore";
import ActivationFunctions from "../../model/ai/ann/ActivationFunctions";

// TODO: there is a code smell here.  You need to isolate that stuff as much as possible
const createNNN = function () {
    let edgeStore = new EdgeStore([3, 3, 3], true, ActivationFunctions.sigmoid);
    return new NeuralNetworkNodeModel(0, 0, edgeStore, 3, 3);
};

it('renders without crashing', () => {
    const div = document.createElement('div');
    let nnnModel = createNNN();
    let nnnDS = new NeuralNetworkNodeDS(nnnModel);

    ReactDOM.render(<NeuralNetworkNode
        dataSource={nnnDS}
        centerX={16} centerY={16} radius={8} highlightStroke={"aqua"} strokeWidth={5} stroke={"green"} />, div);
});

