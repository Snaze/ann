import NeuralNetwork from "./ann/NeuralNetwork";
import ActivationFunctions from "./ann/ActivationFunctions";
import { assert } from "../../utils/Assert";
import ConvertBase from "../../utils/ConvertBase";
import ArrayUtils from "../../utils/ArrayUtils";
import MathUtil from "./MathUtil";
import math from "../../../node_modules/mathjs/dist/math";

/**
 * This will train a Q-Learner whose Q value is approximated by a neural network.
 */
class DeepQLearner {

    /**
     * Constructor for DeepQLearner.
     *
     * @param trainingVectorSize {Number} This is the size of the trainingVector that you will be inputting into the Neural
     * Network.  Note that this will be smaller than what I used to refer to as the "feature vector".  This vector
     * should really just be called the state vector.
     * @param numActions {Number} This is the number of actions that can be performed by the DeepQLearner
     * @param qValueSize {Number} This is the number of states that are possible for the Neural Network to output.  In
     * other words, the Neural Network will have Math.floor(Math.log2(qValueSize)) + 1 outputs which will be used
     * to construct a number out of binary.
     * @param alpha {Number} This is the learning rate.
     * @param gamma {Number} This is the discount rate.
     * @param rar {Number} This is the Random Action Rate.  (Percent chance to take a random action).
     * @param radr {Number} This is the Random Action Decay Rate.  Each iteration the rar is multiplied by this value.
     * @param verbose {Boolean} This dictates whether or not you want verbose output.
     * @param epochSize {Number} This will increment the epoch and effectively reduce the learning rate.
     * @param numHiddenLayers {Number} The number of hidden layers to use in the neural network.
     */
    constructor(trainingVectorSize,
                numActions=4,
                qValueSize=10000,
                alpha=0.2,
                gamma=0.9,
                rar=0.98,
                radr=0.9999,
                verbose=false,
                epochSize=10000,
                numHiddenLayers=3) {

        this._trainingVectorSize = trainingVectorSize;
        this._numActions = numActions;
        this._qValueSize = qValueSize;
        this._alpha = alpha;
        this._gamma = gamma;
        this._rar = rar;
        this._radr = radr;
        this._verbose = verbose;
        this._epochSize = epochSize;
        this._numHiddenLayers = numHiddenLayers;

        this._nodesPerLayer = DeepQLearner.createNodesPerLayerArray(qValueSize, numActions,
            trainingVectorSize, numHiddenLayers);
        this._neuralNetwork = new NeuralNetwork(this._nodesPerLayer, true, ActivationFunctions.tanh);
        this._s = 0;
        this._a = 0;
        this._q = null;

        if (!!window) {
            window.q = this._q;
            window.neuralNetwork = this._neuralNetwork;
        }
    }

    /**
     * This will create the "NodePerLayer" array to pass into the neural network constructor.
     *
     * @param qValueSize {Number} This is the number of states (Numbers) that the neural network needs to predict.
     * @param numActions {Number} This is the number of actions that can be performed.
     * @param trainingVectorSize {Number} This is the size of the trainingVector.
     * @param numHiddenLayers {Number} This is the number of hidden layers you want.
     * @returns {Array} This is the "NodesPerLayer" array to pass into the neural network.
     */
    static createNodesPerLayerArray(qValueSize,
                                    numActions,
                                    trainingVectorSize,
                                    numHiddenLayers) {
        assert (numHiddenLayers > 0, "numHiddenLayers must be greater than 0");

        let toRet = [];
        let numOutputBits = MathUtil.getNumBits(qValueSize);
        let numInputBits = trainingVectorSize + MathUtil.getNumBits(numActions - 1);
        toRet.push(numInputBits);
        while (numHiddenLayers > 0) {
            toRet.push(numInputBits);
            numHiddenLayers--;
        }
        toRet.push(numOutputBits);

        return toRet;
    }

    log(toLog) {
        if (this._verbose && !!console) {
            console.log(toLog);
        }
    }

    /**
     * Update the state without updating the Q-table
     * @param s: The new state
     * @returns: The selected action
     */
    querySetState(s) {

        let action = this.getAction(s, false);

        this.log(`s = ${this._s}, a = ${this._a}, s_prime = ${s}, a_prime = ${action}, rar = ${this._rar}`);

        this._s = s;
        this._a = action;

        return action
    }

    /**
     * Update the Q table and return an action
     *
     * @param sPrime: The new state
     * @param r: The reward
     * @returns: The selected action
     */
    query(sPrime, r) {

        let aPrime = this.getAction(sPrime, true);
        let firstPart = math.chain(1.0).subtract(this._alpha).multiply(this._q[this._s][this._a]).done();

        let secondPart = math.chain(this._gamma).multiply(this._q[sPrime][aPrime]).add(r).multiply(this._alpha).done();
        this._q[this._s][this._a] = math.chain(firstPart).add(secondPart).done();

        // this._q[this._s][this._a] = (1.0 - this._alpha) * this._q[this._s][this._a] +
        //     this._alpha * (r + this._gamma * this._q[sPrime][aPrime]);

//      self.Q[self.s, self.a] = (1. - self.alpha) * self.Q[self.s, self.a] \
//          + self.alpha * (r + self.gamma * self.Q[s_prime, a_prime])

        // this.log(`s = ${this._s}, a = ${this._a}, sPrime = ${sPrime}, aPrime = ${aPrime}, r = ${r}`);

        this._s = sPrime;
        this._a = aPrime;

        return aPrime;
    }

