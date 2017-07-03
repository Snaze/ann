// import Location from "../Location";
import ArrayUtils from "../../utils/ArrayUtils";
import Player from "../actors/Player";
import Ghost from "../actors/Ghost";
import PowerUp from "../actors/PowerUp";
import GameObjectContainer from "../GameObjectContainer";

/**
 * This class should be used to convert the GameObjectContainer into a feature vector
 * that will be used to train the NN.
 */
class StateConverter {

    /**
     * This method will capitalize that first character of a string
     * @param color {string}
     * @returns {string}
     */
    static capitalizeStartChar(color) {
        let splitArray = color.split("");
        splitArray[0] = splitArray[0].toUpperCase();
        return splitArray.join("");
    }

    static _trainingFeatureIndices = null;
    static get trainingFeatureIndices() {
        if (StateConverter._trainingFeatureIndices === null) {
            let toSet = [];
            let temp;
            let currentLength = 0;

            // PLAYER
            temp = ArrayUtils.copy(Player.trainingFeatureIndices);
            ArrayUtils.extend(toSet, temp);
            currentLength += Player.featureVectorLength;

            // Ghost Red
            temp = ArrayUtils.copy(Ghost.trainingFeatureIndices);
            temp = temp.map((item) => item + currentLength);
            ArrayUtils.extend(toSet, temp);
            currentLength += Ghost.featureVectorLength;

            // Ghost Blue
            temp = ArrayUtils.copy(Ghost.trainingFeatureIndices);
            temp = temp.map((item) => item + currentLength);
            ArrayUtils.extend(toSet, temp);
            currentLength += Ghost.featureVectorLength;

            // Ghost Pink
            temp = ArrayUtils.copy(Ghost.trainingFeatureIndices);
            temp = temp.map((item) => item + currentLength);
            ArrayUtils.extend(toSet, temp);
            currentLength += Ghost.featureVectorLength;

            // Ghost Orange
            temp = ArrayUtils.copy(Ghost.trainingFeatureIndices);
            temp = temp.map((item) => item + currentLength);
            ArrayUtils.extend(toSet, temp);
            currentLength += Ghost.featureVectorLength;

            // PowerUp
            temp = ArrayUtils.copy(PowerUp.trainingFeatureIndices);
            temp = temp.map((item) => item + currentLength);
            ArrayUtils.extend(toSet, temp);
            currentLength += PowerUp.featureVectorLength;

            // GameObjectContainer
            temp = ArrayUtils.copy(GameObjectContainer.trainingFeatureIndices);
            temp = temp.map((item) => item + currentLength);
            ArrayUtils.extend(toSet, temp);
            currentLength += GameObjectContainer.featureVectorLength;

            StateConverter._trainingFeatureIndices = toSet;
        }

        return StateConverter._trainingFeatureIndices;
    }

    /**
     * This will convert the GameObjectContainer into the feature vector.
     *
     * @param goc {GameObjectContainer}
     * @returns {Array}
     */
    toFeatureVector(goc) {
        // Must be done in this order...
        // PLAYER
        // Ghost Red
        // Ghost Blue
        // Ghost Pink
        // Ghost Orange
        // PowerUp
        // GameObjectContainer

        let toRet = [];

        ArrayUtils.extend(toRet, goc.player.toFeatureVector());
        ArrayUtils.extend(toRet, goc.ghostRed.toFeatureVector());
        ArrayUtils.extend(toRet, goc.ghostBlue.toFeatureVector());
        ArrayUtils.extend(toRet, goc.ghostPink.toFeatureVector());
        ArrayUtils.extend(toRet, goc.ghostOrange.toFeatureVector());
        ArrayUtils.extend(toRet, goc.powerUp.toFeatureVector());
        ArrayUtils.extend(toRet, goc.toFeatureVector());

        return toRet;
    }

    /**
     * This will modify the GameObjectContainer to represent the state
     * of the feature vector
     *
     * @param goc {GameObjectContainer}
     * @param featureVector {Array}
     */
    setFeatureVector(goc, featureVector) {
        // PLAYER
        // Ghost Red
        // Ghost Blue
        // Ghost Pink
        // Ghost Orange
        // PowerUp
        // GameObjectContainer

        let currentStartIndex = 0;
        goc.player.setFeatureVector(ArrayUtils.take(featureVector, Player.featureVectorLength, currentStartIndex));
        currentStartIndex += Player.featureVectorLength;

        goc.ghostRed.setFeatureVector(ArrayUtils.take(featureVector, Ghost.featureVectorLength, currentStartIndex));
        currentStartIndex += Ghost.featureVectorLength;

        goc.ghostBlue.setFeatureVector(ArrayUtils.take(featureVector, Ghost.featureVectorLength, currentStartIndex));
        currentStartIndex += Ghost.featureVectorLength;

        goc.ghostPink.setFeatureVector(ArrayUtils.take(featureVector, Ghost.featureVectorLength, currentStartIndex));
        currentStartIndex += Ghost.featureVectorLength;

        goc.ghostOrange.setFeatureVector(ArrayUtils.take(featureVector, Ghost.featureVectorLength, currentStartIndex));
        currentStartIndex += Ghost.featureVectorLength;

        goc.powerUp.setFeatureVector(ArrayUtils.take(featureVector, PowerUp.featureVectorLength, currentStartIndex));
        currentStartIndex += PowerUp.featureVectorLength;

        goc.setFeatureVector(ArrayUtils.take(featureVector, GameObjectContainer.featureVectorLength, currentStartIndex));
        // currentStartIndex += GameObjectContainer.featureVectorLength;
    }

}

export default StateConverter;