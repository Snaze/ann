import React from 'react';
import DataSourceComponent from "../../DataSourceComponent";
import PropTypes from "prop-types";
import NeuralNetworkNodeDS from "../../model/NeuralNetworkNodeDS";
import "./NeuralNetworkNodeDetail.css";
import { assert } from "../../utils/Assert";
import ArrayUtils from "../../utils/ArrayUtils";
import ActivationFunctionChart from "./charts/ActivationFunctionChart";
// import math from "../../../node_modules/mathjs/dist/math";

class NeuralNetworkNodeDetail extends DataSourceComponent {

    constructor(props) {
        super(props);

        this._radioButtonChangeRef = (e) => this._radioButtonChange(e);
        this._buttonClickRef = (e) => this._buttonClick(e);
    }

    get neuralNetworkNode() {
        return this.dataSource;
    }

    get nnn() {
        return this.neuralNetworkNode;
    }

    componentDidMount() {
        super.componentDidMount();

        this.setState({
            selectedIndex: 0,
            errorScale: 1e3,
            errorGridScale: 1e3,
            errorGridNotchSize: 1e2 // This always needs to be 1 less than errorGridScale
        });
    }

    getEquation() {
        if (!this.nnn) {
            return "";
        }

        return this.nnn.getActivationInputEquation(this.state.selectedIndex, this.props.precision)
    }

    getScale() {
        if (!this.nnn || !this.nnn.activationInput || this.nnn.activationInput.length < 0) {
            return 2;
        }

        return Math.min(Math.max(this.nnn.maxActivationInput, 2), 16);
    }

    static getTableRowKey(index) {
        return `NeuralNetworkNodeDetailRow_${index}`;
    }

    _radioButtonChange(e) {
        if (e.target.checked) {
            let selectedIndex = parseInt(e.target.dataset["index"], 10);
            this.setState({
                selectedIndex: selectedIndex
            });
        }
    }

    getRowClass(index) {
        if (index % 2 === 0) {
            return "NeuralNetworkNodeDetailEvenRow";
        }

        return "NeuralNetworkNodeDetailOddRow";
    }

    getActivationInput(index) {
        if (!this.nnn || !this.nnn.activationInput || index >= this.nnn.activationInput.length) {
            return null;
        }

        return this.nnn.activationInput[index];
    }

    getActivationFunction() {
        if (!this.nnn || !this.nnn.activationFunction) {
            return null;
        }

        return this.nnn.activationFunction.output;
    }

    getActivationDerivativeFunction() {
        if (!this.nnn || !this.nnn.activationFunction) {
            return null;
        }

        return function (x) {
            let output = this.nnn.activationFunction.output(x);
            return this.nnn.activationFunction.derivative(output);
        }.bind(this);
    }

    getErrorHistoryFunction () {
        if (!this.nnn || !this.nnn.errorHistory) {
            return null;
        }

        return function (x) {
            if (typeof(this.nnn.errorHistory[x]) === "undefined") {
                return null;
            }

            return this.nnn.errorHistory[x] * this.state.errorScale;
        }.bind(this);
    }

    calculateDerivative(x) {
        let theFunction = this.getActivationDerivativeFunction();
        if (!theFunction) {
            return 0.0;
        }

        return theFunction(x);
    }

    getErrorScaleString() {
        if (typeof(this.state.errorScale) === "undefined") {
            return "";
        }

        return this.state.errorScale.toExponential();
    }

    getErrorGridScaleString() {
        if (typeof(this.state.errorGridScale) === "undefined") {
            return "";
        }

        return this.state.errorGridScale.toExponential();
    }

    getErrorGridScale() {
        if (typeof(this.state.errorGridScale) === "undefined") {
            return 1e5;
        }

        return this.state.errorGridScale;
    }

    getErrorGridNotchSize() {
        if (typeof(this.state.errorGridNotchSize) === "undefined") {
            return 1e4;
        }

        return this.state.errorGridNotchSize;
    }

    _buttonClick(e) {
        if (e.target.name === "btnIncrement") {
            this.setState({
                errorScale: this.state.errorScale * 10
            });
        } else if (e.target.name === "btnDecrement") {
            this.setState({
                errorScale: this.state.errorScale / 10
            });
        } else if (e.target.name === "btnDecrementGridScale") {
            this.setState({
                errorGridScale: this.state.errorGridScale / 10,
                errorGridNotchSize: this.state.errorGridNotchSize / 10

            });
        } else if (e.target.name === "btnIncrementGridScale") {
            this.setState({
                errorGridScale: this.state.errorGridScale * 10,
                errorGridNotchSize: this.state.errorGridNotchSize * 10
            });
        } else {
            throw new Error("Unknown button");
        }
    }

