// import MathUtil from "../MathUtil";
// import ActivationFunctions from "./ActivationFunctions";
// import math from "../../../../node_modules/mathjs/dist/math";
// import WeightInitializer from "./WeightInitializer";

class Edge {

    /**
     * Creates a new weighted edge for a Neural Network
     *
     * @param id The id shoudl conform to "sourceLayer_sourceNode__destLayer_destNode"
     * @param weightInitializer {WeightInitializer} The weight Initializer
     */
    constructor(id, weightInitializer) {
        this._id = id;
        this._weight = 0;
        this._prevWeight = 0;
        this._isAlive = true;
        this._weightInitializer = weightInitializer;
    }

    randomizeWeight() {
        this.weight = this._weightInitializer.createRandomWeight();
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

    get activationFunction() {
        return this._activationFunction;
    }

    get fanInCount() {
        return this._fanInCount;
    }

    get fanOutCount() {
        return this._fanOutCount;
    }
}

export default Edge;