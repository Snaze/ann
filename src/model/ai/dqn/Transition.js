
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
     */
    constructor(sequenceT,
                actionT,
                rewardT,
                sequenceTPlus1,
                t) {
        this._sequenceT = sequenceT;
        this._actionT = actionT;
        this._rewardT = rewardT;
        this._sequenceTPlus1 = sequenceTPlus1;
        this._t = t;
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
}

export default Transition;