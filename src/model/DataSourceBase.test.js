import DataSourceBase from "./DataSourceBase";

it("The Entire LifeCycle of DataSourceBase", () => {
    let toTest = new DataSourceBase();

    let propertyName = "_value";
    let valueToSet = "valueToSet";
    let valueRetrieved = null;
    let valueSource = null;
    let functionCalled = false;
    let theCallback = function (data) {
        valueRetrieved = data.object[propertyName];
        valueSource = data.source;
        functionCalled = true;
    };

    toTest.addOnChangeCallback(theCallback);
    toTest._setValueAndRaiseOnChange(propertyName, valueToSet);

    expect(valueRetrieved).toBe(valueToSet);
    expect(valueSource).toBe(propertyName);
    expect(functionCalled).toBe(true);

    toTest.removeOnChangeCallback(theCallback);
    functionCalled = false;
    toTest._setValueAndRaiseOnChange(propertyName, valueToSet);
    expect(functionCalled).toBe(false);
});

class Child extends DataSourceBase {
    constructor() {
        super();

        this._childProp = "Child Prop";
    }


    get childProp() {
        return this._childProp;
    }

    set childProp(value) {
        this._setValueAndRaiseOnChange("_childProp", value);
    }
}

class Parent extends DataSourceBase {
    constructor() {
        super();

        this._test = "test";
        this._child = this._wireUp("_child", new Child());
    }

    get test() {
        return this._test;
    }

    set test(value) {
        this._setValueAndRaiseOnChange("_test");
    }

    get child() {
        return this._child;
    }

    set child(value) {
        this._setValueAndRaiseOnChange("_child");
    }
}

it ("test changing the child prop", () => {
    // SETUP
    let parent = new Parent();
    let childPropToSet = "TEST VALUE";
    let functionDidFireCorrectly = false;
    let myOnChangeFunction = function (e) {
        if (e.source === "_child._childProp" &&
            e.newValue === childPropToSet) {
            functionDidFireCorrectly = true;
        }
    };
    parent.addOnChangeCallback(myOnChangeFunction);

    // CALL
    parent.child.childProp = childPropToSet;

    // ASSERT
    expect(functionDidFireCorrectly).toBe(true);
});

it ("test unwiring child prop", () => {
    // SETUP
    let parent = new Parent();
    let child = parent.child;
    expect(child.numCallbacks).toBe(1);
    expect(child._ownerPropName).toBe("_child");

    // CALL
    parent.removeAllCallbacks();

    // ASSERT
    expect(child.numCallbacks).toBe(0);
    expect(child._ownerPropName).toBe(null);
});
