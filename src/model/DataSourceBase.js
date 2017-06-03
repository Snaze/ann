import Eventer from "../utils/Eventer";
import _ from "../../node_modules/lodash/lodash";

class DataSourceBase {
    static nextId = 1;
    static getNextId() {
        return DataSourceBase.nextId++;
    }

    constructor() {
        this._dataSourceId = DataSourceBase.getNextId().toString();
        this._ownerPropName = null;
        this._eventer = new Eventer();
        this._nestDataSourceChangedRef = (e) => this._nestedDataSourceChanged(e);
        this._nestedDataSources = {};
        this._debug = false;
        this._toIgnore = [];
    }

    addOnChangeCallback(callback) {
        this._eventer.addCallback(callback);
    }

    removeOnChangeCallback(callback) {
        this._eventer.removeCallback(callback);
    }

    removeAllCallbacks() {
        this._eventer.removeAllCallbacks();

        for (let prop in this._nestedDataSources) {
            if (this._nestedDataSources.hasOwnProperty(prop)) {
                this._unWireForDestruction(this._nestedDataSources[prop]);
            }
        }
    }

    log (toLog) {
        if (this.debug && (typeof(console) !== "undefined")) {
            console.log(toLog);
        }
    }

    _shouldIgnore(source) {
        for (let i = 0; i < this._toIgnore.length; i++) {
            if (_.endsWith(this._toIgnore[i], source)) {
                return true;
            }
        }

        return false;
    }

    _nestedDataSourceChanged(e) {

        // When overridding this method, add your custom code and then call super
        // super._nestedDataSourceChanged(e);

        if (this._shouldIgnore(e.source)) {
            return;
        }

        let source = e.object.ownerPropName + "." + e.source;
        this._eventer.raiseEvent({
            object: this,
            source: source,
            oldValue: e.oldValue,
            newValue: e.newValue
        });

        this.log("DataSourceBase._nestedDataSourceChanged: " + source);
    }

    /**
     * In the constructor, when setting a private field on your object, use this method
     * to wire up the onchange events.
     *
     * @param propName The private field name of the object.
     * @param nestedObject The nested object you wish to set to the private field name
     */
    _wireUp(propName, nestedObject) {
        if (!(nestedObject instanceof DataSourceBase)) {
            throw new Error("toNest must be an instance of DataSourceBase");
        }

        if (typeof(this._nestedDataSources[nestedObject.dataSourceId]) !== "undefined") {
            throw new Error("this._nestDataSource already contains a id '" + nestedObject.dataSourceId + "'");
        }

        nestedObject.addOnChangeCallback(this._nestDataSourceChangedRef);
        this._nestedDataSources[nestedObject.dataSourceId] = nestedObject;

        nestedObject._ownerPropName = propName;

        return nestedObject;
    }

    _unWire(nestedObject) {
        if (!(nestedObject instanceof DataSourceBase)) {
            throw new Error("toNest must be an instance of DataSourceBase");
        }

        if (typeof(this._nestedDataSources[nestedObject.dataSourceId]) === "undefined") {
            throw new Error("this._nestDataSource does not contain nestedObject.dataSourceId = '" + nestedObject.dataSourceId + "'");
        }

        nestedObject.removeOnChangeCallback(this._nestDataSourceChangedRef);
        nestedObject._ownerPropName = null;
        delete this._nestedDataSources[nestedObject.dataSourceId];
    }

    _unWireForDestruction(nestedObject) {
        this._unWire(nestedObject);
        nestedObject.removeAllCallbacks();
    }

    _raiseOnChangeCallbacks(source, oldValue, newValue) {
        if (this._shouldIgnore(source)) {
            return;
        }

        this._eventer.raiseEvent({
            object: this,
            source: source,
            oldValue: oldValue,
            newValue: newValue
        });

        this.log("DataSourceBase._raiseOnChangeCallbacks: " + source);
    }

    _setValueAndRaiseOnChange(property, newValue) {
        if ((typeof(this[property]) !== 'undefined') &&
            this[property] === newValue) {
            return;
        }

        let oldValue = this[property];
        this[property] = newValue;
        this._raiseOnChangeCallbacks(property, oldValue, newValue);
    }

    get dataSourceId() {
        return this._dataSourceId;
    }

    get ownerPropName() {
        return this._ownerPropName;
    }

    get numCallbacks() {
        return this._eventer.numCallbacks;
    }


    get debug() {
        return this._debug;
    }

    set debug(value) {
        this._debug = value;
    }

    get toIgnore() {
        return this._toIgnore;
    }
}

export default DataSourceBase;