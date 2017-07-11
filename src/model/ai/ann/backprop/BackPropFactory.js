import RMSProp from "./RMSProp";
import SGD from "./SGD";
import Adam from "./Adam";
import AdamMatrix from "./AdamMatrix";
import ArrayUtils from "../../../../utils/ArrayUtils";
import { assert } from "../../../../utils/Assert";

const back_prop_type_sgd = "sgd";
const back_prop_type_rms_prop = "rmsprop";
const back_prop_type_adam = "adam";
const back_prop_type_adam_matrix = "adammatrix";

const all = [
    back_prop_type_sgd,
    back_prop_type_rms_prop,
    back_prop_type_adam,
    back_prop_type_adam_matrix
];

/**
 * This is a factory for creating back propagation strategies.
 *
 * http://sebastianruder.com/optimizing-gradient-descent/index.html#gradientdescentoptimizationalgorithms
 */
class BackPropFactory {

    /**
     * This back prop type indicates the Stochastic Gradient Descent Back Prop Strategy.
     * @returns {string}
     */
    static get BACK_PROP_TYPE_SGD() { return back_prop_type_sgd; }

    /**
     * This back prop type indeicates the RMSProp Back Prop Stategy
     * @returns {string}
     */
    static get BACK_PROP_TYPE_RMS_PROP() { return back_prop_type_rms_prop; }

    /**
     * This back prop type indicates the ADAM Back Prop Stategy
     * @returns {string}
     */
    static get BACK_PROP_TYPE_ADAM() { return back_prop_type_adam; }

    /**
     * Same as Adam but Im hoping this performs better.
     * @returns {string}
     */
    static get BACK_PROP_TYPE_ADAM_MATRIX() { return back_prop_type_adam_matrix; }

    /**
     * This returns an array containing all the valid back prop strategy types.
     * @returns {Array}
     */
    static get BACK_PROP_TYPE_ALL() { return all; }



    /**
     * Use this method to create an instance of the BackPropFactory.
     *
     * @param type {String} This should be a valid BACK_PROP_TYPE.  Check the static members of this class.
     * @param layerIndex {Number} This should be the layer index of the node this class serves.
     * @param nodeIndex {Number} This should be the node index of the node this class serves.
     * @param includeBias {Boolean} This should indicate whether or not the owning node includes the bias term.
     * @param edgeStore {EdgeStore} This should be the EdgeStore class for the Neural Network.
     * @param activationFunction {Object} This should be an ActivationFunction from the ActivationFunctions class
     * @returns {*} Returns a BackProp Strategy instance specific to the owning node.
     */
    static create(type, layerIndex, nodeIndex, includeBias, edgeStore, activationFunction) {
        assert(ArrayUtils.isIn(BackPropFactory.BACK_PROP_TYPE_ALL, type), "Invalid BackProp Type");

        type = type.toLowerCase();

        switch (type) {
            case BackPropFactory.BACK_PROP_TYPE_SGD:
                return new SGD(layerIndex, nodeIndex, includeBias, edgeStore, activationFunction);
            case BackPropFactory.BACK_PROP_TYPE_RMS_PROP:
                return new RMSProp(layerIndex, nodeIndex, includeBias, edgeStore, activationFunction);
            case BackPropFactory.BACK_PROP_TYPE_ADAM:
                return new Adam(layerIndex, nodeIndex, includeBias, edgeStore, activationFunction);
            case BackPropFactory.BACK_PROP_TYPE_ADAM_MATRIX:
                return new AdamMatrix(layerIndex, nodeIndex, includeBias, edgeStore, activationFunction);
            default:
                throw new Error("Invalid BackProp Type");
        }
    }
}

export default BackPropFactory;