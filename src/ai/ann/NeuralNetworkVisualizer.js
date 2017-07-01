import React from 'react';
import DataSourceComponent from "../../DataSourceComponent";
import PropTypes from "prop-types";
import NeuralNetworkDS from "../../model/NeuralNetworkDS";
// import moment from "../../../node_modules/moment/moment";
import "./NeuralNetworkVisualizer.css";
// import { assert } from "../../utils/Assert";
import {default as NeuralNetworkSVG} from "./NeuralNetwork";
import NeuralNetworkNodeDetail from "./NeuralNetworkNodeDetail";

class NeuralNetworkVisualizer extends DataSourceComponent {

    constructor(props) {
        super(props);

        this._onNodeSelectedRef = (e) => this._onNodeSelected(e);
    }

    _dataSourceChanged() {
        super._dataSourceChanged();

        console.log("NeuralNetworkVisualizer dataSourceChanged");
    }

    componentDidMount() {
        super.componentDidMount();

        this.setState({
            selectedNNN: null
        });
    }

    get neuralNetwork() {
        return this.dataSource;
    }

    get nn() {
        return this.neuralNetwork;
    }

    get svgWidth() {
        return this.props.svgPercent * this.props.width;
    }

    get svgHeight() {
        return this.props.svgPercent * this.props.height;
    }

    get detailWidth() {
        return (1 - this.props.svgPercent) * this.props.width;
    }

    get detailHeight() {
        return (1 - this.props.svgPercent) * this.props.height;
    }

    _onNodeSelected(e) {
        if (!e.selectedNode) {
            this.setState({
                selectedNNN: null
            });

            return;
        }

        let selectedNode = this.nn.getNeuralNetworkNode(e.selectedNode.layerIndex, e.selectedNode.nodeIndex);
        this.setState({
            selectedNNN: selectedNode
        });
    }

    render() {
        return (
            <table className="NeuralNetworkVisualizer">
                <tbody>
                    <tr>
                        <td className="NeuralNetworkVisualizerTableCell">
                            <NeuralNetworkSVG
                                dataSource={this.nn}
                                width={this.svgWidth}
                                height={this.svgHeight}
                                onNodeSelected={this._onNodeSelectedRef}
                            />
                        </td>
                        <td className="NeuralNetworkVisualizerTableCell">
                            <NeuralNetworkNodeDetail dataSource={this.state.selectedNNN} />
                        </td>
                    </tr>
                </tbody>
            </table>
        );
    }
}

NeuralNetworkVisualizer.propTypes = {
    dataSource: PropTypes.instanceOf(NeuralNetworkDS),
    // TODO: make the widths and heights work with percentages
    width: PropTypes.number,
    height: PropTypes.number,
    svgPercent: PropTypes.number
};

NeuralNetworkVisualizer.defaultProps = {
    width: 800,
    height: 640,
    svgPercent: 0.75
};

export default NeuralNetworkVisualizer;