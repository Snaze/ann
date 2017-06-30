import React from 'react';
import ReactDOM from 'react-dom';
import ActivationFunctionChart from "./ActivationFunctionChart";
import ActivationFunctions from "../../../model/ai/ann/ActivationFunctions";

const getActivationFunctionChart = function (activationFunction, x, functionIntervals=2) {
    const div = document.createElement('div');

    // let activationFunction = ActivationFunctions.sigmoid;
    // let x = 0;

    return ReactDOM.render(<ActivationFunctionChart
        lineFunction={activationFunction.output} x={x}
        width={128} height={128} axisStroke={"brown"} axisStrokeWidth={1} functionIntervals={2} />, div);
};

it('renders without crashing', () => {

    let activationFunction = ActivationFunctions.sigmoid;
    let x = 0;

    getActivationFunctionChart(activationFunction, x);
});

let verifyVerticalAxis = function (verticalAxis) {
    expect(verticalAxis.type).toBe("line");
    expect(verticalAxis.props.x1).toBe(128 / 2);
    expect(verticalAxis.props.x2).toBe(128 / 2);
    expect(verticalAxis.props.y1).toBe(0);
    expect(verticalAxis.props.y2).toBe(128);
    expect(verticalAxis.props.stroke).toBe("brown");
    expect(verticalAxis.props.strokeWidth).toBe(1);
};

it ("getVerticalAxis", () => {
    // SETUP
    let chart = getActivationFunctionChart(ActivationFunctions.sigmoid, 1);

    // CALL
    let verticalAxis = chart.getVerticalAxis();

    // ASSERT
    verifyVerticalAxis(verticalAxis);
});

let verifyVerticalAxisNotch = function (index, isPositive, notchLength, verticalAxisNotch) {
    let number = isPositive ? index : -index;

    expect(verticalAxisNotch.type).toBe("line");
    expect(verticalAxisNotch.props.x1).toBe((128 / 2) - (notchLength / 2));
    expect(verticalAxisNotch.props.x2).toBe((128 / 2) + (notchLength / 2));
    expect(verticalAxisNotch.props.y1).toBe((128 / 2) + number * (128 / 4));
    expect(verticalAxisNotch.props.y2).toBe((128 / 2) + number * (128 / 4));
    expect(verticalAxisNotch.props.stroke).toBe("brown");
    expect(verticalAxisNotch.props.strokeWidth).toBe(1);
};

it ("getVerticalAxisNotch", () => {
    // SETUP
    let chart = getActivationFunctionChart(ActivationFunctions.sigmoid, 1);
    let notchLength = 16;

    // CALL
    let verticalAxisNotch = chart.getVerticalAxisNotch(1, true, notchLength);

    // ASSERT
    verifyVerticalAxisNotch(1, true, notchLength, verticalAxisNotch);
});

const verifyHorizontalAxis = function (horizontalAxis) {
    expect(horizontalAxis.type).toBe("line");
    expect(horizontalAxis.props.x1).toBe(0);
    expect(horizontalAxis.props.x2).toBe(128);
    expect(horizontalAxis.props.y1).toBe(128 / 2);
    expect(horizontalAxis.props.y2).toBe(128 / 2);
    expect(horizontalAxis.props.stroke).toBe("brown");
    expect(horizontalAxis.props.strokeWidth).toBe(1);
};

it ("getHorizontalAxis", () => {
    // SETUP
    let chart = getActivationFunctionChart(ActivationFunctions.sigmoid, 1);

    // CALL
    let horizontalAxis = chart.getHorizontalAxis();

    // ASSERT
    verifyHorizontalAxis(horizontalAxis);
});

const verifyHorizontalAxisNotch = function (index, isPositive, notchLength, horizontalAxisNotch) {
    let number = isPositive ? index : -index;

    expect(horizontalAxisNotch.type).toBe("line");
    expect(horizontalAxisNotch.props.x1).toBe((128/2) + number * (128/4));
    expect(horizontalAxisNotch.props.x2).toBe((128/2) + number * (128/4));
    expect(horizontalAxisNotch.props.y1).toBe((128/2) - (notchLength / 2));
    expect(horizontalAxisNotch.props.y2).toBe((128/2) + (notchLength / 2));
    expect(horizontalAxisNotch.props.stroke).toBe("brown");
    expect(horizontalAxisNotch.props.strokeWidth).toBe(1);
};

it ("getHorizontalAxisNotch", () => {
    // SETUP
    let chart = getActivationFunctionChart(ActivationFunctions.sigmoid, 1);
    let notchLength = 16;
    let index = 1;
    let isPositive = false;

    // CALL
    let horizontalAxisNotch = chart.getHorizontalAxisNotch(index, isPositive, notchLength);

    // ASSERT
    verifyHorizontalAxisNotch(index, isPositive, notchLength, horizontalAxisNotch);
});

it ("getAxis horizontal", () => {
    // SETUP
    let chart = getActivationFunctionChart(ActivationFunctions.sigmoid, 1);

    // CALL
    let axis = chart.getAxis(false);

    // ASSERT
    expect(axis.length).toBe(5);
    verifyHorizontalAxis(axis[0]);
    verifyHorizontalAxisNotch(1, true, 16, axis[1]);
    verifyHorizontalAxisNotch(1, false, 16, axis[2]);
    verifyHorizontalAxisNotch(2, true, 16, axis[3]);
    verifyHorizontalAxisNotch(2, false, 16, axis[4]);

});

it ("getAxis vertical", () => {
    // SETUP
    let chart = getActivationFunctionChart(ActivationFunctions.sigmoid, 1);

    // CALL
    let axis = chart.getAxis(true);

    // ASSERT
    expect(axis.length).toBe(5);
    verifyVerticalAxis(axis[0]);
    verifyVerticalAxisNotch(1, true, 16, axis[1]);
    verifyVerticalAxisNotch(1, false, 16, axis[2]);
    verifyVerticalAxisNotch(2, true, 16, axis[3]);
    verifyVerticalAxisNotch(2, false, 16, axis[4]);

});

it ("pointToScreenCoords", () => {
    // SETUP
    let chart = getActivationFunctionChart(ActivationFunctions.sigmoid, 1);
    let x = 0.8, y = -0.8, center = (128/2);

    // CALL
    let screenCoord = chart.pointToScreenCoords(x, y);

    // ASSERT
    expect(screenCoord.x).toBe(center + 0.8 * (center/2));
    expect(screenCoord.y).toBe(center + 0.8 * (center/2));
});

it ("getFunctionPath", () => {
    // SETUP
    let chart = getActivationFunctionChart({
        output: function (x) {
            return x;
        }
    }, 1);

    // CALL
    let path = chart.getFunctionPath();

    // ASSERT
    expect(path.type).toBe("path");
    expect(path.props.d).toBe("M 0 128 L 64 64 L 128 0");
});

it ("getFunctionPath returns null for null", () => {
    // SETUP
    let chart = getActivationFunctionChart({
        output: null
    }, 1);

    // CALL
    let path = chart.getFunctionPath();

    // ASSERT
    expect(path).toBe(null);
});