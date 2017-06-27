import React from 'react';
import DataSourceComponent from "../../DataSourceComponent";
import PropTypes from "prop-types";
import NeuralNetworkNodeDS from "../../model/NeuralNetworkNodeDS";

class NeuralNetworkNode extends DataSourceComponent {

    constructor(props) {
        super(props);

        this._onMouseEnterRef = (e) => this._onMouseEnter(e);
        this._onMouseLeaveRef = (e) => this._onMouseLeave(e);
    }

    _onMouseEnter(e) {
        e.target.style.stroke = this.props.highlightStroke;
    }

    _onMouseLeave(e) {
        e.target.style.stroke = this.props.stroke;
    }

    get neuralNetworkNode() {
        return this.dataSource;
    }

    getAnimationCircle() {
        if (this.neuralNetworkNode.feedForwardExecuting ||
            this.neuralNetworkNode.backPropExecuting) {
            return (
                <circle
                    cx={this.props.centerX}
                    cy={this.props.centerY}
                    r={0}
                    stroke="DarkGreen"
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
                    stroke="DarkGreen"
                    strokeWidth={this.props.strokeWidth}
                    fill="green"
                    onMouseEnter={this._onMouseEnterRef}
                    onMouseLeave={this._onMouseLeaveRef}>
                </circle>
                {this.getAnimationCircle()}
            </svg>
        );
    }

}

NeuralNetworkNode.propTypes = {
    dataSource: PropTypes.instanceOf(NeuralNetworkNodeDS).isRequired,
    centerX: PropTypes.number.isRequired,
    centerY: PropTypes.number.isRequired,
    radius: PropTypes.number.isRequired,
    strokeWidth: PropTypes.number,
    stroke: PropTypes.string,
    highlightStroke: PropTypes.string
};

NeuralNetworkNode.defaultProps = {
    strokeWidth: 4,
    stroke: "DarkGreen",
    highlightStroke: "aqua"
};

export default NeuralNetworkNode;