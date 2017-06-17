import QLearner from "../../ai/QLearner";

class PlayerAgent {
    constructor(numStates) {
        this._qLearner = new QLearner(numStates, 4);
    }

    act(stateNumber, reward=null) {
        if (reward === null) {
            return this._qLearner.querySetState(stateNumber);
        }

        return this._qLearner.query(stateNumber, reward);
    }
}

export default PlayerAgent;