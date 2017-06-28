import React from 'react';
import DataSourceComponent from "../../DataSourceComponent";
import "./NeuralNetwork.css";
import NeuralNetworkNode from "./NeuralNetworkNode";
import NeuralNetworkDS from "../../model/NeuralNetworkDS";
import PropTypes from "prop-types";
import ArrayUtils from "../../utils/ArrayUtils";
import math from "../../../node_modules/mathjs/dist/math";
// import MathUtil from "../../model/ai/MathUtil";

class NeuralNetwork extends DataSourceComponent {

    constructor(props) {
        super(props);

        this._stroke = "DarkGreen";
        this._selectColor = "aqua";
        this._hoverColor = "aqua";
        this._lineColor = "black";
        this._fill = {
            active: "green",
            bias: "grey",
            inactive: "red"
        };
        this._strokeWidth = 4;
        this._selectedNodeTarget = null;
        this._inputLines = {};
        this._outputLines = {};
        this._lineKeys = [];

        this._lineOnMouseEnterRef = (e) => this._lineOnMouseEnter(e);
        this._lineOnMouseLeaveRef = (e) => this._lineOnMouseLeave(e);
        this._nodeOnMouseEnterRef = (e) => this._nodeOnMouseEnter(e);
        this._nodeOnMouseLeaveRef = (e) => this._nodeOnMouseLeave(e);
        this._nodeOnMouseClickRef = (e) => this._nodeOnMouseClick(e);
        this._svgOnMouseClickRef = (e) => this._svgOnMouseClick(e);

        // this.setState({
        //     selectedNode: null
        // });
    }

    _dataSourceUpdated(e) {
        if (e.source === "_weights") {
            this._colorLines();
        }
    }

    componentDidMount() {
        super.componentDidMount();

        this._colorLines();
    }

    _getWeight(layerIndex, nodeIndex, weightIndex) {
        if (typeof(this.neuralNetwork.weights[layerIndex]) === "undefined" ||
            typeof(this.neuralNetwork.weights[layerIndex][nodeIndex]) === "undefined" ||
            typeof(this.neuralNetwork.weights[layerIndex][nodeIndex][weightIndex]) === "undefined") {
            return null;
        }

        return this.neuralNetwork.weights[layerIndex][nodeIndex][weightIndex];
    }

    static rgb2hex(rgb){
        rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
        return (rgb && rgb.length === 4) ? "#" +
            ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
            ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
            ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
    }

    _colorLines() {
        if (!document) {
            return;
        }

        let current;
        let currentWeight;
        let data = ArrayUtils.flatten(this.neuralNetwork.weights);
        let posData = ArrayUtils.filter(data, (item) => item >= 0);
        let negData = ArrayUtils.filter(data, (item) => item < 0);
        let posMin = math.min(posData), posMax = math.max(posData);
        let negMin = math.min(negData), negMax = math.max(negData);

        let scaledValue, blueValue, greenValue,
            redValue, color, rgbaString, currentLine;

        this._lineKeys.forEach(function (lineKey, lineKeyIndex) {
            current = NeuralNetwork.parseLineKey(lineKey);
            currentWeight = this._getWeight(current.dest.layerIdx, current.dest.nodeIdx, current.src.nodeIdx);
            if (currentWeight === null) {
                currentWeight = 0;
            }

            blueValue = 0;
            greenValue = 0;
            redValue = 0;

            if (currentWeight >= 0) {
                scaledValue = (currentWeight - posMin) / (posMax - posMin);
                blueValue = Math.floor(scaledValue * 255);
            } else {
                scaledValue = (currentWeight - negMin) / (negMax - negMin);
                redValue = Math.floor((1.0 - scaledValue) * 255);
            }

            rgbaString = `rgba(${redValue}, ${greenValue}, ${blueValue}, 1)`;
            color = NeuralNetwork.rgb2hex(rgbaString);

            currentLine = document.getElementById(lineKey);
            if (!!currentLine) {
                currentLine.style.stroke = color;
                currentLine.dataset["originalColor"] = color;
                // Should be the title
                currentLine.childNodes[0].innerHTML = currentWeight.toString();
            }
        }.bind(this));
    }

    static createSelectedNodeObject(layerIdx, nodeIdx) {
        return {
            layerIndex: layerIdx,
            nodeIndex: nodeIdx
        };
    }

    shouldComponentUpdate (nextProps, nextState) {
        return false;
    }

    get neuralNetwork() {
        return this.dataSource;
    }

    get maxLayerSize() {
        let nodesPerLayer = this.neuralNetwork.nodesPerLayer;
        if (this.neuralNetwork.includeBias) {
            nodesPerLayer = ArrayUtils.copy(nodesPerLayer);
            nodesPerLayer = nodesPerLayer.map((item) => item + 1);
        }

        return Math.max(...nodesPerLayer);
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
        return `${srcLayerIdx}_${srcNodeIdx}__${destLayerIdx}_${destNodeIdx}`;
    }

