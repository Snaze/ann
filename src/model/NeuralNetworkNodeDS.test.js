import NeuralNetworkNodeDS from "./NeuralNetworkNodeDS";
import NeuralNetworkNode from "./ai/ann/NeuralNetworkNode";
import EdgeStore from "./ai/ann/EdgeStore";
import ActivationFunctions from "./ai/ann/ActivationFunctions";

it ("constructor", () => {
    let edgeStore = new EdgeStore([3, 3, 3], true, ActivationFunctions.sigmoid);
    let nnn = new NeuralNetworkNode(0, 0, edgeStore, 3, 3);
    let instance = new NeuralNetworkNodeDS(nnn);

    expect(instance !== null).toBe(true);
});

it ("test getActivationInputEquation", () => {
    // SETUP
    let edgeStore = new EdgeStore([2, 2, 2], false, ActivationFunctions.sigmoid);
    let nnn = new NeuralNetworkNode(1, 0, edgeStore, 2, 2, false);
    nnn.weights = [0.5, 0.4];
    nnn._prevInputs = [[0.5, 0.4]];
    let instance = new NeuralNetworkNodeDS(nnn);

    // CALL
    let toCheck = instance.getActivationInputEquation(0);

    // ASSERT
    expect(toCheck).toBe("0.5000 * 0.5000 + 0.4000 * 0.4000");
});

it ("test getActivationInputEquation input node", () => {
    // SETUP
    let edgeStore = new EdgeStore([2, 2, 2], false, ActivationFunctions.sigmoid);
    let nnn = new NeuralNetworkNode(0, 0, edgeStore, 2, 2, false);
    // nnn.weights = [];
    nnn._prevInputs = [[0.5, 0.4]];
    let instance = new NeuralNetworkNodeDS(nnn);

    // CALL
    let toCheck = instance.getActivationInputEquation(0);

    // ASSERT
    expect(toCheck).toBe("0.5000");
});