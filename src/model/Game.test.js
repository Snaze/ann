import Game from "./Game";

it("Test Constructor Doesnt Bomb", () => {
    // SETUP

    // CALL
    let theGame = new Game();

    // ASSERT
    expect(theGame !== null).toBe(true);
});

it ("test getLevelName", () => {
    // SETUP

    // CALL
    let levelName = Game.getLevelName(0);
    let levelName2 = Game.getLevelName(15);

    // ASSERT
    expect(levelName).toBe("Level2WithPaths");
    expect(levelName2).toBe("Level2WithPaths");
});