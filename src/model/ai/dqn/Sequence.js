import ArrayUtils from "../../../utils/ArrayUtils";
import { assert } from "../../../utils/Assert";

/**
 * This object represents a distinct State within the DeepQLearner.
 *
 * It is simply a collection of State Arrays and Actions taken.
 */
class Sequence {

    /**
     * This creates a Sequence object.
     * @param initialState {Array} This should be an array representing the initial state.
     */
    constructor(initialState) {
        this._states = [initialState];
        this._actions = [];
    }

    /**
     * This will append the result of taking action from the previous state
     * and ending of in state "state".
     * @param action {Number} This should be a number representing the action taken.
     * @param state {Array} This should be an array representing the next state
     */
    append(action, state) {
        this._actions.push(action);
        this._states.push(state);
    }

    /**
     * This will create a new Sequence containing "size" most recent states.
     * @param size {Number} The number of most recent states to collect.
     */
    createPreProcessedSequence(size) {

        let initialStateIndex = Math.max(0, this._states.length - size);
        let toRet = new Sequence(this.states[initialStateIndex]);

        for (let i = initialStateIndex + 1; i < this.states.length; i++) {
            toRet.append(this.actions[i-1], this.states[i]);
        }

        return toRet;
    }

    /**
     * This will return the entire sequence of states in a flattened array
     * @param size {Number} This number of most recent states to collect.
     * @returns {Array} This will return the entire sequence of states in a flattened array.
     */
    toInput(size) {
        if (size <= this.states.length) {
            let toFlatten = ArrayUtils.take(this.states, size, this.states.length - size);
            return ArrayUtils.flatten(toFlatten);
        }

        assert (this.states.length > 0, "There should be at least one state in here");

        // This thing needs at least one state.
        let stateSize = this.states[0].length;
        let properSize = stateSize * size;

        let toRet = ArrayUtils.flatten(this.states);
        while (toRet.length < properSize) {
            toRet.unshift(0);
        }
        return toRet;
    }

    /**
     * This returns an array of the visited states
     * @returns {Array}
     */
    get states() {
        return this._states;
    }

    /**
     * This returns an array of the actions performed
     * @returns {Array}
     */
    get actions() {
        return this._actions;
    }

    /**
     * This will make a shallow-copy clone of this sequence object.
     */
    clone() {
        let toRet = new Sequence(null);

        toRet._states = ArrayUtils.copy(this._states);
        toRet._actions = ArrayUtils.copy(this._actions);

        return toRet;
    }
}

export default Sequence;