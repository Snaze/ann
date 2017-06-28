import React from 'react';
import DataSourceComponent from "../../DataSourceComponent";
import PropTypes from "prop-types";
import NeuralNetworkNodeDS from "../../model/NeuralNetworkNodeDS";

class NeuralNetworkNode extends DataSourceComponent {

    constructor(props) {
        super(props);

        this._onMouseEnterRef = (e) => this._onMouseEnter(e);
        this._onMouseLeaveRef = (e) => this._onMouseLeave(e);
        this._onMouseClickRef = (e) => this._onMouseClick(e);
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

    getAnimationCircle() {
        if (!!this.neuralNetworkNode.feedForwardExecuting ||
            !!this.neuralNetworkNode.backPropExecuting) {
            return (
                <circle
                    cx={this.props.centerX}
                    cy={this.props.centerY}
                    r={0}
                    stroke={this.props.stroke}
                    strokeWidth={this.props.strokeWidth}
                    fill="none">
                    <animate
                        attributeName="r"
                        from={0}
                        to={this.radius}
                        dur="0.5s"
                        repeatCount="indefinite"
                    />
                </circle>
            );
        }

        return null;
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
                {this.getAnimationCircle()}

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