    static parseLineKey(lineKey) {
        let temp = lineKey.split(/_/);
        return {
            src: {
                layerIdx: parseInt(temp[0], 10),
                nodeIdx: parseInt(temp[1], 10)
            },
            dest: {
                layerIdx: parseInt(temp[3], 10),
                nodeIdx: parseInt(temp[4], 10)
            }
        };
    }

    _svgOnMouseClick(e) {
        if (e.target.tagName === "svg") {
            this._setAllLineVisibility("visible");
        }
    }

    _onLeave(e, color) {
        e.target.style.stroke = color;
    }

    _onEnter(e) {
        e.target.style.stroke = this._selectColor;
    }

    _lineOnMouseEnter(e) {
        if (!e.target.dataset["originalColor"]) {
            e.target.dataset["originalColor"] = e.target.style.stroke;
        }

        e.target.style.stroke = this._selectColor;
    }

    _lineOnMouseLeave(e) {

        e.target.style.stroke = e.target.dataset["originalColor"];
    }

    _nodeOnMouseEnter(e) {
        if (this._isNodeSelected(e.layerIndex, e.nodeIndex)) {
            return;
        }

        this._onEnter(e.originalEvent);
    }

    _nodeOnMouseLeave(e) {
        if (this._isNodeSelected(e.layerIndex, e.nodeIndex)) {
            return;
        }

        this._onLeave(e.originalEvent, this._stroke);
    }

    _setAllLineVisibility(visibility="visible") {
        if (!document) {
            return;
        }

        let currentLineKey;
        let currentLine;

        for (let i = 0; i < this._lineKeys.length; i++) {
            currentLineKey = this._lineKeys[i];
            currentLine = document.getElementById(currentLineKey);

            if (!!currentLine) {
                currentLine.style.visibility = visibility;
            }
        }
    }

    _toggleVisibleLines(nodeKey) {
        if (!document) {
            return;
        }

        let currentLineKey;
        let currentLine;

        for (let i = 0; i < this._lineKeys.length; i++) {
            currentLineKey = this._lineKeys[i];
            currentLine = document.getElementById(currentLineKey);

            if (!!currentLine) {
                if ((!!this._inputLines[nodeKey] && currentLineKey in this._inputLines[nodeKey]) ||
                    (!!this._outputLines[nodeKey] && currentLineKey in this._outputLines[nodeKey])) {
                    currentLine.style.visibility = "visible";
                } else {
                    currentLine.style.visibility = "hidden";
                }
            }
        }
    }

    _nodeOnMouseClick(e) {

        if (!!this._selectedNodeTarget) {
            this._selectedNodeTarget.style.stroke = this._stroke;
            this._selectedNodeTarget = null;
        }

        let selectedNode = NeuralNetwork.createSelectedNodeObject(e.layerIndex, e.nodeIndex);
        let nodeKey = NeuralNetwork.getNodeKey(e.layerIndex, e.nodeIndex);

        this._selectedNodeTarget = e.originalEvent.target;

        this._onEnter(e.originalEvent);
        this._toggleVisibleLines(nodeKey);

        this.setState({
            selectedNode: selectedNode
        });
    }

    _isNodeSelected(layerIndex, nodeIndex) {
        return !!this.state.selectedNode &&
            this.state.selectedNode.layerIndex === layerIndex &&
            this.state.selectedNode.nodeIndex === nodeIndex;
    }

