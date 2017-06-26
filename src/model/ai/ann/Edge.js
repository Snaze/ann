import MathUtil from "../MathUtil";
import ActivationFunctions from "./ActivationFunctions";
import math from "../../../../node_modules/mathjs/dist/math";

class Edge {

    constructor(id) {
        this._id = id;
        this._weight = 0;
        this._prevWeight = 0;
        this._isAlive = true;
    }

    /**
     * This will assign a random weight to the edge.
     *
     * @param activationFunction The current activation function you are using.
     * @param fanInCount The total number of edges coming in to the current node.
     * @param fanOutCount The total number of edges leaving the current node.
     */
    randomizeWeight(activationFunction, fanInCount, fanOutCount) {
        let randomNum = null;
        let randomWeight = null;

        switch (activationFunction) {
            case ActivationFunctions.relu:
                randomNum = math.sqrt(math.divide(12, math.add(fanInCount, fanOutCount)));
                randomWeight = MathUtil.getRandomArbitrary(-randomNum, randomNum);
                break;
            case ActivationFunctions.tanh:
                // randomNum = NeuralNetworkNode.createClippedRandomWeight(0, 0.5, -1, 1);
                // randomWeight = math.divide(randomNum, math.sqrt(math.divide(2.0, numToCreate)));
                randomNum = math.sqrt(math.divide(6, math.add(fanInCount, fanOutCount)));
                randomWeight = MathUtil.getRandomArbitrary(-randomNum, randomNum);
                break;
            case ActivationFunctions.sigmoid:
                randomNum = math.multiply(4, math.sqrt(math.divide(6, math.add(fanInCount, fanOutCount))));
                randomWeight = MathUtil.getRandomArbitrary(-randomNum, randomNum);
                break;
            default:
                throw new Error("Unknown Activation Function");
        }

        this.weight = randomWeight;
    }

    get weight() {
        return this._weight;
    }

    set weight(value) {
        this._prevWeight = this._weight;
        this._weight = value;
    }

    get isAlive() {
        return this._isAlive;
    }

    set isAlive(value) {
        this._isAlive = value;
    }

    get id() {
        return this._id;
    }

    get prevWeight() {
        return this._prevWeight;
    }
}

export default Edge;