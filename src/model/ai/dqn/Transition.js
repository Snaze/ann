// import ArrayUtils from "../../../utils/ArrayUtils";


/**
 * This class represents a single transition.
 * Going from sequence_t, taking action_t, receiving reward_t, and ending up in sequence_t_plus_1.
 */
class Transition {

    /**
     * This is the construction of the Transition.
     *
     * @param sequenceT {Sequence} This should be a limited "preprocessed" sequence of limited length.
     * @param actionT {Number} This should be the number representing the action taken.
     * @param rewardT {Number} This should be the number representing the reward received after taking
     * actionT.
     * @param sequenceTPlus1 {Sequence} This should be the limited "preprocessed" sequence you end up
     * in after taking actionT.
     * @param t {Number} The time t.
     * @param tdError {Number} The TD Error of the transition. ==> r + gamma * Q_max_a(s', a') - Q(s, a)
     */
    constructor(sequenceT,
                actionT,
                rewardT,
                sequenceTPlus1,
                t,
                tdError) {
        this._sequenceT = sequenceT;
        this._actionT = actionT;
        this._rewardT = rewardT;
        this._sequenceTPlus1 = sequenceTPlus1;
        this._t = t;
        this._tdError = tdError;
        this._prevTdError = null;
    }

    /**
     * The Sequence object at time T
     * @returns {Sequence}
     */
    get sequenceT() {
        return this._sequenceT;
    }

    /**
     * The action taken after observing sequenceT at time T
     * @returns {Number}
     */
    get actionT() {
        return this._actionT;
    }

    /**
     * The reward received after taking actionT after observing sequenceT
     * @returns {Number}
     */
    get rewardT() {
        return this._rewardT;
    }

    /**
     * The resulting Sequence after taking actionT after observing sequenceT and receiving
     * rewardT
     * @returns {Sequence}
     */
    get sequenceTPlus1() {
        return this._sequenceTPlus1;
    }

    /**
     * The time t.
     * @returns {Number}
     */
    get t() {
        return this._t;
    }

    /**
     * Return the TD Error of this transition for the last time it was processed
     * @returns {Number}
     */
    get tdError() {
        return this._tdError;
    }

    /**
     * Set the TD Error
     * @param value {Number}
     */
    set tdError(value) {
        this._prevTdError = this._tdError;
        this._tdError = value;
    }

    /**
     * Previous TD Error Value
     * @returns {null|Number}
     */
    get prevTdError() {
        return this._prevTdError;
    }

    /**
     * This will create a key for this Transition.
     * @param size {Number} The size of each sequence.
     */
    toKey(size) {
        let sequenceKey = this._sequenceT.toKey(size);
        let sequenceTPlus1Key = this._sequenceTPlus1.toKey(size);
        let rewardKey = this._rewardT.toString();
        let actionKey = this._actionT.toString();

        let toRet = [sequenceKey, sequenceTPlus1Key, rewardKey, actionKey];
        return toRet.join("_");
    }
}

export default Transition;