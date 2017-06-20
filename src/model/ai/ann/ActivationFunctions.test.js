import ActivationFunctions from "./ActivationFunctions";

it ("sigmoid output works", () => {

    // CALL
    let result = ActivationFunctions.sigmoid.output(0.755);

    // ASSERT
    expect(Math.round(result * 100) / 100).toBe(0.68);
});

it ("sigmoid output layer error works", () => {

    // CALL
    let result = ActivationFunctions.sigmoid.outputError(0.5, 0.69);

    // ASSERT
    expect(Math.round(result * 10000) / 10000).toBe(-0.0406);
});

it ("sigmoid hidden layer error works", () => {
    // CALL
    let result = ActivationFunctions.sigmoid.hiddenError([-0.0406], [0.272392], 0.68);

    // ASSERT
    expect(Math.round(result * 10e5) / 10e5).toBe(-2.406e-3);
});