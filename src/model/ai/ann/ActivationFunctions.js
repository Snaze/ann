import math from "../../../../node_modules/mathjs/dist/math";

/**
 * https://theclevermachine.wordpress.com/2014/09/08/derivation-derivatives-for-common-neural-network-activation-functions/
 */
class ActivationFunctions {

    static get sigmoid() {
        return {
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

    static get tanh() {
        return {
            output: function (x) {
                let numerator = math.chain(math.pow(math.e, x)).subtract(math.pow(math.e, -x)).done();
                let denominator = math.chain(math.pow(math.e, x)).add(math.pow(math.e, -x)).done();
                return math.chain(numerator).divide(denominator).done();
            },
            outputError: function (targetValue, outputValue) {
                return math.chain(math.subtract(targetValue, outputValue))
                    .multiply(math.subtract(1.0, math.pow(outputValue, 2)))
                    .done();
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

}

export default ActivationFunctions;