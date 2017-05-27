import Eventer from "../utils/Eventer";

class DataSourceBase {
    static nextId = 1;
    static getNextId() {
        return DataSourceBase.nextId++;
    }

    constructor() {
        this._id = DataSourceBase.getNextId().toString();
        this._ownerPropName = null;
        this._eventer = new Eventer();
        this._nestDataSourceChangedRef = (e) => this._nestedDataSourceChanged(e);
        this._nestedDataSources = {};
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
                this._unWire(this._nestedDataSources[prop]);
            }
        }
    }

    _nestedDataSourceChanged(e) {
        let source = e.object.ownerPropName + "." + e.source;
        this._eventer.raiseEvent({
            object: this,
            source: source,
            oldValue: e.oldValue,
            newValue: e.newValue
        });
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

        if (typeof(this._nestedDataSources[nestedObject.id]) !== "undefined") {
            throw new Error("this._nestDataSource already contains a id '" + nestedObject.id + "'");
        }

        // if (typeof(this[propName]) !== "undefined") {
        //     throw new Error("this object already has a property named '" + propName + "'");
        // }

        nestedObject.addOnChangeCallback(this._nestDataSourceChangedRef);
        this._nestedDataSources[nestedObject.id] = nestedObject;

        nestedObject._ownerPropName = propName;

        return nestedObject;
    }

    _unWire(nestedObject) {
        if (!(nestedObject instanceof DataSourceBase)) {
            throw new Error("toNest must be an instance of DataSourceBase");
        }

        if (typeof(this._nestedDataSources[nestedObject.id]) === "undefined") {
            throw new Error("this._nestDataSource does not contain nestedObject.id = '" + nestedObject.id + "'");
        }

        nestedObject.removeOnChangeCallback(this._nestDataSourceChangedRef);
        nestedObject._ownerPropName = null;
        delete this._nestedDataSources[nestedObject.id];
    }

    _unWireForDestruction(nestedObject) {
        this._unWire(nestedObject);
        nestedObject.removeAllCallbacks();
    }

    _raiseOnChangeCallbacks(source, oldValue, newValue) {
        this._eventer.raiseEvent({
            object: this,
            source: source,
            oldValue: oldValue,
            newValue: newValue
        });
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

    get id() {
        return this._id;
    }

    get ownerPropName() {
        return this._ownerPropName;
    }

    get numCallbacks() {
        return this._eventer.numCallbacks;
    }
}

export default DataSourceBase;