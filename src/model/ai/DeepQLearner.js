import NeuralNetwork from "./ann/NeuralNetwork";
import ActivationFunctions from "./ann/ActivationFunctions";
import { assert } from "../../utils/Assert";
import ArrayUtils from "../../utils/ArrayUtils";
import MathUtil from "./MathUtil";
import WeightInitializer from "./ann/WeightInitializer";
import BackPropFactory from "./ann/backprop/BackPropFactory";

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
     * @param alpha {Number} This is the learning rate.
     * @param gamma {Number} This is the discount rate.
     * @param rar {Number} This is the Random Action Rate.  (Percent chance to take a random action).
     * @param radr {Number} This is the Random Action Decay Rate.  Each iteration the rar is multiplied by this value.
     * @param verbose {Boolean} This dictates whether or not you want verbose output.
     * @param epochSize {Number} This will increment the epoch and effectively reduce the learning rate.
     * @param numHiddenLayers {Number} The number of hidden layers to use in the neural network.
     * @param maxEpochs {Number} The epoch number where the learning rate bottoms out
     */
    constructor(trainingVectorSize,
                numActions=4,
                alpha=0.2,
                gamma=0.9,
                rar=0.98,
                radr=0.9999,
                verbose=false,
                epochSize=10000,
                numHiddenLayers=3,
                maxEpochs=1000) {

        this._trainingVectorSize = trainingVectorSize;
        this._numActions = numActions;
        this._alpha = alpha;
        this._gamma = gamma;
        this._rar = rar;
        this._radr = radr;
        this._verbose = verbose;
        this._epochSize = epochSize;
        this._numHiddenLayers = numHiddenLayers;
        this._queryCount = 0;
        this._maxEpochs = maxEpochs;
        this._totalError = 0;
        this._outputError = 0;
        this._qValues = null;

        this._nodesPerLayer = DeepQLearner.createNodesPerLayerArray(numActions,
            trainingVectorSize, numHiddenLayers);
        this._neuralNetwork = new NeuralNetwork(this._nodesPerLayer,
            true,
            ActivationFunctions.lrelu, 0.03, WeightInitializer.COMPRESSED_NORMAL, null, true, 0.001,
            BackPropFactory.BACK_PROP_TYPE_ADAM);
        this._neuralNetwork.maxEpochs = maxEpochs;
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
     * @param numActions {Number} This is the number of actions that can be performed.
     * @param trainingVectorSize {Number} This is the size of the trainingVector.
     * @param numHiddenLayers {Number} This is the number of hidden layers you want.
     * @returns {Array} This is the "NodesPerLayer" array to pass into the neural network.
     */
    static createNodesPerLayerArray(numActions,
                                    trainingVectorSize,
                                    numHiddenLayers) {
        assert (numHiddenLayers > 0, "numHiddenLayers must be greater than 0");

        let toRet = [];
        // let numOutputBits = MathUtil.getNumBits(qValueSize);
        // let numInputBits = trainingVectorSize;
        toRet.push(trainingVectorSize);
        while (numHiddenLayers > 0) {
            toRet.push(trainingVectorSize);
            numHiddenLayers--;
        }
        toRet.push(numActions);

        return toRet;
    }

    log(toLog) {
        if (this._verbose && !!console) {
            console.log(toLog);
        }
    }

    /**
     * Update the state without updating the neural network
     *
     * @param s {Array} The new state represented as an array
     * @returns {Number} The number representing the next action to take.
     */
    querySetState(s) {

        assert (s.length === this._trainingVectorSize, "Invalid State Vector Size");

        let action = this.getAction(s, false);

        this._s = s;
        this._a = action;

        return action
    }

    /**
     * Update the Q table and return an action.
     *
     * @param sPrime {Array} the array representing state sPrime.
     * @param r {Number} the reward for entering state sPrime.
     * @returns {Number} returns the next action.
     *
     * http://neuro.cs.ut.ee/demystifying-deep-reinforcement-learning/
     */
    query(sPrime, r) {

        assert (sPrime.length === this._trainingVectorSize, "Invalid State Vector Size");

        let qValuesForNextState = this.getQValueForAllActions(sPrime);
        let qValuesForCurrentState = this.getQValueForAllActions(this._s);
        this._qValues = qValuesForCurrentState;

        let randomValue = Math.random();
        let aPrime;

        if (this._rar >= randomValue) {
            aPrime = Math.floor(Math.random() * this._numActions);
        } else {
            aPrime = MathUtil.argMax(qValuesForNextState);
        }

        this._rar *= this._radr;

        let qValueForNextState = qValuesForNextState[aPrime];

        let qValueTargets = ArrayUtils.copy(qValuesForCurrentState);
        let error = qValueTargets[this._a];
        qValueTargets[this._a] = r + this._gamma * qValueForNextState;
        this._outputError = Math.abs(error - qValueTargets[this._a]);

        this._totalError = this._neuralNetwork.backPropagate([qValueTargets]);

        this.log(`totalError = ${this._totalError}`);
        this.log(`rar = ${this._rar}`);
        this.log(`error = ${error}`);

        this._s = sPrime;
        this._a = aPrime;

        this._queryCount++;
        if (this._queryCount % this._epochSize === 0) {
            this._neuralNetwork.epochs = this._neuralNetwork.epochs + 1;
        }

        return aPrime;
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
        let output = this.getQValueForAllActions(sPrime);
        return MathUtil.argMax(output); // This should be the action number with the highest q-value
    }

    getQValueForAllActions(state) {
        assert(state.length === this._trainingVectorSize, "state is the wrong size");

        return this._neuralNetwork.predict([state])[0];
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

    get epochs() {
        return this._neuralNetwork.epochs;
    }

    get weights() {
        return this._neuralNetwork.getWeights();
    }

    set weights(value) {
        this._neuralNetwork.setWeights(value);
    }

    get totalError() {
        return this._totalError;
    }

    get outputError() {
        return this._outputError;
    }

    get qValues() {
        return this._qValues;
    }

    getAllQValuesForAllStates(numStates) {

        let toRet = [];

        for (let i = 0; i < numStates; i++) {
            toRet.push(this._neuralNetwork.feedForward([[i]])[0]);
        }

        return toRet;
    }
}

export default DeepQLearner;