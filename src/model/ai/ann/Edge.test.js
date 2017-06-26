import Edge from "./Edge";
import ActivationFunctions from "./ActivationFunctions";
import WeightInitializer from "./WeightInitializer";

it ("randomizeWeights works", () => {
    let edge = new Edge("1_1", new WeightInitializer(ActivationFunctions.sigmoid, WeightInitializer.COMPRESSED_NORMAL, 3, 3));
    edge.randomizeWeight();
    expect(edge.weight !== 0).toBe(true);

    edge = new Edge("1_1", new WeightInitializer(ActivationFunctions.sigmoid, WeightInitializer.COMPRESSED_NORMAL, 3, 3));
    edge.randomizeWeight();
    expect(edge.weight !== 0).toBe(true);

    edge = new Edge("1_1", new WeightInitializer(ActivationFunctions.sigmoid, WeightInitializer.COMPRESSED_NORMAL, 3, 3));
    edge.randomizeWeight();
    expect(edge.weight !== 0).toBe(true);
});