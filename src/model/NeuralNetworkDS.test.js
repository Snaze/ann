import NeuralNetworkDS from "./NeuralNetworkDS";
import NeuralNetwork from "./ai/ann/NeuralNetwork";

it ("constructor test", () => {
    let nn = new NeuralNetwork([2, 2, 1]);

    let instance = new NeuralNetworkDS(nn);
    expect(instance !== null).toBe(true);
});