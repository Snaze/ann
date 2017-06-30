import React, { Component } from 'react';
import PropTypes from "prop-types";
import { assert } from "../../../utils/Assert";

class ActivationFunctionChart extends Component {

    getAxis(isVertical) {
        let toRet = [];

        if (isVertical) {
            toRet.push(this.getVerticalAxis());
        } else {
            toRet.push(this.getHorizontalAxis());
        }

        for (let i = 1; i <= this.props.scale; i++) {
            if (isVertical) {
                toRet.push(this.getVerticalAxisNotch(i, true, this.props.notchLength));
                toRet.push(this.getVerticalAxisNotch(i, false, this.props.notchLength));
            } else {
                toRet.push(this.getHorizontalAxisNotch(i, true, this.props.notchLength));
                toRet.push(this.getHorizontalAxisNotch(i, false, this.props.notchLength));
            }
        }

        return toRet;
    }

    getVerticalAxis() {
        return (<line key="verticalAxis" x1={this.props.width/2}
                      x2={this.props.width/2}
                      y1={0}
                      y2={this.props.height}
                      stroke={this.props.axisStroke}
                      strokeWidth={this.props.axisStrokeWidth} />);
    }

    getHorizontalAxis() {
        return (<line key="horizontalAxis" x1={0}
                      x2={this.props.width}
                      y1={this.props.height/2}
                      y2={this.props.height/2}
                      stroke={this.props.axisStroke}
                      strokeWidth={this.props.axisStrokeWidth} />);
    }

    static getNotchKey(orientation, index, isPositive) {
        let boolValue = isPositive ? "pos" : "neg";
        return `${orientation}_${index}_${boolValue}`;
    }

    getVerticalAxisNotch(index, isPositive, notchLength=16) {
        assert (this.props.scale > 0, "Scale must be greater than 0");
        assert (index <= this.props.scale && index >= 1, "1 <= scale <= index");

        let centerX = this.props.width / 2;
        let centerY = this.props.height / 2;
        let interval = (this.props.height / 2) / this.props.scale;
        let yLocation = isPositive ? centerY + (index * interval) : centerY + (index * -interval);
        let key = ActivationFunctionChart.getNotchKey("vertical", index, isPositive);

        return (<line key={key}
                      x1={centerX - (notchLength/2)}
                      x2={centerX + (notchLength/2)}
                      y1={yLocation}
                      y2={yLocation}
                      stroke={this.props.axisStroke}
                      strokeWidth={this.props.axisStrokeWidth}/>
                );
    }

    pointToScreenCoords(x, y) {
        let centerX = this.props.width / 2;
        let centerY = this.props.height / 2;
        let yInterval = (this.props.height / 2) / this.props.scale;
        let xInterval = (this.props.width / 2) / this.props.scale;

        return {
            x: centerX + (x * xInterval),
            y: centerY - (y * yInterval)
        };
    }

    getHorizontalAxisNotch(index, isPositive, notchLength=16) {
        assert (this.props.scale > 0, "Scale must be greater than 0");
        assert (index <= this.props.scale && index >= 1, "1 <= scale <= index");

        let centerX = this.props.width / 2;
        let centerY = this.props.height / 2;
        let interval = (this.props.height / 2) / this.props.scale;
        let xLocation = isPositive ? centerX + (index * interval) : centerX + (index * -interval);
        let key = ActivationFunctionChart.getNotchKey("vertical", index, isPositive);

        return (<line key={key}
                      x1={xLocation}
                      x2={xLocation}
                      y1={centerY - (notchLength/2)}
                      y2={centerY + (notchLength/2)}
                      stroke={this.props.axisStroke}
                      strokeWidth={this.props.axisStrokeWidth}/>
        );
    }

    getFunctionPath() {
        assert (this.props.scale > 0);

        if (!this.props.lineFunction) {
            return null;
        }

        let toSet = null, pointY, screenCoords;
        let intervalSize = (this.props.scale * 2) / this.props.functionIntervals;

        for (let pointX = -this.props.scale; pointX <= this.props.scale; pointX += intervalSize) {
            pointY = this.props.lineFunction(pointX);

            screenCoords = this.pointToScreenCoords(pointX, pointY);

            if (toSet === null) {
                toSet = `M ${screenCoords.x} ${screenCoords.y} `;
            } else {
                toSet += `L ${screenCoords.x} ${screenCoords.y} `;
            }
        }

        return (
            <path d={toSet.substr(0, toSet.length-1)}
                  stroke={this.props.functionStroke}
                  strokeWidth={this.props.functionStrokeWidth} fill="none" />
        );
    }

    getXLine() {
        if (this.props.x === null) {
            return null;
        }

        let xCoord = this.pointToScreenCoords(this.props.x, 0);

        return (
            <line x1={xCoord.x}
                  x2={xCoord.x}
                  y1={0}
                  y2={this.props.height}
                  stroke={this.props.xLineStroke}
                  strokeWidth={this.props.xLineStrokeWidth} />
        );
    }

    render() {
        return (
            <svg width={this.props.width} height={this.props.height}>
                {this.getAxis(false)}
                {this.getAxis(true)}
                {this.getFunctionPath()}
                {this.getXLine()}
            </svg>
        );
    }

}

ActivationFunctionChart.propTypes = {
    lineFunction: PropTypes.func,
    x: PropTypes.number,
    scale: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number,
    axisStroke: PropTypes.string,
    axisStrokeWidth: PropTypes.number,
    notchLength: PropTypes.number,
    functionStroke: PropTypes.string,
    functionStrokeWidth: PropTypes.number,
    functionIntervals: PropTypes.number,
    xLineStroke: PropTypes.string,
    xLineStrokeWidth: PropTypes.number
};

ActivationFunctionChart.defaultProps = {
    lineFunction: null,
    x: null,
    scale: 2,
    width: 128,
    height: 128,
    axisStroke: "brown",
    axisStrokeWidth: 1,
    notchLength: 16,
    functionStroke: "blue",
    functionStrokeWidth: 2,
    functionIntervals: 100,
    xLineStroke: "black",
    xLineStrokeWidth: 1
};

export default ActivationFunctionChart;