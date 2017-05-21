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