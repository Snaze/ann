import moment from "moment";
import { assert } from "./Assert";

const type_start = 0;
const type_end = 1;

let instance = null;

/**
 * Use this class to see how long certain things are taking to run.
 *
 * This class is a singleton.
 */
class TimeRecorder {

    /**
     * The constructor of the TimeRecorder object.
     * @constructor
     */
    constructor() {
        if (instance !== null) {
            return instance;
        }

        instance = this;

        this._cache = {};

        return instance;
    }

    /**
     * Use this method to pull the data object out of the cache.
     * @param key {string} This is the cache key to use.
     * @returns {*} The cache object.
     * @private
     */
    _getCacheObject(key) {
        if (!(key in this._cache)) {
            this._cache[key] = {
                type: type_end,
                startTime: null,
                endTime: null,
                avgDuration: null,
                minDuration: null,
                maxDuration: null,
                numIterations: 0
            };
        }

        return this._cache[key];
    }

    logSummary() {
        let cacheObject;

        Object.keys(this._cache).forEach(function (key) {
            cacheObject = this._cache[key];

            console.log(`---------------- START ${key} -----------------`);
            console.log(`Duration (avg): ${cacheObject.avgDuration} ms`);
            console.log(`Duration (min): ${cacheObject.minDuration} ms`);
            console.log(`Duration (max): ${cacheObject.maxDuration} ms`);
            console.log(`Iterations    : ${cacheObject.numIterations}`);
            console.log(`----------------- END ${key} ------------------`);
            console.log("\n");

        }.bind(this));
    }

    /**
     * Use this method to start timing an event.
     * @param key {string} the string that identitifies the event.
     */
    recordStart(key) {
        let now = moment();

        let cacheObj = this._getCacheObject(key);

        assert (cacheObj.type === type_end, "You are calling these methods out of sync");

        cacheObj.type = type_start;
        cacheObj.startTime = now;
    }

    /**
     * Use this method to stop timing the event.
     * @param key {string} this string identifies the event you wish to stop timing.
     */
    recordEnd(key) {
        let now = moment();

        let cacheObj = this._getCacheObject(key);

        assert (cacheObj.type === type_start, "You are calling these methods out of sync");

        cacheObj.numIterations++;
        cacheObj.endTime = now;
        cacheObj.type = type_end;

        let duration = now.diff(cacheObj.startTime);
        if (cacheObj.avgDuration === null) {
            cacheObj.avgDuration = duration;
        } else {
            // CALCULATE AVG
            cacheObj.avgDuration += (duration - cacheObj.avgDuration) / cacheObj.numIterations;
        }

        if (cacheObj.minDuration === null) {
            cacheObj.minDuration = duration;
        } else {
            if (duration < cacheObj.minDuration) {
                cacheObj.minDuration = duration;
            }
        }

        if (cacheObj.maxDuration === null) {
            cacheObj.maxDuration = duration;
        } else {
            if (duration > cacheObj.maxDuration) {
                cacheObj.maxDuration = duration;
            }
        }
    }

}

export default TimeRecorder;