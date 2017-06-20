import MathUtil from "../MathUtil";
import { assert } from "../../../utils/Assert";
import ActivationFunctions from "./ActivationFunctions";
import math from "../../../../node_modules/mathjs/dist/math";

class NeuralNetworkNode {

    constructor(numWeights,
                includeBias=true,
                activationFunction=ActivationFunctions.sigmoid) {

        this._numWeights = numWeights;
        this._includeBias = includeBias;
        this._activationFunction = activationFunction;
        this._output = null;
        this._error = null;
        this._learningRate = 1.0;
        this._previousValues = null;

        if (includeBias) {
            this._numWeights++;
        }

        this._weights = NeuralNetworkNode.createRandomWeights(this._numWeights);
        this._outgoingWeights = [];
    }

    static createRandomWeights(numToCreate) {
        let toRet = [];

        for (let i = 0; i < numToCreate; i++) {
            toRet.push(MathUtil.getRandomArbitrary(-1, 1));
        }

        return toRet;
    }

    get numWeights() {
        return this._numWeights;
    }

    get weights() {
        return this._weights;
    }

    set weights(value) {
        assert (value.length === this._numWeights);

        this._weights = value;
    }

    get includeBias() {
        return this._includeBias;
    }

    get activationFunction() {
        return this._activationFunction;
    }

    get output() {
        return this._output;
    }

    get error() {
        return this._error;
    }

    get learningRate() {
        return this._learningRate;
    }

    set learningRate(value) {
        this._learningRate = value;
    }

    feedForward(nodeValues) {

        if (this.includeBias && (nodeValues.length + 1) === this.weights.length) {
            nodeValues.push(1.0);
        }

        assert (!this.includeBias || nodeValues[nodeValues.length - 1] === 1.0);
        assert (nodeValues.length === this.weights.length, "Weight length and node length need to match");

        let dotProduct = math.dot(nodeValues, this._weights);
        this._output = this._activationFunction.output(dotProduct);
        this._previousValues = nodeValues;

        return this._output;
    }

    backPropagateOutputNode(targetValue) {

        assert (!this.includeBias || this._previousValues[this._previousValues.length - 1] === 1.0);
        assert (this._previousValues.length === this.weights.length, "Weight length and node length need to match");

        this._error = this.activationFunction.outputError(targetValue, this._output);

        for (let i = 0; i < this._weights.length; i++) {
            this._weights[i] = math.chain(this._learningRate)
                .multiply(this._error)
                .multiply(this._previousValues[i])
                .add(this._weights[i])
                .done();
        }

        return this._error;
    }

    /**
     * This should be called to backPropagate if this node is hidden.
     *
     * @param nextLayerErrors This should be an array consisting of the error for each node of the next layer.
     * @param outgoingWeights This should be an array consisting of the weight edges exiting this node.
     * propagated.
     *
     * @returns The error of this node.
     */
    backPropagateHiddenNode(nextLayerErrors, outgoingWeights) {

        assert (!this.includeBias || this._previousValues[this._previousValues.length - 1] === 1.0);
        assert (this._previousValues.length === this.weights.length, "Weight length and node length need to match");

        this._error = this.activationFunction.hiddenError(nextLayerErrors, outgoingWeights, this._output);

        for (let i = 0; i < this._weights.length; i++) {
            this._weights[i] = math.chain(this._error)
                .multiply(this._previousValues[i])
                .add(this._weights[i])
                .done();
        }

        return this._error;
    }
}

export default NeuralNetworkNode;