    getTableRows() {
        let toRet = [];

        if (!this.nnn) {
            return toRet;
        }

        let activationInput = !!this.nnn.activationInput ? this.nnn.activationInput : [];
        let output = !!this.nnn.output ? this.nnn.output : [];
        let error = !!this.nnn.error ? this.nnn.error : [];

        if (this.nnn.layerIndex === 0) {
            ArrayUtils.expand(activationInput, output.length - 1, 0);
        }

        assert (activationInput.length === output.length,
            "NNN Activation Input and Output need to have same lengths");
        assert (activationInput.length === error.length,
            "NNN Activation Input and Error need to have same lengths");

        activationInput.forEach(function (activationInput, index) {
            let currentOutput = output[index];
            let currentError = error[index];
            let toAdd = (
                <tr className={"NeuralNetworkNodeDetailTopCell " + this.getRowClass(index)}
                    key={NeuralNetworkNodeDetail.getTableRowKey(index)}>
                    <td>
                        <input type="radio" checked={this.state.selectedIndex === index}
                               radioGroup="NeuralNetworkNodeDetail" data-index={index}
                               onChange={this._radioButtonChangeRef} />
                    </td>
                    <td className="NeuralNetworkNodeDetailNumericCell">
                        {index}
                    </td>
                    <td className="NeuralNetworkNodeDetailNumericCell">
                        {activationInput.toFixed(this.props.precision).toString()}
                    </td>
                    <td className="NeuralNetworkNodeDetailNumericCell">
                        {currentOutput.toFixed(this.props.precision).toString()}
                    </td>
                    <td className="NeuralNetworkNodeDetailNumericCell">
                        {this.calculateDerivative(activationInput).toFixed(this.props.precision).toString()}
                    </td>
                    <td className="NeuralNetworkNodeDetailNumericCell">
                        {currentError.toFixed(this.props.precision).toString()}
                    </td>
                </tr>
            );

            toRet.push(toAdd);
        }.bind(this));

        return toRet;
    }

    get layerIndex() {
        if (!!this.nnn) {
            return this.nnn.layerIndex.toString();
        }

        return "";
    }

    get nodeIndex() {
        if (!!this.nnn) {
            return this.nnn.nodeIndex.toString();
        }

        return "";
    }

    render() {
        // console.log("NeuralNetworkNodeDetail render");

        return (
            <table className="NeuralNetworkNodeDetail">
                <thead>
                    <tr>
                        <th className="NeuralNetworkNodeDetailMainHeader">
                            Node (Layer={this.layerIndex}, Node={this.nodeIndex})
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="NeuralNetworkNodeDetailTopCell">
                        <td className="NeuralNetworkNodeDetailNumericCell">
                            <b>Activation Input Calculation (for Mini-Batch Element {this.state.selectedIndex}):</b>
                        </td>
                    </tr>
                    <tr className="NeuralNetworkNodeDetailTopCell">
                        <td className="NeuralNetworkNodeDetailTopCell">
                            <textarea cols={60} rows={3} name="txtActivationInput"
                                      readOnly={true} title="Activation Input Calculation"
                                      value={this.getEquation()} />
                        </td>
                    </tr>
                    <tr className="NeuralNetworkNodeDetailTopCell">
                        <td className="NeuralNetworkNodeDetailTopCell">
                            <table className="NeuralNetworkNodeDetailChartTable">
                                <thead>
                                    <tr>
                                        <th>
                                            A.F.
                                        </th>
                                        <th>
                                            A.F. Derivative
                                        </th>
                                        <th>
                                            Error
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            <ActivationFunctionChart width={128} height={128}
                                                                     x={this.getActivationInput(this.state.selectedIndex)}
                                                                     lineFunction={this.getActivationFunction()}
                                                                     scale={this.getScale()} notchLength={4} />
                                        </td>
                                        <td>
                                            <ActivationFunctionChart width={128} height={128}
                                                                     x={this.getActivationInput(this.state.selectedIndex)}
                                                                     lineFunction={this.getActivationDerivativeFunction()}
                                                                     scale={this.getScale()} notchLength={4} />
                                        </td>
                                        <td>
                                            <ActivationFunctionChart width={128} height={128}
                                                                     x={null}
                                                                     lineFunction={this.getErrorHistoryFunction()}
                                                                     scale={this.getErrorGridScale()} startPoint={0}
                                                                     notchIncrement={this.getErrorGridNotchSize()} notchLength={4} />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                        </td>
                                        <td>
                                        </td>
                                        <td>
                                            <table className="NeuralNetworkNodeDetailChartTable">
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            <button name="btnDecrement" onClick={this._buttonClickRef}>v</button>
                                                        </td>
                                                        <td>
                                                            Scale: {this.getErrorScaleString()}
                                                        </td>
                                                        <td>
                                                            <button name="btnIncrement" onClick={this._buttonClickRef}>^</button>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <button name="btnDecrementGridScale" onClick={this._buttonClickRef}>v</button>
                                                        </td>
                                                        <td>
                                                            Tick: {this.getErrorGridScaleString()}
                                                        </td>
                                                        <td>
                                                            <button name="btnIncrementGridScale" onClick={this._buttonClickRef}>^</button>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                        </td>
                    </tr>
                    <tr className="NeuralNetworkNodeDetailTopCell">
                        <td className="NeuralNetworkNodeDetailTopCell">
                            <table className="NeuralNetworkNodeDetailInnerTable" cellPadding={8} cellSpacing={0}>
                                <thead className="NeuralNetworkNodeDetailInnerTableHeader">
                                    <tr>
                                        <th className="NeuralNetworkNodeDetailNumericCellHeader">

                                        </th>
                                        <th className="NeuralNetworkNodeDetailNumericCellHeader">
                                            Index
                                        </th>
                                        <th className="NeuralNetworkNodeDetailNumericCellHeader">
                                            Activation Input
                                        </th>
                                        <th className="NeuralNetworkNodeDetailNumericCellHeader">
                                            Output
                                        </th>
                                        <th className="NeuralNetworkNodeDetailNumericCellHeader">
                                            Derivative
                                        </th>
                                        <th className="NeuralNetworkNodeDetailNumericCellHeader">
                                            Error
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.getTableRows()}
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </tbody>
            </table>
        );
    }

}

NeuralNetworkNodeDetail.propTypes = {
    dataSource: PropTypes.instanceOf(NeuralNetworkNodeDS),
    precision: PropTypes.number
};

NeuralNetworkNodeDetail.defaultProps = {
    precision: 8
};

export default NeuralNetworkNodeDetail;