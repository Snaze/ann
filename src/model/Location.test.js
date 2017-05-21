import Location from "./Location";
import _ from "../../node_modules/lodash/lodash";

it("toArray works", () => {
    let loc = new Location(1, 2);

    expect(_.isEqual(loc.toArray(), [2, 1])).toBe(true);
    expect(_.isEqual(loc.toArray(false), [1, 2])).toBe(true);
});

it ("toString works", () => {
    let loc = new Location(1, 2);

    expect(loc.toString()).toBe("(1, 2)");
});

it ("fromIndexArray works", () => {
    let indexArray = [1, 2];
    let loc = Location.fromIndexArray(indexArray);

    expect(loc.x).toBe(2);
    expect(loc.y).toBe(1);

    loc = Location.fromIndexArray(indexArray, false);

    expect(loc.x).toBe(1);
    expect(loc.y).toBe(2);
});
