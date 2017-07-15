import NeuralNetwork from "../ann/NeuralNetwork";
import ActivationFunctions from "../ann/ActivationFunctions";
import { assert } from "../../../utils/Assert";
import ArrayUtils from "../../../utils/ArrayUtils";
import MathUtil from "../MathUtil";
import WeightInitializer from "../ann/WeightInitializer";
import BackPropFactory from "../ann/backprop/BackPropFactory";
import ReplayMemory from "./ReplayMemory";
import Sequence from "./Sequence";
import Transition from "./Transition";
import moment from "../../../../node_modules/moment/moment";

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
     * @param alpha {Number} This is the initial learning rate of the neural network.
     * @param gamma {Number} This is the discount rate.
     * @param rar {Number} This is the Random Action Rate.  (Percent chance to take a random action).
     * @param radr {Number} This is the Random Action Decay Rate.  Each iteration the rar is multiplied by this value.
     * @param verbose {Boolean} This dictates whether or not you want verbose output.
     * @param epochSize {Number} This will increment the epoch and effectively reduce the learning rate.
     * @param numHiddenLayers {Number} The number of hidden layers to use in the neural network.
     * @param maxEpochs {Number} The epoch number where the learning rate bottoms out.  It also specifies how many
     * episodes to perform in the learn method.
     * @param replayMemoryCapacity {Number} This is the capacity of the ReplayMemory object.
     * @param sequenceSize {Number} This will designate how much history to keep in the preprocessed sequence objects.
     * It will also dictate the input size of the Neural Network.
     * @param miniBatchSize {Number} This is the size of the minibatch of transitions to train in the Neural Network in
     * a single feedforward/backprop pass.
     * @param learnTimeBuffer {Number} This is the number of milliseconds to wait in addition to a single run of learnOne
     * until the next call to learnOne is executed (via an interval).
     */
    constructor(trainingVectorSize,
                numActions=4,
                alpha=0.03,
                gamma=0.9,
                rar=0.98,
                radr=0.9999,
                verbose=false,
                epochSize=1000,
                numHiddenLayers=3,
                maxEpochs=1000,
                replayMemoryCapacity=100000,
                sequenceSize=4,
                miniBatchSize=10,
                learnTimeBuffer=100) {

        assert (radr > 0, "radr must be greater than 0");

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
        this._epochNum = 0;
        this._tickNum = 0;
        this._qValues = null;
        this._replayMemoryCapacity = replayMemoryCapacity;
        this._replayMemory = new ReplayMemory(replayMemoryCapacity);
        this._sequenceSize = sequenceSize;
        this._learning = false;
        this._miniBatchSize = miniBatchSize;
        this._learningInterval = null;
        this._learnTimeBuffer = learnTimeBuffer;

        this._nodesPerLayer = DeepQLearner.createNodesPerLayerArray(numActions,
            trainingVectorSize, numHiddenLayers, sequenceSize);
        this._neuralNetwork = DeepQLearner.createNeuralNetwork(this._nodesPerLayer, this._maxEpochs, this._alpha);
        this._s = 0;
        this._a = 0;
    }

    /**
     * This instantiates the Neural Network
     * @param nodesPerLayer {Array} This is the array that specifies the number of nodes to include
     * in each layer of the NeuralNetwork.
     * @param maxEpochs {Number} This specifies the epoch number where the learning rate reaches its
     * minimum value.
     * @param alpha {Number} Initial learning rate.
     * @returns {NeuralNetwork}
     */
    static createNeuralNetwork(nodesPerLayer, maxEpochs, alpha=0.03) {
        let toRet = new NeuralNetwork(nodesPerLayer,
            true,
            ActivationFunctions.lrelu, alpha, WeightInitializer.COMPRESSED_NORMAL, null, true, 0.001,
            BackPropFactory.BACK_PROP_TYPE_ADAM_MATRIX);
        toRet.maxEpochs = maxEpochs;

        if (!!window.localStorage) {

            let theWeightsJSON = window.localStorage.getItem("DeepQWeights");
            if (!!theWeightsJSON) {
                let theWeights = JSON.parse(theWeightsJSON);
                toRet.setWeights(theWeights);
                if (!!console) {
                    console.log("Weights Loaded from Storage");
                }
            }
        }
        if (!!window) {
            window.neuralNetwork = toRet;
            if (!!console) {
                console.log("window.neuralNetwork created");
            }

            window.deepQLearner = this;
        }

        return toRet;
    }

    /**
     * This will create the "NodePerLayer" array to pass into the neural network constructor.
     *
     * @param numActions {Number} This is the number of actions that can be performed.
     * @param trainingVectorSize {Number} This is the size of the trainingVector.
     * @param numHiddenLayers {Number} This is the number of hidden layers you want.
     * @param sequenceSize {Number} This is the number sequences that will be input into
     * the neural network.
     * @returns {Array} This is the "NodesPerLayer" array to pass into the neural network.
     */
    static createNodesPerLayerArray(numActions,
                                    trainingVectorSize,
                                    numHiddenLayers,
                                    sequenceSize) {
        assert (numHiddenLayers > 0, "numHiddenLayers must be greater than 0");

        let toRet = [];
        let numInputBits = trainingVectorSize * sequenceSize;

        toRet.push(numInputBits);

        while (numHiddenLayers > 0) {
            toRet.push(numInputBits);
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

        // this.log(`totalError = ${this._totalError}`);
        // this.log(`rar = ${this._rar}`);
        // this.log(`error = ${error}`);

        this._s = sPrime;
        this._a = aPrime;

        this._queryCount++;
        if (this._queryCount % this._epochSize === 0) {
            this._neuralNetwork.epochs = this._neuralNetwork.epochs + 1;
        }

        return aPrime;
    }

    getAction(state, updateRar=true) {

        let randomValue = Math.random();
        let aPrime;

        if (this._rar >= randomValue) {
            aPrime = Math.floor(Math.random() * this._numActions);
        } else {
            aPrime = this.getActionWithLargestQValue(state);
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
        assert(state.length === this.inputSize, "state is the wrong size");

        return this._neuralNetwork.predict([state])[0];
    }

    /**
     * This method will stop the interval causing the DeepQLearner to continue learning.
     */
    stopLearning() {
        if (this._learningInterval !== null) {
            clearInterval(this._learningInterval);
            this._learningInterval = null;
        }
    }

    /**
     * This will kick off an interval that performs learning (and will be in charge of incrementing the
     * game state.
     *
     * @param executeActionCallback {Function} The deep Q Learner will call this callback to interact with the
     * environment.  This will pass (this, actionNum) and the callback should return {reward_t, state_t+1, isTerminal}
     * @param initialState {Array} This should be an array representing the initial state.
     */
    learn(executeActionCallback, initialState) {
        assert (executeActionCallback !== null, "executeActionCallback must be a valid function");
        assert (initialState instanceof Array, "initialState should be instance of an Array");

        this._neuralNetwork = DeepQLearner.createNeuralNetwork(this._nodesPerLayer, this._maxEpochs, this._alpha);
        this._replayMemory = new ReplayMemory(this._replayMemoryCapacity);

        this.stopLearning();

        let startTime = moment();
        this.learnOne(executeActionCallback, initialState);
        let endTime = moment();

        if (this._maxEpochs <= this._epochNum) {
            // Nothing else to do.  One epoch.
            return;
        }

        let duration = moment.duration(endTime.diff(startTime));
        let timeBetweenTicks = duration.asMilliseconds() + this._learnTimeBuffer;

        setInterval(function() {
            this.learnOne(executeActionCallback, initialState);

            if (this._maxEpochs <= this._epochNum) {
                this.stopLearning();
            }
        }.bind(this), timeBetweenTicks);
    }

    /**
     * If the tickNum === 0, then set the current state to a new Sequence populated
     * with the initialState.
     * @param initialState
     * @private
     */
    _setInitialState(initialState) {
        if (this._tickNum === 0) {
            this._s = new Sequence(initialState);
        }
    }

    /**
     * This is the heart of the Deep Q-Learning algorithm.  This method represents Algorithm 1 from
     * "Playing Atari with Deep Reinforcement Learning", which can be found in the /doc folder of this project.
     *
     * @param executeActionCallback {Function} The deep Q Learner will call this callback to interact with the
     * environment.  This will pass (this, actionNum) and the callback should return {reward_t, state_t+1, isTerminal}
     * @param initialState {Array} This should be an array representing the initial state.
     * @returns {Number} Returns the Total Error of the entire Neural Network.
     * @private
     */
    _learnOne(executeActionCallback, initialState) {
        this._setInitialState(initialState);

        let currentPreProcessedSequence = this.sequence.createPreProcessedSequence(this.sequenceSize);
        let aPrime = this.getAction(currentPreProcessedSequence.toInput(this.sequenceSize), false);

        let result = executeActionCallback(this, aPrime); // { reward: 1, state: [6], isTerminal: false }
        // this.log(`reward = ${result.reward}`);
        // this.log(`state = ${result.state}`);

        let sequenceTPlus1 = this._s.clone();
        sequenceTPlus1.append(aPrime, result.state);
        let preProcessedTPlus1 = sequenceTPlus1.createPreProcessedSequence(this.sequenceSize);

        this._s = preProcessedTPlus1;
        this._a = aPrime;

        let transition = new Transition(currentPreProcessedSequence, aPrime, result.reward,
            preProcessedTPlus1, this._tickNum, 1e-9);

        this.replayMemory.store(transition);

        let miniBatch = this.replayMemory.sampleRandomMinibatch(this._miniBatchSize);

        let targetValues = this.convertMiniBatchToTargetValues(miniBatch, result.isTerminal);
        let predictedValues = this.convertMiniBatchToPredictedValues(miniBatch);

        let temp = this.performGradientDescent(targetValues, predictedValues);
        // this.replayMemory.updateTDErrors(miniBatch, temp.tdErrors);

        let toRet = temp.error;

        if (result.isTerminal) {
            this._rar *= this._radr;

            let theWeights = this._neuralNetwork.getWeights();
            let theWeightsJSON = JSON.stringify(theWeights);
            if (!!window.localStorage) {
                window.localStorage.setItem("DeepQWeights", theWeightsJSON);
                this.log("DeepQWeights Set");
            }

            this.log(`Neural Network weights = ${theWeightsJSON}`);
            this._epochNum++;

            this._neuralNetwork.epochs = this._epochNum;
            this.log(`rar = ${this._rar}`);
            this.log(`radr = ${this._radr}`);
            this.log(`learningRate = ${this._neuralNetwork.learningRate}`);
            this.log(`Epoch ${this._epochNum} finished with ${this._tickNum} ticks.  Total Error = ${toRet}`);


            this._tickNum = 0;
        } else {
            this._tickNum++;
        }

        return toRet;
    }

    /**
     * This will be called by the interval to perform one iteration of the learning algorithm.
     *
     * @param executeActionCallback {Function} The deep Q Learner will call this callback to interact with the
     * environment.  This will pass (this, actionNum) and the callback should return {reward_t, state_t+1, isTerminal}
     * @param initialState {Array} This should be an array representing the initial state.
     * @returns {number} Returns the total error of all the nodes in the neural network.
     */
    learnOne(executeActionCallback, initialState) {
        let totalError = Number.POSITIVE_INFINITY;

        if (this._learning) {
            return totalError;
        }
        this._learning = true;

        try {
            totalError = this._learnOne(executeActionCallback, initialState);
        } catch (e) {
            this.log(e);
        } finally {
            this._learning = false;
        }

        return totalError;
    }

    /**
     * This method performs the gradient descent step of the Deep Q-Network.  The most important thing
     * to note about calling this method, is that we must have performed the feed forward step for the predicted
     * values most recently (due to how the Neural Network stores previous outputs and errors that are used
     * in the Backpropagation).  I may want to fix that at some point.
     *
     * @param targetValues {Array} Array of arrays of the target value objects which should look like
     * { qValuesForEachAction, maxAction, maxQValue, targetValue }
     * @param predictedValues {Array} Array of arrays of predicated value objects which should look like
     * { qValuesForEachAction, action, qValue }
     * @returns {Number} Returns the absolute value of the total error of all the nodes in the Neural Network/
     */
    performGradientDescent(targetValues, predictedValues) {
        assert (targetValues.length === predictedValues.length, "These need to be the same length");
        let tdErrors = [];
        /**
         * This is creating the expected output for the Neural Network.  All the values are left the
         * same except for the value for the action taken to receive the reward.  We know the value of this
         * action should be the reward for entering the current state plus the discounted future of the optimal
         * policy. targetValue = (r + gamma * max_a( Q(s', a') )
         * @type {Array}
         */
        let outputMiniBatch = predictedValues.map(function (predictedValueObj, index) {
            let targetValueObj = targetValues[index];
            let toRet = predictedValueObj.qValuesForEachAction;
            tdErrors[index] = Math.abs(targetValueObj.targetValue -
                predictedValueObj.qValuesForEachAction[predictedValueObj.action]);
            toRet[predictedValueObj.action] = targetValueObj.targetValue;

            assert (toRet.length === this.outputSize, "Invalid size of expected output");
            return toRet;
        }.bind(this));

        let error = this._neuralNetwork.backPropagate(outputMiniBatch);
        return {
            error: error,
            tdErrors: tdErrors
        };
    }

    /**
     * This method will convert a miniBatch of Transition objects into predictions
     * from the Neural Network
     * @param miniBatchOfTransitions {Array}
     * @returns {Array} Array of objects containing the predictions along with other information.
     */
    convertMiniBatchToPredictedValues(miniBatchOfTransitions) {
        let miniBatchOfActions = [];
        let miniBatch = miniBatchOfTransitions.map(function (transition, index) {
            let toRet = transition.sequenceT.toInput(this.sequenceSize);
            miniBatchOfActions[index] = transition.actionT;

            assert (toRet.length === this.inputSize, "Invalid Input Size");
            assert (transition.actionT >= 0 && transition.actionT < this.numActions,
                "Invalid ActionT Found");

            return toRet;
        }.bind(this));

        let result = this._neuralNetwork.feedForward(miniBatch);

        return result.map(function (qValuesForEachAction, index) {
            return {
                qValuesForEachAction: qValuesForEachAction,
                action: miniBatchOfActions[index],
                qValue: qValuesForEachAction[miniBatchOfActions[index]]
            };
        });
    }

    /**
     * This will convert an Array of Transition objects into
     * an Array of target values.
     *
     * if Phi_j+1 is terminal --> y_j = r_j
     * if Phi_j+1 is non-terminal --> y_j = r_j + gamma * max_a'( Q(Phi_j+1, a'; Theta) )
     *
     * @param miniBatchOfTransitions {Array} Array of Transition objects.
     * @param isTerminal {Boolean} This specifies whether or not the next sequence j+1 is terminal
     * or not
     * @returns {Array} Returns array of objects containing the target values and other important data.
     */
    convertMiniBatchToTargetValues(miniBatchOfTransitions, isTerminal) {

        // if (isTerminal) {
        //     return miniBatchOfTransitions.map(function (transition) {
        //         return transition.rewardT;
        //     });
        // }

        let miniBatch = miniBatchOfTransitions.map(function (transition) {
            let toRet = transition.sequenceTPlus1.toInput(this.sequenceSize);
            assert (toRet.length === this.inputSize, "Invalid Input Size");
            return toRet;
        }.bind(this));

        // This should output miniBatch x _sequenceSize Array
        let result = this._neuralNetwork.feedForward(miniBatch);
        let gamma = this.gamma;

        return result.map(function (qValuesForEachAction, index) {
            let maxAction = MathUtil.argMax(qValuesForEachAction);
            let maxQ = qValuesForEachAction[maxAction];
            let currentTransition = miniBatchOfTransitions[index];

            let targetValue = currentTransition.rewardT;
            if (!isTerminal) {
                targetValue += (gamma * maxQ);
            }

            return {
                qValuesForEachAction: qValuesForEachAction,
                maxAction: maxAction,
                maxQValue: maxQ,
                targetValue: targetValue
            };
        });
    }

    get outputSize() {
        return this._nodesPerLayer[this._nodesPerLayer.length - 1];
    }

    get inputSize() {
        return this._nodesPerLayer[0];
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

    get sequence() {
        return this._s;
    }

    get sequenceSize() {
        return this._sequenceSize;
    }

    get replayMemory() {
        return this._replayMemory;
    }

    get epochNum() {
        return this._epochNum;
    }

    get tickNum() {
        return this._tickNum;
    }
}

export default DeepQLearner;