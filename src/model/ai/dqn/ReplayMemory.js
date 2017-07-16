import ArrayUtils from "../../../utils/ArrayUtils";

/**
 * This class will be used store past sequence transitions
 * and to select past minibatches of them.
 */
class ReplayMemory {

    /**
     * This is the constructor for the replay memory. When the capacity is filled, the oldest items will be removed
     * first.
     * @param capacity {Number} This is the max number of transitions you wish to store.
     */
    constructor(capacity) {
        this._capacity = capacity;
        this._data = ArrayUtils.create1D(capacity, null);
        this._keys = Object.create(null);
        this._index = 0;
        this._maxIndex = 0;
    }

    /**
     * This will increment the current index value.  This stores the last index used to insert data.
     * @private
     */
    _incrementIndex() {
        this._index++;

        if (this._index >= this._capacity) {
            this._index = 0;
        }
    }

    /**
     * This will increment the max index value.  The max index represents how much of the _data array
     * is currently being used, allowing the selection of random mini-batches.
     * @private
     */
    _incrementMaxIndex() {
        if (this._maxIndex < this._capacity) {
            this._maxIndex++;
        }
    }

    /**
     * Use this method to return the Transition key if possible.  Else it will just to toString()
     * @param transition {Transition|*}
     * @private
     */
    _getTransitionKey(transition) {
        if (!!transition.toKey) {
            return transition.toKey();
        }

        return transition.toString();
    }

    /**
     * This method will store the transition in memory.
     * @param transition {Transition} This is the transition object.
     */
    store(transition) {
        let transitionKey = this._getTransitionKey(transition);

        // We already have this transition
        if (transitionKey in this._keys) {
            return;
        }

        let transitionToRemove = this._data[this._index];
        if (transitionToRemove !== null) {
            let transitionKeyToRemove = this._getTransitionKey(transitionToRemove);
            delete this._keys[transitionKeyToRemove];
        }

        this._data[this._index] = transition;
        this._keys[transitionKey] = true;

        this._incrementIndex();
        this._incrementMaxIndex();
    }

    /**
     * This will return an Array of transitions which can be used
     * to train the neural network.
     *
     * @param miniBatchSize {Number} The number of Transition objects you wish to retrieve.
     * @returns {Array} Returns array of Transition objects representing the mini-batch
     */
    sampleRandomMinibatch(miniBatchSize=10) {
        return ArrayUtils.sample(this._data, miniBatchSize, true, this.maxIndex);
    }

    /**
     * This represents the number of transitions the ReplayMemory can hold.
     * @returns {Number}
     */
    get capacity() {
        return this._capacity;
    }

    /**
     * This represents the next index that will be used to insert data.
     * @returns {Number}
     */
    get index() {
        return this._index;
    }

    /**
     * This indicates that all indices less than this value contain valid transitions.
     * @returns {Number}
     */
    get maxIndex() {
        return this._maxIndex;
    }
}

export default ReplayMemory;