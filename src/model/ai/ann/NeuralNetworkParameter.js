

class NeuralNetworkParameter {

    constructor() {
        this._inputs = null;
        this._expectedOutputs = null;
        this._miniBatchSize = 10;
        this._maxEpochs = 100;
        this._minError = null;
        this._minWeightDelta = null;
        this._cacheMinError = false;
        this._normalizeInputs = false;
    }

    get normalizeInputs() {
        return this._normalizeInputs;
    }

    set normalizeInputs(value) {
        this._normalizeInputs = value;
    }

    get inputs() {
        return this._inputs;
    }

    set inputs(value) {
        this._inputs = value;
    }

    get expectedOutputs() {
        return this._expectedOutputs;
    }

    set expectedOutputs(value) {
        this._expectedOutputs = value;
    }

    get miniBatchSize() {
        return this._miniBatchSize;
    }

    set miniBatchSize(value) {
        this._miniBatchSize = value;
    }

    get maxEpochs() {
        return this._maxEpochs;
    }

    set maxEpochs(value) {
        this._maxEpochs = value;
    }

    get minError() {
        return this._minError;
    }

    set minError(value) {
        this._minError = value;
    }

    get minWeightDelta() {
        return this._minWeightDelta;
    }

    set minWeightDelta(value) {
        this._minWeightDelta = value;
    }

    get cacheMinError() {
        return this._cacheMinError;
    }

    set cacheMinError(value) {
        this._cacheMinError = value;
    }
}

export default NeuralNetworkParameter;