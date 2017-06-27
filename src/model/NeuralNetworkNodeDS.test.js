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