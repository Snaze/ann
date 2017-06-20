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

        this._neuralNetwork = new NeuralNetwork([2, 3, 2],
            true,
            ActivationFunctions.sigmoid,
            0.075);

        this._neuralNetwork.setWeights([[[-45.42877134937925,0.06307931678138425,86.16102782528077],[1.0979752237380247,43.93067987200524,-86.27794022812651]],[[10.168778876191363,-9.997238479805933,0.552376336368361],[19.20396670170233,-13.954600932323425,12.059486933582416],[11.620645753000291,-11.462057255950354,0.6045539499607651]],[[-3.302596057655691,-5.123564179398088,-3.7756837144896305,4.960726472470421],[3.219538642433655,5.088310440177473,3.899255941522516,-4.940265049557309]]]);

        this.state = {
            epochs: 0,
            error: 1000000,
            dataOutOfRange: [],
            dataInRange: [],
            weights: JSON.stringify(this._neuralNetwork.getWeights())
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
        if (point[0] >= 2 && point[1] >= 2) {
            return [1.0, 0.0];
        }

        return [0.0, 1.0];
    }

    /**
     * Life Cycle Step 2
     */
    componentWillMount() {
        let error = 0;

        if (!this.state.weights) {
            error = this.trainNetwork();
        }

        this.createTestData(error);
    }

    trainIteration(randomPoint) {
        let expected = NeuralNetworkTest.getExpectedValue(randomPoint);
        this._neuralNetwork.feedForward(randomPoint);
        return this._neuralNetwork.backPropagate(expected);
    }

    trainNetwork() {
        let error = Number.POSITIVE_INFINITY;

        while (error > 10e-7) {
            let randomPoint1 = NeuralNetworkTest.getRandomPoint(2, 10, 2, 10);
            let randomPoint2 = NeuralNetworkTest.getRandomPoint(2, 10, -10, 1.999);
            let randomPoint3 = NeuralNetworkTest.getRandomPoint(-10, 1.999, -10, 1.999);
            let randomPoint4 = NeuralNetworkTest.getRandomPoint(-10, 1.999, 2, 10);

            this.trainIteration(randomPoint1);
            this.trainIteration(randomPoint2);
            this.trainIteration(randomPoint3);
            error = this.trainIteration(randomPoint4);
        }

        let theWeights = this._neuralNetwork.getWeights();

        this.setState({
            weights: JSON.stringify(theWeights)
        })

        return error;
    }

    createTestData(error) {
        let dataOutOfRange = [];
        let dataInRange = [];

        for (let i = 0; i < 1000; i++) {
            let randomPoint = NeuralNetworkTest.getRandomPoint(-10, 10, -10, 10);

            let prediction = this._neuralNetwork.feedForward(randomPoint);
            let theDataSet = null;

            if (prediction[0] < prediction[1]) {
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
                if (point.x >= 2 && point.y >= 2) {
                    numCorrect++;
                }
            } else {
                if (!(point.x >= 2 && point.y >= 2)) {
                    numCorrect++;
                }
            }
        });

        return numCorrect;
    }

    getStyle(point, inRange=true) {
        if (inRange) {
            if (point.x >= 2 && point.y >= 2) {
                return {
                    color: "black"
                };
            } else {
                return {
                    color: "red"
                };
            }
        } else {
            if (point.x >= 2 && point.y >= 2) {
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
                    {point.prediction[0]}, {point.prediction[1]}
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
            {title}:&nbsp;{numCorrect}&nbsp;/&nbsp;{length}&nbsp;=&nbsp;{percentCorrect}&nbsp;%
        </div>);
    }

    /**
     * Life Cycle Step 3
     * @returns {XML}
     */
    render() {
        return (<div className="NeuralNetworkTest">
            <h4 style={{textAlign: "center"}}>
                x >= 2 and y >= 2 should be green.  All other points should be red.
            </h4>
            <div className="NeuralNetworkTestChart">
                <table>
                    <tbody>
                        <tr>
                            <td>
                                <ScatterChart width={600} height={600} margin={{top: 25, right: 25, left: 25, bottom: 25}} >
                                    <XAxis dataKey={'x'} allowDecimals={false} type="number" />
                                    <YAxis dataKey={'y'} allowDecimals={false} />
                                    <Scatter name='Out of Range' data={this.state.dataOutOfRange} fill='red' />
                                    <Scatter name='In Range' data={this.state.dataInRange} fill='green' />
                                    <CartesianGrid />
                                </ScatterChart>
                            </td>
                            <td>
                                <textarea cols={30} rows={25} defaultValue={this.state.weights}></textarea>
                            </td>
                        </tr>
                    </tbody>
                </table>
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