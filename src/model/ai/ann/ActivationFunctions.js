import math from "../../../../node_modules/mathjs/dist/math";

class ActivationFunctions {

    static get sigmoid() {
        return {
            output: function (x) {
                return math.chain(math.e).pow(math.multiply(-1, x)).add(1.0).inv().done();
            },
            outputError: function (targetValue, outputValue) {
                return math.chain(math.subtract(targetValue, outputValue))
                    .multiply(math.subtract(1.0, outputValue))
                    .multiply(outputValue)
                    .done();
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

}

export default ActivationFunctions;