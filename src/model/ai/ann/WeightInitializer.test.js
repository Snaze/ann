import WeightInitializer from "./WeightInitializer";
import ActivationFunctions from "./ActivationFunctions";

it ("constructor works", () => {
    let test = new WeightInitializer(ActivationFunctions.sigmoid, WeightInitializer.COMPRESSED_NORMAL, 3, 3);

    expect(test !== null).toBe(true);
});

const testFanInFanOut = function (activationFunction) {
    let test = new WeightInitializer(activationFunction, WeightInitializer.COMPRESSED_NORMAL, 3, 3);

    let retVal = test._createFanInFanOutWeight();

    expect(retVal >= -10 && retVal <= 10).toBe(true);
};

it ("test fan in / fan out", () => {
    ActivationFunctions.all.forEach(function (activationFunction) {
        testFanInFanOut(activationFunction);
    });
});

const testGenericNormal = function (activationFunction) {
    let test = new WeightInitializer(activationFunction, WeightInitializer.COMPRESSED_NORMAL, 3, 3);

    let retVal = test._createGenericNormal();

    expect(retVal >= -10 && retVal <= 10).toBe(true);
};

it ("test generic normal", () => {
    ActivationFunctions.all.forEach(function (activationFunction) {
        testGenericNormal(activationFunction);
    });
});

const testCompressedNormal = function (activationFunction) {
    let test = new WeightInitializer(activationFunction, WeightInitializer.COMPRESSED_NORMAL, 3, 3);

    let retVal = test._createCompressedNormal();

    expect(retVal >= -10 && retVal <= 10).toBe(true);
};

it ("test compressed normal", () => {
    ActivationFunctions.all.forEach(function (activationFunction) {
        testCompressedNormal(activationFunction);
    });
});

const testInitializationType = function (activationFunction, initializationType) {
    let test = new WeightInitializer(activationFunction, initializationType, 3, 3);

    let retVal = test.createRandomWeight();

    expect(retVal >= -10 && retVal <= 10).toBe(true);
};

it ("test initializationTypes", () => {
    ActivationFunctions.all.forEach(function (activationFunction) {
        WeightInitializer.ALL.forEach(function (initializationType) {
            testInitializationType(activationFunction, initializationType);
        });
    });
});