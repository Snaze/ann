import math from "../../../../node_modules/mathjs/dist/math";
import ArrayUtils from "../../../utils/ArrayUtils";
import ActivationFunctions from "./ActivationFunctions";

class Normalizer {

    constructor(activationFunction) {
        this._activationFunction = activationFunction;
        this._normalizationData = [];
        // this._toNormalizePositive = [ActivationFunctions.relu, ActivationFunctions.lrelu];
        this._toNormalizePositive = ActivationFunctions.all;
    }

    normalizeToPositive(data, min = null, max = null) {
        if (min === null) {
            min = math.min(data);
        }

        if (max === null) {
            max = math.max(data);
        }

        if (!ArrayUtils.isIn(this._toNormalizePositive, this._activationFunction)) {
            return {
                data: data,
                min: min,
                max: max
            };
        }

        let numerator = math.subtract(data, min);
        let denominator = math.subtract(max, min);
        data = math.divide(numerator, denominator);

        // if (min < 0) {
        //     data = math.subtract(data, min);
        // }
        //
        // if (max > 1) {
        //     data = math.divide(data, max);
        // }

        return {
            data: data,
            min: min,
            max: max
        };
    }

    normalizeColumn(data) {
        let mean = math.mean(data);
        let stdDev = math.std(data);
        if (stdDev === 0) {
            stdDev = 1e-6;
        }

        // let data = this.normalizeColumnWithMeanAndStdDev(data, mean, stdDev);

        let temp = this.normalizeToPositive(data);

        return {
            data: temp.data,
            mean: mean,
            std: stdDev,
            min: temp.min,
            max: temp.max
        };
    }

    normalizeColumnWithMeanAndStdDev(colData, mean, stdDev) {
        return math.chain(colData).subtract(mean).divide(stdDev).done();
    }

    normalize(dataSet, saveNormalizationData=false) {

        if (saveNormalizationData) {
            this._normalizationData = [];
        }

        let width = ArrayUtils.width(dataSet);
        let height = ArrayUtils.height(dataSet);
        let toRet = ArrayUtils.create(height, width, 0);

        ArrayUtils.forEachColumn(dataSet, function (column, columnIndex) {
            let toSet = null;
            if (saveNormalizationData) {
                toSet = this.normalizeColumn(column);

                this._normalizationData.push({
                    mean: toSet.mean,
                    std: toSet.std,
                    min: toSet.min,
                    max: toSet.max
                });

                ArrayUtils.setColumn(toRet, toSet.data, columnIndex);
            } else {
                let normalizationData = this._normalizationData[columnIndex];
                // let mean = normalizationData.mean;
                // let std = normalizationData.std;
                let min = normalizationData.min;
                let max = normalizationData.max;

                toSet = column;
                // toSet = this.normalizeColumnWithMeanAndStdDev(column, mean, std);
                let temp = this.normalizeToPositive(toSet, min, max);
                toSet = temp.data;

                ArrayUtils.setColumn(toRet, toSet, columnIndex);
            }

        }.bind(this));

        return toRet;
    }

}

export default Normalizer;

