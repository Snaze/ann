import ArrayUtils from "../../../../../utils/ArrayUtils";
import { Matrix } from "vectorious";
import { assert } from "../../../../../utils/Assert";


/**
 * This will perform the Adam flavor of Back Prop using vectorious (so hopefully this will be
 * faster)
 */
class Adam {

    /**
     * Constructor for the ADAM BLAS backprop method.
     *
     * Consult the following website for more info on what these parameters do.
     *
     * http://sebastianruder.com/optimizing-gradient-descent/index.html#gradientdescentoptimizationalgorithms
     *
     * @param gradientDecay {Number} This decays the gradient.
     * @param squaredGradientDecay {Number} This decays the squared gradient.
     * @param errorFactor {Number} The error factor.
     */
    constructor(gradientDecay=0.9, squaredGradientDecay=0.999, errorFactor=1e-8) {
        this._gradientDecay = gradientDecay;
        this._inverseGradientDecay = (1.0 - this._gradientDecay);
        this._squaredGradientDecay = squaredGradientDecay;
        this._inverseSquaredGradientDecay = (1.0 - this._squaredGradientDecay);
        this._errorFactor = errorFactor;

        this._gradient = null;
        this._gradientSquared = null;
    }

    /**
     * This method will populate this._gradient and this._gradientSquared if null.
     * @param shape {Array} This is be the shape of the incoming default SGD gradient
     * @private
     */
    _populateGradientHistory(shape) {
        if (this._gradient === null) {
            this._gradient = new Matrix(ArrayUtils.create(shape[0], shape[1], 0));
        }

        if (this._gradientSquared === null) {
            this._gradientSquared = new Matrix(ArrayUtils.create(shape[0], shape[1], 0));
        }
    }

    /**
     * This method will calculate weight deltas according to the standard SGD deltas.
     *
     * n = # of inputs / # of incoming weights per node
     * m = # of records in mini-batch
     * r = # of nodes in next layer / # of error values in next layer / # of outgoing weights
     * p = # of nodes in current layer / "this._numNodes"
     *
     * @param currentGradient {Matrix} The SGD gradients.  This should be (n x p)
     * @param learningRate {Number} This should be the current learning rate 1 >= learningRate > 0
     */
    getWeightDeltas(currentGradient, learningRate) {
        assert (learningRate > 0 && learningRate <= 1, "Invalid Learning Rate");

        this._populateGradientHistory(currentGradient.shape);

        // let test = BLAS;
        let m_t = Matrix.scale(this.gradient, this.gradientDecay)
            .add(Matrix.scale(currentGradient, this.inverseGradientDecay));

        let currentGradientSquared = Matrix.product(currentGradient, currentGradient);

        let v_t = Matrix.scale(this.gradientSquared, this.squaredGradientDecay)
            .add(Matrix.scale(currentGradientSquared, this.inverseSquaredGradientDecay));

        let mHat_t = Matrix.scale(m_t, 1.0/this.inverseGradientDecay);

        let vHat_t = Matrix.scale(v_t, 1.0/this.inverseSquaredGradientDecay);

        // TODO: You could probably interface with BLAS directly and make this faster.
        let weightDeltas = mHat_t.map(function(currMHatT, row, column) {
            return -(learningRate / (Math.sqrt(vHat_t.get(row, column)) + this.errorFactor)) * currMHatT;
        }.bind(this));

        this._gradient = m_t;
        this._gradientSquared = v_t;

        return weightDeltas;
    }

    /**
     * This is the previous Gradient used to find the weight deltas
     *
     * @returns {Matrix}
     */
    get gradient() {
        return this._gradient;
    }

    /**
     * This is the previous Squared Gradient used to find weight deltas
     * @returns {Matrix}
     */
    get gradientSquared() {
        return this._gradientSquared;
    }

    /**
     *
     * @returns {Number|*}
     */
    get gradientDecay() {
        return this._gradientDecay;
    }

    /**
     *
     * @returns {Number|*}
     */
    get squaredGradientDecay() {
        return this._squaredGradientDecay;
    }

    /**
     *
     * @returns {Number|*}
     */
    get errorFactor() {
        return this._errorFactor;
    }

    /**
     *
     * @returns {number|*}
     */
    get inverseGradientDecay() {
        return this._inverseGradientDecay;
    }

    get inverseSquaredGradientDecay() {
        return this._inverseSquaredGradientDecay;
    }
}

export default Adam;