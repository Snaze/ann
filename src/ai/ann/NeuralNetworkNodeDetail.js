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
    }

    // _updateScale() {
    //     if (!!this.nnn && !!this.nnn.activationInput && this.nnn.activationInput.length > 0) {
    //         let toSet = math.max(math.ceil(math.abs(this.nnn.activationInput)));
    //         this.setState({
    //             scale: toSet
    //         });
    //     } else {
    //         this.setState({
    //             scale: 3
    //         });
    //     }
    // }

    // componentWillReceiveProps(nextProps) {
    //     super.componentWillReceiveProps(nextProps);
    //
    //     this._updateScale();
    // }

    // _dataSourceUpdated(e) {
    //     super._dataSourceUpdated(e);
    //
    //     this._updateScale();
    // }

    // _dataSourceChanged() {
    //     this._updateScale();
    //
    //     super._dataSourceChanged();
    // }

    get neuralNetworkNode() {
        return this.dataSource;
    }

    get nnn() {
        return this.neuralNetworkNode;
    }

    componentDidMount() {
        super.componentDidMount();

        this.setState({
            selectedIndex: 0
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

        return Math.max(this.nnn.maxActivationInput, 2);
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
                            <ActivationFunctionChart width={128} height={128}
                                                     x={this.getActivationInput(this.state.selectedIndex)}
                                                     lineFunction={this.getActivationFunction()}
                                                     scale={this.getScale()} />
                        </td>
                    </tr>
                    <tr className="NeuralNetworkNodeDetailTopCell">
                        <td className="NeuralNetworkNodeDetailTopCell">
                            <table className="NeuralNetworkNodeDetailInnerTable" cellPadding={2} cellSpacing={0}>
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