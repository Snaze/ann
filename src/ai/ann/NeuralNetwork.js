import React from 'react';
import DataSourceComponent from "../../DataSourceComponent";
import "./NeuralNetwork.css";
import NeuralNetworkNode from "./NeuralNetworkNode";
import NeuralNetworkDS from "../../model/NeuralNetworkDS";
import PropTypes from "prop-types";
import ArrayUtils from "../../utils/ArrayUtils";

class NeuralNetwork extends DataSourceComponent {

    constructor(props) {
        super(props);

        this._hoverColor = "aqua";
        this._strokeWidth = 8;

        this._lineOnMouseEnterRef = (e) => this._lineOnMouseEnter(e);
        this._lineOnMouseLeaveRef = (e) => this._lineOnMouseLeave(e);
    }

    get neuralNetwork() {
        return this.dataSource;
    }

    get maxLayerSize() {
        return Math.max(...this.neuralNetwork.nodesPerLayer);
    }

    get squareDimension() {
        return (this.props.height / this.maxLayerSize);
    }

    get radius() {
        return (this.squareDimension / 2.0) * this.props.radiusScaleFactor;
    }

    static getOptimalLocation(index, numItems, size, squareDimension) {
        let maxRowBlockWidth = size / numItems;
        let minRowBlockWidth = size / squareDimension;
        let rowBlockWidth = Math.max(minRowBlockWidth, maxRowBlockWidth);

        let rowBlockXLoc = index * rowBlockWidth;
        return rowBlockXLoc + (squareDimension / 2.0);
    }

    getCenterX(layerIndex) {
        let numLayers = this.neuralNetwork.nodesPerLayer.length;
        let width = this.props.width;

        return NeuralNetwork.getOptimalLocation(layerIndex, numLayers, width, this.squareDimension);
    }

    getCenterY(nodeIndex) {
        let height = this.props.height;

        return NeuralNetwork.getOptimalLocation(nodeIndex, this.maxLayerSize, height, this.squareDimension);
    }

    static getNodeKey(layerIndex, nodeIndex) {
        return `nnn_${layerIndex}_${nodeIndex}`;
    }

    static getLineKey(srcLayerIdx, srcNodeIdx, destLayerIdx, destNodeIdx) {
        return `line_${srcLayerIdx}_${srcNodeIdx}__${destLayerIdx}_${destNodeIdx}`;
    }

    _lineOnMouseEnter(e) {
        e.target.style.stroke = "Aqua";
    }

    _lineOnMouseLeave(e) {
        e.target.style.stroke = "black";
    }

    getNodesAndLines() {
        let nodes = this.getNodes();
        let toRet = [];
        let nodesPerLayer = this.neuralNetwork.nodesPerLayer;
        let nextLayerSize;
        let srcX, srcY, destX, destY, lineKey;

        for (let layerIdx = 0; layerIdx < nodesPerLayer.length; layerIdx++) {
            if (layerIdx + 1 >= nodesPerLayer.length) {
                nextLayerSize = 0;
            } else {
                nextLayerSize = nodesPerLayer[layerIdx + 1];
            }

            for (let srcNodeIdx = 0; srcNodeIdx < nodesPerLayer[layerIdx]; srcNodeIdx++) {

                srcX = this.getCenterX(layerIdx);
                srcY = this.getCenterY(srcNodeIdx);

                if (nextLayerSize > 0) {
                    for (let destNodeIdx = 0; destNodeIdx < nextLayerSize; destNodeIdx++) {
                        destX = this.getCenterX(layerIdx + 1);
                        destY = this.getCenterY(destNodeIdx);

                        lineKey = NeuralNetwork.getLineKey(layerIdx, srcNodeIdx, layerIdx+1, destNodeIdx);
                        toRet.push(<line key={lineKey}
                                         x1={srcX} y1={srcY}
                                         x2={destX} y2={destY}
                                         stroke="Black" strokeWidth={this._strokeWidth}
                                         onMouseEnter={this._lineOnMouseEnter}
                                         onMouseLeave={this._lineOnMouseLeave} />);
                    }
                } else {
                    destX = this.getCenterX(layerIdx+1);
                    destY = this.getCenterY(srcNodeIdx);

                    lineKey = NeuralNetwork.getLineKey(layerIdx, srcNodeIdx, layerIdx+1, srcNodeIdx);
                    toRet.push(<line key={lineKey}
                                     x1={srcX} y1={srcY}
                                     x2={destX} y2={destY}
                                     stroke="Black" strokeWidth={this._strokeWidth}
                                     onMouseEnter={this._lineOnMouseEnter}
                                     onMouseLeave={this._lineOnMouseLeave} />);
                }
            }
        }

        ArrayUtils.extend(toRet, nodes);

        return toRet;
    }

    getNodes() {
        let toRet = [];
        let nnn;
        let key;
        let toAdd;

        for (let layerIndex = 0; layerIndex < this.neuralNetwork.nodes.length; layerIndex++) {

            for (let nodeIndex = 0; nodeIndex < this.neuralNetwork.nodes[layerIndex].length; nodeIndex++) {
                nnn = this.neuralNetwork.nodes[layerIndex][nodeIndex];
                key = NeuralNetwork.getNodeKey(layerIndex, nodeIndex);
                toAdd = (<NeuralNetworkNode key={key}
                                                 dataSource={nnn}
                                                 centerX={this.getCenterX(layerIndex)}
                                                 centerY={this.getCenterY(nodeIndex)}
                                                 radius={this.radius}
                                                 strokeWidth={this._strokeWidth}
                                                 highlightStroke={this._hoverColor} />);
                toRet.push(toAdd);
            }
        }

        return toRet;
    }

    render() {
        return (
            <div className="NeuralNetwork">
                <svg width={this.props.width} height={this.props.height}>
                    {this.getNodesAndLines()}
                </svg>
            </div>);
    }
}

NeuralNetwork.propTypes = {
    dataSource: PropTypes.instanceOf(NeuralNetworkDS).isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    radiusScaleFactor: PropTypes.number.isRequired
};

NeuralNetwork.defaultProps = {
    radiusScaleFactor: 0.8
};

export default NeuralNetwork;