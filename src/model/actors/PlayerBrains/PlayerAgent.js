import reinforce from "../../../../node_modules/reinforcenode/reinforce";

class PlayerAgent {
    constructor(numStates) {
        this._numStates = numStates;
        this._agent = PlayerAgent.createAgent(numStates);
        this._readyToLearn = false;
    }

    static createAgent(numStates) {
        let env = {};
        env.getNumStates = () => { return numStates; };
        env.getMaxNumActions = () => { return 4; };

        let spec = {};
        spec.update = 'qlearn'; // qlearn | sarsa
        spec.gamma = 0.9; // discount factor, [0, 1)
        spec.epsilon = 0.2; // initial epsilon for epsilon-greedy policy, [0, 1)
        spec.alpha = 0.01; // value function learning rate
        spec.experience_add_every = 10; // number of time steps before we add another experience to replay memory
        spec.experience_size = 5000; // size of experience replay memory
        spec.learning_steps_per_iteration = 20;
        spec.tderror_clamp = 1.0; // for robustness
        spec.num_hidden_units = Math.floor(numStates * (2/3)); // number of neurons in hidden layer

        return new reinforce.DQNAgent(env, spec);
    }

    act(state) {
        if (state.length !== this._numStates) {
            throw new Error("Invalid state");
        }

        let toRet = this._agent.act(state);
        this._readyToLearn = true;
        return toRet;
    }

    learn(reward) {
        if (!this._readyToLearn) {
            return;
        }

        this._agent.learn(reward);
        this._readyToLearn = false;
    }
}

export default PlayerAgent;