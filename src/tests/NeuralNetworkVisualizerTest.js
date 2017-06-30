import React, {Component} from 'react';
import "./NeuralNetworkVisualizerTest.css";
import NeuralNetwork from "../model/ai/ann/NeuralNetwork";
import "./NeuralNetworkTest.css";
import ActivationFunctions from "../model/ai/ann/ActivationFunctions";
// import WeightInitializer from "../model/ai/ann/WeightInitializer";
// import ArrayUtils from "../utils/ArrayUtils";
// import {default as NeuralNetworkSVG} from "../ai/ann/NeuralNetwork";
import NeuralNetworkVisualizer from "../ai/ann/NeuralNetworkVisualizer";
import NeuralNetworkDS from "../model/NeuralNetworkDS";
import NeuralNetworkTrainingParameter from "../model/ai/ann/NeuralNetworkParameter";

class NeuralNetworkVisualizerTest extends Component {

    constructor(props) {
        super(props);

        this._buttonClickRef = (e) => this._buttonClick(e);

        this.state = {
            neuralNetworkDS: NeuralNetworkVisualizerTest.createNNDS()
        };
    }

    static createNNDS() {
        let nn = new NeuralNetwork([2, 3, 2], true, ActivationFunctions.tanh, 0.15);
        return new NeuralNetworkDS(nn);
    }

    _train(nnDS) {
        let toTrainWith = [];
        let labels = [];

        for (let i = 0; i < 1000; i++) {
            if (i % 2 === 0) {
                toTrainWith.push([1.0, -1.0]);
                labels.push([1.0, -1.0]);
            } else {
                toTrainWith.push([-1.0, 1.0]);
                labels.push([-1.0, 1.0]);
            }
        }

        let nntp = new NeuralNetworkTrainingParameter();
        nntp.inputs = toTrainWith;
        nntp.expectedOutputs = labels;
        nntp.maxEpochs = 20;

        nnDS.train(nntp);
    }

    _buttonClick(e) {
        if (e.target.name === "btnTrain") {
            this._train(this.state.neuralNetworkDS);
        } else if (e.target.name === "btnReset") {
            this.state.neuralNetworkDS.stop();

            this.setState({
                neuralNetworkDS: NeuralNetworkVisualizerTest.createNNDS()
            });
        }

    }

    render() {
        return (
            <div className="NeuralNetworkVisualizerTest">
                <NeuralNetworkVisualizer dataSource={this.state.neuralNetworkDS} />
                <button onClick={this._buttonClickRef} name="btnTrain">TRAIN</button>
                <button onClick={this._buttonClickRef} name="btnReset">RESET</button>
            </div>
        );
    }
}

export default NeuralNetworkVisualizerTest;