    getNodesAndLines() {
        let nodes = this.getNodes();
        let toRet = [];
        let nodesPerLayer = this.neuralNetwork.nodesPerLayer;
        let nextLayerSize;
        let srcX, srcY, destX, destY, lineKey, numSrcNodes;

        for (let layerIdx = 0; layerIdx < nodesPerLayer.length; layerIdx++) {

            numSrcNodes = nodesPerLayer[layerIdx];

            if (this.neuralNetwork.includeBias) {
                numSrcNodes += 1;
            }

            if (layerIdx + 1 >= nodesPerLayer.length) {
                nextLayerSize = 0;
            } else {
                nextLayerSize = nodesPerLayer[layerIdx + 1];
            }

            for (let srcNodeIdx = 0; srcNodeIdx < numSrcNodes; srcNodeIdx++) {

                srcX = this.getCenterX(layerIdx);
                srcY = this.getCenterY(srcNodeIdx);

                if (nextLayerSize > 0) {
                    for (let destNodeIdx = 0; destNodeIdx < nextLayerSize; destNodeIdx++) {
                        destX = this.getCenterX(layerIdx + 1);
                        destY = this.getCenterY(destNodeIdx);

                        lineKey = NeuralNetwork.getLineKey(layerIdx, srcNodeIdx, layerIdx+1, destNodeIdx);

                        toRet.push(<line key={lineKey}
                                         id={lineKey}
                                         x1={srcX} y1={srcY}
                                         x2={destX} y2={destY}
                                         stroke="White" opacity={0.8}
                                         strokeWidth={this._strokeWidth}
                                         onMouseEnter={this._lineOnMouseEnterRef}
                                         onMouseLeave={this._lineOnMouseLeaveRef}>
                            <title>{lineKey}</title>
                        </line>);

                        let inputNodeKey = NeuralNetwork.getNodeKey(layerIdx+1, destNodeIdx);
                        if (!this._inputLines[inputNodeKey]) {
                            this._inputLines[inputNodeKey] = {};
                        }
                        this._inputLines[inputNodeKey][lineKey] = true;

                        let outputNodeKey = NeuralNetwork.getNodeKey(layerIdx, srcNodeIdx);
                        if (!this._outputLines[outputNodeKey]) {
                            this._outputLines[outputNodeKey] = {};
                        }
                        this._outputLines[outputNodeKey][lineKey] = true;

                        this._lineKeys.push(lineKey);
                    }

                    if (this.neuralNetwork.includeBias) {
                        lineKey = NeuralNetwork.getLineKey(layerIdx, srcNodeIdx, layerIdx+1, nextLayerSize+1);
                        let outputNodeKey = NeuralNetwork.getNodeKey(layerIdx, srcNodeIdx);
                        if (!this._outputLines[outputNodeKey]) {
                            this._outputLines[outputNodeKey] = {};
                        }
                        this._outputLines[outputNodeKey][lineKey] = true;

                        this._lineKeys.push(lineKey);
                    }
                } else if (!this.neuralNetwork.includeBias ||
                    (this.neuralNetwork.includeBias && srcNodeIdx < (numSrcNodes - 1))) {
                    destX = this.getCenterX(layerIdx+1);
                    destY = this.getCenterY(srcNodeIdx);

                    lineKey = NeuralNetwork.getLineKey(layerIdx, srcNodeIdx, layerIdx+1, srcNodeIdx);
                    toRet.push(<line key={lineKey}
                                     id={lineKey}
                                     x1={srcX} y1={srcY}
                                     x2={destX} y2={destY} opacity={0.8}
                                     stroke="White" strokeWidth={this._strokeWidth}
                                     onMouseEnter={this._lineOnMouseEnterRef}
                                     onMouseLeave={this._lineOnMouseLeaveRef}>
                        <title>{lineKey}</title>
                    </line>);
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
        let toAdd, stroke = this._stroke;
        let numNodesInLayer, fill;
        let numLayers = this.neuralNetwork.nodes.length;

        for (let layerIndex = 0; layerIndex < numLayers; layerIndex++) {

            numNodesInLayer = this.neuralNetwork.nodes[layerIndex].length;

            if (this.neuralNetwork.includeBias && layerIndex < (numLayers - 1)) {
                numNodesInLayer += 1;
            }

            for (let nodeIndex = 0; nodeIndex < numNodesInLayer; nodeIndex++) {
                if (this._isNodeSelected(layerIndex, nodeIndex)) {
                    stroke = this._selectColor;
                }

                if (this.neuralNetwork.includeBias
                    && nodeIndex === (numNodesInLayer - 1)
                    && layerIndex < (numLayers - 1)) {
                    fill = this._fill.bias;
                    nnn = null;
                } else {
                    fill = this._fill.active;
                    nnn = this.neuralNetwork.nodes[layerIndex][nodeIndex];
                }

                key = NeuralNetwork.getNodeKey(layerIndex, nodeIndex);
                toAdd = (<NeuralNetworkNode key={key}
                                            id={key}
                                                 dataSource={nnn}
                                                 centerX={this.getCenterX(layerIndex)}
                                                 centerY={this.getCenterY(nodeIndex)}
                                                 radius={this.radius}
                                                 stroke={stroke}
                                                 strokeWidth={this._strokeWidth}
                                                 fill={fill}
                                                 onMouseEnter={this._nodeOnMouseEnterRef}
                                                 onMouseLeave={this._nodeOnMouseLeaveRef}
                                                 onMouseClick={this._nodeOnMouseClickRef}
                                                 layerIndex={layerIndex}
                                                 nodeIndex={nodeIndex} />);
                toRet.push(toAdd);
            }
        }

        return toRet;
    }

    render() {
        return (
            <div className="NeuralNetwork" name="NeuralNetworkSVG" style={{backgroundColor: "Grey"}}>
                <svg width={this.props.width} height={this.props.height} onClick={this._svgOnMouseClickRef}>
                    {this.getNodesAndLines()}
                </svg>
            </div>);
    }
}

NeuralNetwork.propTypes = {
    dataSource: PropTypes.instanceOf(NeuralNetworkDS).isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    radiusScaleFactor: PropTypes.number
};

NeuralNetwork.defaultProps = {
    radiusScaleFactor: 0.8
};

export default NeuralNetwork;