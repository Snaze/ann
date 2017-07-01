
const decay_type_exponential = 0;

class LearningRate {

    static get DECAY_TYPE_EXPONENTIAL() { return decay_type_exponential; }

    constructor(startValue, endValue, numEpochs, decayType=LearningRate.DECAY_TYPE_EXPONENTIAL) {
        this._startValue = startValue;
        this._endValue = endValue;
        this._numEpochs = numEpochs;
        this._decayType = decayType;
        this._growthConstant = LearningRate.getGrowthConstant(startValue, endValue, numEpochs);
    }

    static getGrowthConstant(startValue, endValue, numEpochs) {
        return Math.log(endValue/startValue) / numEpochs;
    }

    /**
     * This will return the learning rate at time t
     *
     * @param t {Number} This should most likely be the epoch number
     */
    getLearningRate(t) {
        return this._startValue * Math.exp(this._growthConstant * t);
    }

    get startValue() {
        return this._startValue;
    }

    set startValue(value) {
        this._startValue = value;
        this._growthConstant = LearningRate.getGrowthConstant(this._startValue, this._endValue, this._numEpochs);
    }

    get endValue() {
        return this._endValue;
    }

    set endValue(value) {
        this._endValue = value;
        this._growthConstant = LearningRate.getGrowthConstant(this._startValue, this._endValue, this._numEpochs);
    }

    get numEpochs() {
        return this._numEpochs;
    }

    set numEpochs(value) {
        this._numEpochs = value;
        this._growthConstant = LearningRate.getGrowthConstant(this._startValue, this._endValue, this._numEpochs);
    }

    get decayType() {
        return this._decayType;
    }

    get growthConstant() {
        return this._growthConstant;
    }
}

export default LearningRate;