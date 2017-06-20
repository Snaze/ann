import React, {Component} from 'react';
import {ScatterChart, Scatter, XAxis, YAxis, CartesianGrid } from "../../node_modules/recharts/umd/Recharts";
import NeuralNetwork from "../model/ai/ann/NeuralNetwork";
import MathUtil from "../model/ai/MathUtil";
import "./NeuralNetworkTest.css";
import ActivationFunctions from "../model/ai/ann/ActivationFunctions";
// import {assert} from "../utils/Assert";

class NeuralNetworkTest extends Component {

    /**
     * Life Cycle Step 1
     * @param props
     */
    constructor(props) {
        super(props);

        this._neuralNetwork = new NeuralNetwork([2, 1],
            true,
            ActivationFunctions.sigmoid,
            1.0);

        this.state = {
            epochs: 0,
            error: 1000000,
            dataOutOfRange: [],
            dataInRange: []
        };
    }

    static distance(predicted, expected) {
        if (predicted.length === 2) {
            return Math.sqrt(Math.pow((predicted[0] - expected[0]), 2.0) + Math.pow((predicted[1] - expected[1]), 2.0));
        }

        return Math.sqrt(Math.pow((predicted[0] - expected[0]), 2));
    }

    static getRandomPoint(minX, maxX, minY, maxY) {
        let toRet = [
            MathUtil.getRandomArbitrary(minX, maxX),
            MathUtil.getRandomArbitrary(minY, maxY)
        ];

        if (toRet.length !== 2) {
            throw new Error("WTF");
        }

        return toRet;
    }

    static getExpectedValue(point) {
        if (point[0] >= 0 && point[1] >= 0) {
            return [1.0];
        }

        return [0.0];
    }

    /**
     * Life Cycle Step 2
     */
    componentWillMount() {
        let error = this.trainNetwork();

        this.createTestData(error);
    }

    trainNetwork() {
        let error = Number.POSITIVE_INFINITY;
        let iteration = 0;

        while (error > 10e-7) {
            let randomPoint = null;
            // let expected = null;

            switch (iteration % 4) {
                case 0:
                    randomPoint = NeuralNetworkTest.getRandomPoint(0, 10, 0, 10);
                    break;
                case 1:
                    randomPoint = NeuralNetworkTest.getRandomPoint(0, 10, -10, -0.001);
                    break;
                case 2:
                    randomPoint = NeuralNetworkTest.getRandomPoint(-10, -0.001, -10, -0.001);
                    break;
                case 3:
                    randomPoint = NeuralNetworkTest.getRandomPoint(-10, -0.001, 0, 10);
                    break;
                default:
                    throw new Error("You should never get here");
            }

            let expected = NeuralNetworkTest.getExpectedValue(randomPoint);
            this._neuralNetwork.feedForward(randomPoint);
            error = this._neuralNetwork.backPropagate(expected);
            iteration++;
        }
        return error;
    }

    createTestData(error) {
        let dataOutOfRange = [];
        let dataInRange = [];

        for (let i = 0; i < 1000; i++) {
            let randomPoint = NeuralNetworkTest.getRandomPoint(-10, 10, -10, 10);

            let prediction = this._neuralNetwork.feedForward(randomPoint);
            let theDataSet = null;

            if (prediction[0] <= 0.50) {
                theDataSet = dataOutOfRange;
            } else {
                theDataSet = dataInRange;
            }

            theDataSet.push({
                x: randomPoint[0],
                y: randomPoint[1],
                prediction: prediction
            });
        }

        this.setState({
            epochs: this._neuralNetwork.epochs,
            error: error,
            dataOutOfRange: dataOutOfRange,
            dataInRange: dataInRange
        });
    }

    getNumCorrect(data, inRange=true) {
        let numCorrect = 0;

        data.forEach(function (point) {
            if (inRange) {
                if (point.x >= 0 && point.y >= 0) {
                    numCorrect++;
                }
            } else {
                if (!(point.x >= 0 && point.y >= 0)) {
                    numCorrect++;
                }
            }
        });

        return numCorrect;
    }

    getStyle(point, inRange=true) {
        if (inRange) {
            if (point.x >= 0 && point.y >= 0) {
                return {
                    color: "black"
                };
            } else {
                return {
                    color: "red"
                };
            }
        } else {
            if (point.x >= 0 && point.y >= 0) {
                return {
                    color: "red"
                };
            } else {
                return {
                    color: "black"
                };
            }
        }
    }

    getData(theRange, keyName) {
        let toRet = [];
        let index = 0;
        let inRange = keyName.toLowerCase() === "inrange";

        theRange.forEach(function (point) {
            toRet.push(<tr key={keyName + index.toString()} style={this.getStyle(point, inRange)}>
                <td style={{textAlign: "left", border: "solid 1px black"}}>
                    {point.x}
                </td>
                <td style={{textAlign: "left", border: "solid 1px black"}}>
                    {point.y}
                </td>
                <td style={{textAlign: "left", border: "solid 1px black"}}>
                    {point.prediction[0]}
                </td>
            </tr>);

            index++;
        }.bind(this));

        return toRet;
    }

    getDataAsTable(theRange, keyName) {
        return (<table cellSpacing={0} style={{border: "solid 1px black"}}>
            <thead>
                <tr>
                    <th>
                        x
                    </th>
                    <th>
                        y
                    </th>
                    <th>
                        prediction
                    </th>
                </tr>
            </thead>
            <tbody>
            {this.getData(theRange, keyName)}
            </tbody>
        </table>);
    }

    getDetailDiv(title, theRange) {
        let inRange = theRange === this.state.dataInRange;
        let numCorrect = this.getNumCorrect(theRange, inRange);
        let length = theRange.length;
        let percentCorrect = (numCorrect / length) * 100;

        return (<div>
            Out of Range:&nbsp;{numCorrect}&nbsp;/&nbsp;{length}&nbsp;=&nbsp;{percentCorrect}&nbsp;%
        </div>);
    }

    /**
     * Life Cycle Step 3
     * @returns {XML}
     */
    render() {
        return (<div className="NeuralNetworkTest">
            <div className="NeuralNetworkTestChart">
                <ScatterChart width={640} height={640} margin={{top: 40, right: 40, left: 40, bottom: 40}} >
                    <XAxis dataKey={'x'} allowDecimals={false} type="number" />
                    <YAxis dataKey={'y'} allowDecimals={false} />
                    <Scatter name='Out of Range' data={this.state.dataOutOfRange} fill='red' />
                    <Scatter name='In Range' data={this.state.dataInRange} fill='green' />
                    <CartesianGrid />
                </ScatterChart>
            </div>
            <div>
                <div>
                    Epochs: {this.state.epochs}
                </div>
                <div>
                    Error: {this.state.error}
                </div>
                <div>
                    <table>
                        <tbody>
                            <tr>
                                <td style={{verticalAlign: "top"}}>
                                    {this.getDetailDiv("Out of Range", this.state.dataOutOfRange)}
                                    <div>
                                        {this.getDataAsTable(this.state.dataOutOfRange, "outOfRange")}
                                    </div>
                                </td>
                                <td style={{verticalAlign: "top"}}>
                                    {this.getDetailDiv("In Range", this.state.dataInRange)}
                                    <div>
                                        {this.getDataAsTable(this.state.dataInRange, "inRange")}
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>);
    }

    /**
     * Life Cycle Step 4
     */
    componentDidMount() {


    }

}

export default NeuralNetworkTest;