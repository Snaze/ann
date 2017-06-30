import React from 'react';
import DataSourceComponent from "../../DataSourceComponent";
import PropTypes from "prop-types";
import NeuralNetworkNodeDS from "../../model/NeuralNetworkNodeDS";
import moment from "../../../node_modules/moment/moment";

class NeuralNetworkNode extends DataSourceComponent {

    constructor(props) {
        super(props);

        this._onMouseEnterRef = (e) => this._onMouseEnter(e);
        this._onMouseLeaveRef = (e) => this._onMouseLeave(e);
        this._onMouseClickRef = (e) => this._onMouseClick(e);
        this._animationCircle = null;
        this._lastUpdate = moment();
    }

    shouldComponentUpdate (nextProps, nextState) {
        return false;
    }

    componentDidMount() {
        super.componentDidMount();

        if (!!document) {
            this._animationCircle = document.getElementsByName(this.animationCircleKey)[0];
        }
    }

    _dataSourceUpdated(e) {
        super._dataSourceUpdated(e);

        // // if (this._lastUpdate < moment().add(-4, "s")) {
        // if (e.source === "_feedForwardExecuting") {
        //     this._animationCircle.style.visibility = this.neuralNetworkNode.feedForwardExecuting ? "visible" : "hidden";
        //     // console.log(`this._animationCircle.style.visibility = ${this._animationCircle.style.visibility}`);
        // } else if (e.source === "_backPropExecuting") {
        //     this._animationCircle.style.visibility = this.neuralNetworkNode.backPropExecuting ? "visible" : "hidden";
        //     // console.log(`this._animationCircle.style.visibility = ${this._animationCircle.style.visibility}`);
        // }
        // //
        // //     this._lastUpdate = moment();
        // // }

        if (e.source === "_animating") {
            this._animationCircle.style.visibility = this.animationVisibility
        }
    }

    get animationVisibility() {
        if (this.neuralNetworkNode.animating) {
            return "visible";
        }

        return "hidden";
    }

    _onMouseEnter(e) {
        if (!!this.props.onMouseEnter) {
            this.props.onMouseEnter({
                nodeIndex: this.neuralNetworkNode.nodeIndex,
                layerIndex: this.neuralNetworkNode.layerIndex,
                originalEvent: e
            });
        }
    }

    _onMouseLeave(e) {
        if (!!this.props.onMouseLeave) {
            this.props.onMouseLeave({
                nodeIndex: this.neuralNetworkNode.nodeIndex,
                layerIndex: this.neuralNetworkNode.layerIndex,
                originalEvent: e
            });
        }
    }

    _onMouseClick(e) {
        if (!!this.props.onMouseClick) {
            this.props.onMouseClick({
                nodeIndex: this.neuralNetworkNode.nodeIndex,
                layerIndex: this.neuralNetworkNode.layerIndex,
                originalEvent: e
            });
        }
    }

    get neuralNetworkNode() {
        if (this.dataSource !== null) {
            return this.dataSource;
        }

        return {
            nodeIndex: this.props.nodeIndex,
            layerIndex: this.props.layerIndex
        };
    }

    get animationCircleKey() {
        return "svgCircle_" + this.neuralNetworkNode.layerIndex + "_" + this.neuralNetworkNode.nodeIndex;
    }

    render() {
        return (
            <svg>
                <circle
                    cx={this.props.centerX}
                    cy={this.props.centerY}
                    r={this.props.radius}
                    stroke={this.props.stroke}
                    strokeWidth={this.props.strokeWidth}
                    fill={this.props.fill}
                    onMouseEnter={this._onMouseEnterRef}
                    onMouseLeave={this._onMouseLeaveRef}
                    onClick={this._onMouseClickRef}>
                </circle>
                <circle
                    name={this.animationCircleKey}
                    cx={this.props.centerX}
                    cy={this.props.centerY}
                    visibility={this.animationVisibility}
                    pointerEvents={"none"}
                    r={0}
                    stroke={"orange"}
                    strokeWidth={this.props.strokeWidth}
                    fill="none">
                    <animate
                        attributeName="r"
                        from={0}
                        to={this.props.radius / 4.0}
                        dur="500ms"
                        repeatCount="indefinite" />
                </circle>

            </svg>
        );
    }

}

NeuralNetworkNode.propTypes = {
    dataSource: PropTypes.instanceOf(NeuralNetworkNodeDS),
    centerX: PropTypes.number.isRequired,
    centerY: PropTypes.number.isRequired,
    radius: PropTypes.number.isRequired,
    strokeWidth: PropTypes.number,
    stroke: PropTypes.string,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
    onMouseClick: PropTypes.func,
    selected: PropTypes.bool,
    fill: PropTypes.string,
    layerIndex: PropTypes.number,
    nodeIndex: PropTypes.number
};

NeuralNetworkNode.defaultProps = {
    strokeWidth: 4,
    stroke: "DarkGreen",
    fill: "Green",
    onMouseEnter: null,
    onMouseLeave: null,
    onMouseClick: null,
    selected: false
};

export default NeuralNetworkNode;