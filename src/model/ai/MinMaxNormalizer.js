import { assert } from "../../utils/Assert";

/**
 * Use this class to bring your data back into the range of [0, 1].  Think of this as a normalizer
 * for a single column in a dataset.
 */
class MinMaxNormalizer {

    /**
     * This is the constructor for the MinMaxNormalizer.
     *
     * @param name {string} this needs to be a unique identify which will be used in the localStorage key.
     * @param useLocalStorage {boolean} This value specifies whether or not the min / max values
     * are recorded and stored in local storage which will be used in the future
     * @constructor
     */
    constructor(name, useLocalStorage) {
        this._name = name;
        this._useLocalStorage = useLocalStorage;
        this._cache = null;
    }

    /**
     * Returns the localStorageKey.
     * @param name {string} The name used.
     * @returns {string} The key for localStorage.
     */
    static getKey(name) {
        return `MinMaxNormalizer_${name}`;
    }

    /**
     * This returns the default cache object.
     * @returns {{min: Number, max: Number}}
     */
    static getDefaultCacheObject() {
        return {
            min: Number.POSITIVE_INFINITY,
            max: Number.NEGATIVE_INFINITY
        };
    }

    /**
     * This gets the local storage backed cache object.
     * @returns {{min: Number, max: Number}|*|null}
     */
    get cache() {
        if (!this._useLocalStorage && this._cache === null) {
            this._cache = MinMaxNormalizer.getDefaultCacheObject();
        }

        if (this._useLocalStorage && this._cache === null) {
            let toSet = null;
            if (typeof(window) !== "undefined" && !!window.localStorage) {
                let temp = window.localStorage.getItem(MinMaxNormalizer.getKey(this._name));
                assert (typeof(JSON) !== "undefined");
                toSet = JSON.parse(temp);
            }

            if (toSet === null) {
                toSet = MinMaxNormalizer.getDefaultCacheObject();
            }

            this._cache = toSet;
        }

        return this._cache;
    }

    /**
     * THis will persist the cache to localStorage.
     * @private
     */
    _saveCache() {
        if (typeof(window) === "undefined" || !window.localStorage) {
            // Nothing to do.
            return;
        }

        assert (typeof(JSON) !== "undefined");
        let key = MinMaxNormalizer.getKey(this._name);
        let cacheString = JSON.stringify(this.cache);
        window.localStorage.setItem(key, cacheString);
        if (typeof(console) !== "undefined") {
            console.log(`MinMaxNormalizer Successfully Cache Object ${cacheString}`);
        }
    }

    /**
     * Use this method to normalize the values of an array.
     * @param arrayToNormalize {Array} Array of numbers to normalize.
     * @returns {Array} Returns normalized Array.
     */
    normalize(arrayToNormalize) {
        let min = Math.min(...arrayToNormalize);
        let max = Math.max(...arrayToNormalize);
        let cacheChanged = false;

        if (min < this.cache.min) {
            this.cache.min = min;
            cacheChanged = true;
        }

        if (max > this.cache.max) {
            this.cache.max = max;
            cacheChanged = true;
        }

        if (cacheChanged) {
            this._saveCache();
        }

        return arrayToNormalize.map(function (x) {
            return (x - min) / (max - min);
        });
    }
}

export default MinMaxNormalizer;