    /**
     * TODO: Move this to a common location
     *
     * @param theArray
     */
    static argMax(theArray) {
        let index = -1;
        let max = Number.NEGATIVE_INFINITY;

        if (typeof(theArray) === "undefined") {
            debugger;
        }

        theArray.forEach(function (item, i) {
            if (item > max) {
                max = item;
                index = i;
            }
        });

        return index;
    }

    /**
     * TODO: Move this to a common location
     *
     * @param min
     * @param max
     * @returns {*}
     */
    static getRandomArbitrary(min, max) {
        return Math.random() * (max - min) + min;
    }

    getAction(sPrime, updateRar=true) {

        let randomValue = Math.random();
        let aPrime;

        if (this._rar >= randomValue) {
            aPrime = Math.floor(Math.random() * this._numActions);
        } else {
            aPrime = this.getActionWithLargestQValue(sPrime);
        }

        if (updateRar) {
            this._rar *= this._radr;
        }

        return aPrime;
    }

    getActionWithLargestQValue(sPrime) {
        assert (sPrime.length === this._trainingVectorSize, "sPrime is the wrong size");

        let trainingVectors = [];
        let actionNumbers = [];

        for (let i = 0; i < this._numActions; i++) {
            trainingVectors.push(sPrime);
            actionNumbers.push(i);
        }

        let output = this.feedForwardMiniBatch(trainingVectors, actionNumbers);
        return MathUtil.argMax(output); // This should be the action number with the highest q-value
    }

    /**
     * This will convert the training vector and the action number into input that can be
     * passed into the NN feedforward method.
     *
     * @param trainingVector {Array} The trainingVector
     * @param actionNumber {Number} The actionNumber
     * @returns {Array} Returns the array we can feed into the feedforward method.
     */
    createNNInput(trainingVector, actionNumber) {
        assert (trainingVector.length === this._trainingVectorSize, "trainingVector is the wrong size");
        assert (actionNumber >= 0 && actionNumber < this._numActions, "Invalid action number input");

        let input = [];
        ArrayUtils.extend(input, trainingVector);

        let binaryActionNumberString = ConvertBase.dec2bin(actionNumber);
        binaryActionNumberString = "00" + binaryActionNumberString;
        binaryActionNumberString = binaryActionNumberString.substr(binaryActionNumberString.length - 2);

        let splitArray = binaryActionNumberString.split("");
        splitArray.forEach(function (numStr) {
            // Also specific to tanh?
            if (numStr > 0.0) {
                input.push(1.0);
            } else {
                input.push(-1.0);
            }
        });

        return input;
    }

    /**
     * This will convert an array of training vectors and action numbers into a single mini batch
     * that can be fed into the NN.
     *
     * @param trainingVectors {Array} vector of vectors of training vectors
     * @param actionNumbers {Array} array of actions
     * @returns {Array} This will be an array of arrays representing the mini batch that can be fed
     * directly into the NN.
     */
    createNNMiniBatchInput(trainingVectors, actionNumbers) {
        assert (trainingVectors.length === actionNumbers.length,
            "The training vector array and action number array needs to be the same size");

        let toRet = [];

        trainingVectors.forEach(function (trainingVector, index) {
            toRet.push(this.createNNInput(trainingVector, actionNumbers[index]));
        }.bind(this));

        return toRet;
    }

    /**
     * This will convert the output of the neural network into a decimal
     * number.
     * @param nnOutput {Array} this should be an array of floating point numbers that
     * we wish to convert into a decimal number.  It should be of length Math.floor(Math.log2(qValueSize)) + 1.
     * @returns {Number} The decimal number
     */
    convertRawNNOutputToDecimal(nnOutput) {
        assert (nnOutput.length === this._nodesPerLayer[this._nodesPerLayer.length - 1], "Invalid output size");

        let toConvert = "";
        nnOutput.forEach((num) => {

            // I guess this is specific to tanh?
            if (num > 0.0) {
                toConvert += "1";
            } else {
                toConvert += "0";
            }
        });

        return parseInt(ConvertBase.bin2dec(toConvert), 10);
    }

    /**
     * This will convert the mini-batch of outputs into decimal.
     *
     * @param nnOutputs {Array}
     * @returns {Array} This will return an array of decimal values that are the result of the mini-batch.
     */
    convertRawNNMiniBatchToDecimal(nnOutputs) {
        let toRet = [];

        nnOutputs.forEach(function (nnOutput) {
            toRet.push(this.convertRawNNOutputToDecimal(nnOutput));
        }.bind(this));

        return toRet;
    }

    /**
     * This method will feedforward a mini-batch of input vectors an action numbers
     * and will return a mini-batch of the predicted q-values.
     *
     * @param inputVectors {Array} This is a mini-batch of inputs vectors (training vectors)
     * @param actionNumbers {Array} This is a mini-batch of the action numbers (array of decimal values)
     * @returns {Array} This returns a list of the the predicted q-values.
     */
    feedForwardMiniBatch(inputVectors, actionNumbers) {
        let inputMiniBatch = this.createNNMiniBatchInput(inputVectors, actionNumbers);
        let rawOutputs = this._neuralNetwork.feedForward(inputMiniBatch);
        return this.convertRawNNMiniBatchToDecimal(rawOutputs);
    }

    get trainingVectorSize() {
        return this._trainingVectorSize;
    }

    get numActions() {
        return this._numActions;
    }

    get qValueSize() {
        return this._qValueSize;
    }

    get alpha() {
        return this._alpha;
    }

    get gamma() {
        return this._gamma;
    }

    get rar() {
        return this._rar;
    }

    get radr() {
        return this._radr;
    }

    get verbose() {
        return this._verbose;
    }

    get epochSize() {
        return this._epochSize;
    }

    get numHiddenLayers() {
        return this._numHiddenLayers;
    }
}

export default DeepQLearner;