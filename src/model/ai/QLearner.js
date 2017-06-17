import math from "../../../node_modules/mathjs/dist/math";

class QLearner {
    constructor(numStates, numActions=4, alpha=0.2, gamma=0.9, rar=0.98, radr=0.9999, verbose=true) {
        this._numStates = numStates;
        this._numActions = numActions;
        this._alpha = alpha;
        this._gamma = gamma;
        this._rar = rar;
        this._radr = radr;
        this._verbose = verbose;

        this._s = 0;
        this._a = 0;
        this._q = QLearner.createQMatrix(numStates, numActions);

        if (!!window) {
            window.q = this._q;
        }
    }

    static createQMatrix(numStates, numActions) {
        let toRet = [];

        for (let s = 0; s < numStates; s++) {
            toRet[s] = [];

            for (let a = 0; a < numActions; a++) {
                toRet[s][a] = QLearner.getRandomArbitrary(-1.0, 1.0);
            }
        }

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
        let aPrime = null;

        if (this._rar >= randomValue) {
            aPrime = Math.floor(Math.random() * this._numActions);
        } else {
            aPrime = QLearner.argMax(this._q[sPrime]);
        }

        if (updateRar) {
            this._rar = math.chain(this._rar).multiply(this._radr).done();
        }

        return aPrime;
    }
}

export default QLearner;

