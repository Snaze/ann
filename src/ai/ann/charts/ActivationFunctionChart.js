import React, { Component } from 'react';
import PropTypes from "prop-types";
import { assert } from "../../../utils/Assert";

class ActivationFunctionChart extends Component {

    getAxis(isVertical) {
        assert (this.props.notchIncrement <= this.props.scale, "notch increment must be less than scale");

        let toRet = [];

        if (isVertical) {
            toRet.push(this.getVerticalAxis());
        } else {
            toRet.push(this.getHorizontalAxis());
        }

        for (let i = this.props.notchIncrement; i <= this.props.scale; i += this.props.notchIncrement) {
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

    getFunctionPath(startPoint=-this.props.scale) {
        assert (this.props.scale > 0);
        assert (startPoint >= -this.props.scale && startPoint <= this.props.scale);

        if (!this.props.lineFunction) {
            return null;
        }

        let toSet = " ", pointY, screenCoords;
        let intervalSize = (this.props.scale * 2) / this.props.functionIntervals;

        for (let pointX = startPoint; pointX <= this.props.scale; pointX += intervalSize) {
            pointY = this.props.lineFunction(pointX);

            if ((pointY === null) || (pointY === "undefined")) {
                break;
            }

            screenCoords = this.pointToScreenCoords(pointX, pointY);

            if (toSet === " ") {
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
        let startPoint = this.props.startPoint === null ? -this.props.scale : this.props.startPoint;

        return (
            <svg width={this.props.width} height={this.props.height}>
                {this.getAxis(false)}
                {this.getAxis(true)}
                {this.getFunctionPath(startPoint)}
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
    xLineStrokeWidth: PropTypes.number,
    notchIncrement: PropTypes.number,
    startPoint: PropTypes.number
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
    xLineStrokeWidth: 1,
    notchIncrement: 1,
    startPoint: null
};

export default ActivationFunctionChart;