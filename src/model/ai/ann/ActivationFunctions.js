import math from "../../../../node_modules/mathjs/dist/math";

/**
 * https://theclevermachine.wordpress.com/2014/09/08/derivation-derivatives-for-common-neural-network-activation-functions/
 *
 * TODO: refactor outputError and hiddenError into the node itself.  They are all the same.
 */
class ActivationFunctions {

    static _all = null;
    static get all() {
        if (ActivationFunctions._all === null) {
            ActivationFunctions._all = [
                ActivationFunctions.sigmoid,
                ActivationFunctions.tanh,
                ActivationFunctions.relu,
                ActivationFunctions.lrelu,
                ActivationFunctions.identity
            ];
        }

        return ActivationFunctions._all;
    }

    static _identity = null;
    static get identity() {
        if (ActivationFunctions._identity === null) {
            ActivationFunctions._identity = {
                output: function (x) {
                    return x;
                },
                derivative: function (x) {
                    return 1;
                },
                outputError: function (targetValue, outputValue) {
                    // let outMinusTarget = math.subtract(outputValue, targetValue);
                    let targetMinusOutput = math.subtract(targetValue, outputValue);
                    let derivative = ActivationFunctions._identity.derivative(outputValue);

                    return math.multiply(targetMinusOutput, derivative);
                },

                /**
                 * @param nextLayerErrors This should be an array consisting of the error for each node of the next layer.
                 * @param nextNodeWeights This should be an array consisting of the weight edges exiting this node.
                 * @param outputValue The output value of the current node.
                 * @returns {Number} Error of this node.
                 */
                hiddenError: function (nextLayerErrors, nextNodeWeights, outputValue) {
                    let derivative = ActivationFunctions._identity.derivative(outputValue);

                    return math.chain(derivative)
                        .multiply(math.dot(nextLayerErrors, nextNodeWeights))
                        .done();
                }
            };
        }

        return ActivationFunctions._identity;
    }

    static _sigmoid = null;
    static get sigmoid() {
        if (ActivationFunctions._sigmoid === null) {
            ActivationFunctions._sigmoid = {
                output: function (x) {
                    return math.chain(math.e).pow(math.multiply(-1, x)).add(1.0).inv().done();
                },
                derivative: function (x) {
                    return math.multiply(math.subtract(1.0, x), x);
                },
                outputError: function (targetValue, outputValue) {
                    // let outMinusTarget = math.subtract(outputValue, targetValue);
                    let targetMinusOutput = math.subtract(targetValue, outputValue);
                    let derivative = ActivationFunctions._sigmoid.derivative(outputValue);

                    return math.multiply(targetMinusOutput, derivative);
                },

                /**
                 * @param nextLayerErrors This should be an array consisting of the error for each node of the next layer.
                 * @param nextNodeWeights This should be an array consisting of the weight edges exiting this node.
                 * @param outputValue The output value of the current node.
                 * @returns {Number} Error of this node.
                 */
                hiddenError: function (nextLayerErrors, nextNodeWeights, outputValue) {
                    let derivative = ActivationFunctions._sigmoid.derivative(outputValue);

                    return math.chain(derivative)
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
                derivative: function (x) {
                    return math.subtract(1.0, math.pow(x, 2));
                },
                outputError: function (targetValue, outputValue) {
                    let targetMinusOutput = math.subtract(targetValue, outputValue);
                    let derivative = ActivationFunctions._tanh.derivative(outputValue);

                    return math.multiply(targetMinusOutput, derivative);
                },

                /**
                 * @param nextLayerErrors This should be an array consisting of the error for each node of the next layer.
                 * @param nextNodeWeights This should be an array consisting of the weight edges exiting this node.
                 * @param outputValue The output value of the current node.
                 * @returns {Number} Error of this node.
                 */
                hiddenError: function (nextLayerErrors, nextNodeWeights, outputValue) {
                    let derivative = ActivationFunctions._tanh.derivative(outputValue);

                    return math.chain(derivative)
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
                derivative: function (x) {
                    return x > 0 ? 1 : 0;
                },
                outputError: function (targetValue, outputValue) {
                    let targetMinusOutput = math.subtract(targetValue, outputValue);
                    let derivative =  ActivationFunctions._relu.derivative(outputValue);

                    return math.multiply(targetMinusOutput, derivative);
                },
                hiddenError: function (nextLayerErrors, nextNodeWeights, outputValue) {
                    let derivative =  ActivationFunctions._relu.derivative(outputValue);
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
                    return math.max(0.01*x, x);
                },
                derivative: function (x) {
                    return x > 0 ? 1 : 0.01;
                },
                outputError: function (targetValue, outputValue) {
                    let targetMinusOutput = math.subtract(targetValue, outputValue);
                    let derivative =  ActivationFunctions._lrelu.derivative(outputValue);

                    return math.multiply(targetMinusOutput, derivative);
                },
                hiddenError: function (nextLayerErrors, nextNodeWeights, outputValue) {
                    let derivative =  ActivationFunctions._lrelu.derivative(outputValue);
                    let dotProduct = math.dot(nextLayerErrors, nextNodeWeights);

                    return math.multiply(derivative, dotProduct);
                }
            };
        }

        return ActivationFunctions._lrelu;
    }

}

export default ActivationFunctions;