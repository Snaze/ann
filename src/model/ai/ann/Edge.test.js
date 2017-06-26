import Edge from "./Edge";
import ActivationFunctions from "./ActivationFunctions";

it ("randomizeWeights works", () => {
    let edge = new Edge("1_1");
    edge.randomizeWeight(ActivationFunctions.tanh, 7, 7);
    expect(edge.weight !== 0).toBe(true);

    edge = new Edge();
    edge.randomizeWeight(ActivationFunctions.sigmoid, 7, 7);
    expect(edge.weight !== 0).toBe(true);

    edge = new Edge();
    edge.randomizeWeight(ActivationFunctions.relu, 7, 7);
    expect(edge.weight !== 0).toBe(true);
});