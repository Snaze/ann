import PlayerAgent from "./PlayerAgent";

it ("test constructor", () => {

    // CALL
    let theAgent = new PlayerAgent(8);

    // ASSERT
    expect(theAgent !== null).toBe(true);
});

