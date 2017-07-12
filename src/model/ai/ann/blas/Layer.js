import ActivationFunctions from "../ActivationFunctions";
// import LearningRate from "../LearningRate";
import { assert } from "../../../../utils/Assert";
import ArrayUtils from "../../../../utils/ArrayUtils";
import { Matrix } from "vectorious";
import MatrixUtils from "../../../../utils/MatrixUtils";
import math from "../../../../../node_modules/mathjs/dist/math";

/**
 * This class represents a single Layer in the Neural Network.
 *
 * I will use some variables in the comments of this class.  The variables are as follows:
 *
 * n = # of inputs / # of incoming weights per node
 * m = # of records in mini-batch
 * r = # of nodes in next layer / # of error values in next layer / # of outgoing weights
 * p = # of nodes in current layer / "this._numNodes"
 *
 */
class Layer {

    /**
     * This is the constructor for the NN Layer.
     *
     * @param numNodes {Number} The number of nodes in this layer.
     * @param activationFunction {Object} The activation function
     * @param learningRate {LearningRate} Learning Rate object to decay learning rate.
     * @param backPropStrategy {Object} Back Prop instance from the blas/backprop folder
     */
    constructor(numNodes,
                activationFunction=ActivationFunctions.lrelu,
                learningRate,
                backPropStrategy=null) {

        this._numNodes = numNodes;
        this._activationFunction = activationFunction;
        this._learningRate = learningRate;
        this._backPropStrategy = backPropStrategy;

        this._inputs = null; // Previous inputs used on FeedForward
        this._outputs = null; // Previous outputs produced by feedForward
        this._errors = null; // Previous errors produced by backProp
    }

    /**
     * Use this method to feed forward the current layer.
     *
     * n = # of inputs / # of incoming weights per node
     * m = # of records in mini-batch
     * r = # of nodes in next layer / # of error values in next layer / # of outgoing weights
     * p = # of nodes in current layer / "this._numNodes"
     *
     * @param inputWeights {Matrix} This should be a (n x p) 2D Array containing
     * the input weights for this layer.  This means each column represents the weights for a particular
     * node.
     * @param miniBatch {Matrix} This should be a (m x n) 2D Array containing the
     * normalized miniBatch for this layer.
     * @returns {Matrix} This will return a (m x p) 2D Array containing the output
     * for each element of the minibatch for each node of the current layer.
     */
    feedForward(inputWeights, miniBatch) {

        this._inputs = miniBatch;

        if (inputWeights === null) {
            assert (miniBatch.shape[1] === this._numNodes || miniBatch.shape[1] === (this._numNodes + 1),
                "Invalid miniBatch size for input layer");

            this._outputs = miniBatch;
            return this._outputs;
        }

        assert (miniBatch.shape[1] === inputWeights.shape[0], "Invalid matrix sizes");

        // This should be (m x p)
        let tempResult = Matrix.multiply(miniBatch, inputWeights);

        // Now simply apply the activation function and return
        this._outputs = tempResult.map(x => this._activationFunction.output(x));

        return this._outputs;
    }

