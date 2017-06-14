import { assert } from "./Assert";

it ("Assert throws", () => {
    let errorThrown = false;

    try {
        assert(false, "TEST");
    } catch (e) {
        errorThrown = true;
    }

    expect(errorThrown).toBe(true);
});

it ("Assert does not throw", () => {
    let errorThrown = false;

    try {
        assert(true, "TEST");
    } catch (e) {
        errorThrown = true;
    }

    expect(errorThrown).toBe(false);
});