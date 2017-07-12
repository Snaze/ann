import ActivationFunctions from "./ActivationFunctions";
import ArrayUtils from "../../../utils/ArrayUtils";
import { assert } from "../../../utils/Assert";
import MathUtil from "../MathUtil";
import math from "../../../../node_modules/mathjs/dist/math";
import randgen from "../../../../node_modules/randgen/lib/randgen";

const fan_in_fan_out = 0;
const generic_normal = 1;
const compressed_normal = 2;
const valid = [
    fan_in_fan_out,
    generic_normal,
    compressed_normal
];

class WeightInitializer {

    static get FAN_IN_FAN_OUT() { return fan_in_fan_out; }
    static get GENERIC_NORMAL() { return generic_normal; }
    static get COMPRESSED_NORMAL() { return compressed_normal; }
    static get ALL() { return valid; }

    constructor(activationFunction, initializationType, fanInCount=null, fanOutCount=null) {
        assert (ArrayUtils.isIn(ActivationFunctions.all, activationFunction), "Invalid activation function");
        assert (ArrayUtils.isIn(valid, initializationType), "Invalid initialization type");
        // assert (fanInCount >= 0, "fanInCount must be >= 0");
        // assert (fanOutCount >= 0, "fanOutCount must be >= 0");

        this._activationFunction = activationFunction;
        this._initializationType = initializationType;
        this._fanInCount = fanInCount;
        this._fanOutCount = fanOutCount;
    }

    _createFanInFanOutWeight(fanInCount=null, fanOutCount=null) {
        let randomNum = null;
        let randomWeight = null;

        if (fanInCount === null) {
            fanInCount = this.fanInCount;
        }

        if (fanOutCount === null) {
            fanOutCount = this.fanOutCount;
        }

        switch (this.activationFunction) {
            case ActivationFunctions.relu:
            case ActivationFunctions.lrelu:
            case ActivationFunctions.identity:
                randomNum = math.sqrt(math.divide(12, math.add(fanInCount, fanOutCount)));
                randomWeight = MathUtil.getRandomArbitrary(-randomNum, randomNum);
                break;
            case ActivationFunctions.tanh:
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

        return randomWeight;
    }

    _createGenericNormal() {
        return randgen.rnorm(0.0, 1.0);
    }

    _createCompressedNormal(fanInCount=null) {
        if (fanInCount === null) {
            fanInCount = this.fanInCount;
        }

        // if (fanOutCount === null) {
        //     fanOutCount = this.fanOutCount;
        // }

        let std = math.divide(1, math.sqrt(fanInCount));
        return randgen.rnorm(0.0, std);
    }

    createRandomWeight(fanIn=null, fanOut=null) {

        switch (this.initializationType) {
            case fan_in_fan_out:
                return this._createFanInFanOutWeight(fanIn, fanOut);
            case generic_normal:
                return this._createGenericNormal(fanIn, fanOut);
            case compressed_normal:
                return this._createCompressedNormal(fanIn, fanOut);
            default:
                throw new Error("Invalid Initialization Type");
        }
    }

    get initializationType() {
        return this._initializationType;
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

export default WeightInitializer;