    /**
     * Use this method to perform back prop on the current layer.  Note that this method depends
     * on the previous inputs / outputs used / generated for the last feedForward call.
     *
     * n = # of inputs / # of incoming weights per node
     * m = # of records in mini-batch
     * r = # of nodes in next layer / # of error values in next layer / # of outgoing weights
     * p = # of nodes in current layer / "this._numNodes"
     *
     * @param inputWeights {Matrix|null} This should be a (n x p) Matrix representing the
     * weights coming into each node in this layer.  Use a value of null if this is the input layer.
     * @param outputWeights {Matrix|null} This should be a (r x p) Matrix representing the
     * weights leaving each node in this layer.  Use a value of null if this is the output layer.
     * @param nextLayerErrorsMiniBatch {Matrix} This should be a (m x r) Matrix representing
     * the error value for each node in the previous layer for each record of the miniBatch.
     * @param epoch {Number} This should be the epoch number
     */
    backProp(inputWeights, outputWeights, nextLayerErrorsMiniBatch, epoch) {

        if (inputWeights === null) {
            if (this._errors === null) {
                this._errors = Matrix.zeros(this._outputs.shape[0], this._outputs.shape[1]);
            }
            // Input layer.
            return null;
        }

        // (m x p)
        let derivatives = this._outputs.map((item) => this._activationFunction.derivative(item));

        // (m x p)
        let temp;

        if (outputWeights === null) {
            assert (ArrayUtils.arrayEquals(nextLayerErrorsMiniBatch.shape, this._outputs.shape),
                "This is an output layer so nextLayerErrorsMiniBatch and this._outputs should have the same shape");
            temp = Matrix.subtract(nextLayerErrorsMiniBatch, this._outputs);
        } else {
            assert (ArrayUtils.arrayEquals(nextLayerErrorsMiniBatch.shape[1], outputWeights.shape[0]),
                "nextLayerErrorsMiniBatch --> (m x r) x (r x p) <-- outputWeights");
            temp = Matrix.multiply(nextLayerErrorsMiniBatch, outputWeights);
        }

        // (m x p)
        this._errors = Matrix.product(derivatives, temp);
        let p = this._errors.shape[1];
        let errorMatrixArray = this._errors.toArray();
        let currentErrorCol, currentErrorDiag, gradients, avgGradient,
            currentGradient = [], learningRate = this.learningRate.getLearningRate(epoch);

        // Check to see if there is a better way to do this.
        for (let nodeIndex = 0; nodeIndex < p; nodeIndex++) {

            // This should be length = m
            currentErrorCol = ArrayUtils.getColumn(errorMatrixArray, nodeIndex);

            // This should be (m x m)
            currentErrorDiag = new Matrix(MatrixUtils.toDiagonal(currentErrorCol));

            // This should be (m x m) x (m x n) = (m x n)
            gradients = Matrix.multiply(currentErrorDiag, this._inputs);

            // This should be an array of size n
            avgGradient = math.mean(gradients.toArray(), 0);

            // At the end of this loop, the currentGradient will be (p x n).  (numNodes x numWeights)
            currentGradient.push(avgGradient);
        }

        currentGradient = new Matrix(currentGradient).transpose();
        let newInputWeights;

        if (this._backPropStrategy === null) {
            // If no special strategy, just do Vanilla Gradient Descent
            newInputWeights = Matrix.subtract(inputWeights, currentGradient.scale(-learningRate));
        } else {
            let weightDeltas = this._backPropStrategy.getWeightDeltas(currentGradient, learningRate);
            newInputWeights = Matrix.subtract(inputWeights, weightDeltas);
        }

        return newInputWeights;
    }

    /**
     * This value indicates when the Learning Rate finished decaying
     * @returns {Number}
     */
    get maxEpochs() {
        return this._learningRate.numEpochs;
    }

    /**
     * This value indicates when the LearningRate stops decaying.
     * @param value {Number}
     */
    set maxEpochs(value) {
        this._learningRate.numEpochs = value;
    }

    /**
     * This is the number of nodes in the current layer.
     * @returns {Number}
     */
    get numNodes() {
        return this._numNodes;
    }

    /**
     * This is the current activation function being used.
     * @returns {Object}
     */
    get activationFunction() {
        return this._activationFunction;
    }

    /**
     * This is the LearningRate object being used.
     * @returns {LearningRate}
     */
    get learningRate() {
        return this._learningRate;
    }

    /**
     * Instance of Back Prop Strategy (item in backprop folder)
     * @returns {Object|null}
     */
    get backPropStrategy() {
        return this._backPropStrategy;
    }

    /**
     * This is the last inputs used on the feed forward pass.
     * @returns {Matrix|null}
     */
    get inputs() {
        return this._inputs;
    }

    /**
     * This is the last outputs produced on the feed forward pass.
     * @returns {Matrix|null}
     */
    get outputs() {
        return this._outputs;
    }

    /**
     * This is the last errors produced on the back prop pass.
     * @returns {Matrix|null}
     */
    get errors() {
        return this._errors;
    }
}

export default Layer;