import math from "../../../../node_modules/mathjs/dist/math";

/**
 * https://theclevermachine.wordpress.com/2014/09/08/derivation-derivatives-for-common-neural-network-activation-functions/
 */
class ActivationFunctions {

    static _all = null;
    static get all() {
        if (ActivationFunctions._all === null) {
            ActivationFunctions._all = [
                ActivationFunctions.sigmoid,
                ActivationFunctions.tanh,
                ActivationFunctions.relu,
                ActivationFunctions.lrelu
            ];
        }

        return ActivationFunctions._all;
    }

    static _sigmoid = null;
    static get sigmoid() {
        if (ActivationFunctions._sigmoid === null) {
            ActivationFunctions._sigmoid = {
                output: function (x) {
                    return math.chain(math.e).pow(math.multiply(-1, x)).add(1.0).inv().done();
                },
                outputError: function (targetValue, outputValue) {
                    // let outMinusTarget = math.subtract(outputValue, targetValue);
                    let targetMinusOutput = math.subtract(targetValue, outputValue);
                    let sigmoidChange = math.multiply(math.subtract(1.0, outputValue), outputValue);

                    return math.multiply(targetMinusOutput, sigmoidChange);
                },

                /**
                 * @param nextLayerErrors This should be an array consisting of the error for each node of the next layer.
                 * @param nextNodeWeights This should be an array consisting of the weight edges exiting this node.
                 * @param currentNodeOutputValue The output value of the current node.
                 * @returns {Number} Error of this node.
                 */
                hiddenError: function (nextLayerErrors, nextNodeWeights, currentNodeOutputValue) {
                    return math.chain(1.0).subtract(currentNodeOutputValue)
                        .multiply(currentNodeOutputValue)
                        .multiply(math.dot(nextLayerErrors, nextNodeWeights))
                        .done();
                }
            };
        }

        return ActivationFunctions._sigmoid;
    }

    static _tanh = null;
    static get tanh() {
        if (ActivationFunctions._tanh === null) {
            ActivationFunctions._tanh = {
                output: function (x) {
                    let numerator = math.subtract(1, math.pow(math.e, math.multiply(-2, x)));
                    let denominator = math.add(1, math.pow(math.e, math.multiply(-2, x)));
                    return math.divide(numerator, denominator);
                },
                outputError: function (targetValue, outputValue) {
                    let targetMinusOutput = math.subtract(targetValue, outputValue);
                    let tanhChange = math.subtract(1.0, math.pow(outputValue, 2));

                    return math.multiply(targetMinusOutput, tanhChange);
                },

                /**
                 * @param nextLayerErrors This should be an array consisting of the error for each node of the next layer.
                 * @param nextNodeWeights This should be an array consisting of the weight edges exiting this node.
                 * @param outputValue The output value of the current node.
                 * @returns {Number} Error of this node.
                 */
                hiddenError: function (nextLayerErrors, nextNodeWeights, outputValue) {
                    return math.chain(math.subtract(1.0, math.pow(outputValue, 2)))
                        .multiply(math.dot(nextLayerErrors, nextNodeWeights))
                        .done();
                }
            };
        }

        return ActivationFunctions._tanh;
    }

    static _relu = null;
    static get relu() {
        if (ActivationFunctions._relu === null) {
            ActivationFunctions._relu = {
                output: function (x) {
                    return math.max(0, x);
                },
                outputError: function (targetValue, outputValue) {
                    let targetMinusOutput = math.subtract(targetValue, outputValue);
                    let derivative = outputValue > 0 ? 1 : 0;

                    return math.multiply(targetMinusOutput, derivative);
                },
                hiddenError: function (nextLayerErrors, nextNodeWeights, outputValue) {
                    let derivative = outputValue > 0 ? 1 : 0;
                    let dotProduct = math.dot(nextLayerErrors, nextNodeWeights);

                    return math.multiply(derivative, dotProduct);
                }
            };
        }

        return ActivationFunctions._relu;
    }

    static _lrelu = null;
    static get lrelu() {
        if (ActivationFunctions._lrelu === null) {
            ActivationFunctions._lrelu = {
                output: function (x) {
                    return math.max(0, x);
                },
                outputError: function (targetValue, outputValue) {
                    let targetMinusOutput = math.subtract(targetValue, outputValue);
                    let derivative = outputValue > 0 ? 1 : 0.01;

                    return math.multiply(targetMinusOutput, derivative);
                },
                hiddenError: function (nextLayerErrors, nextNodeWeights, outputValue) {
                    let derivative = outputValue > 0 ? 1 : 0.01;
                    let dotProduct = math.dot(nextLayerErrors, nextNodeWeights);

                    return math.multiply(derivative, dotProduct);
                }
            };
        }

        return ActivationFunctions._lrelu;
    }

}

export default ActivationFunctions;