import LevelFactory from "./LevelFactory";

it ("LevelFactory doesnt bomb", () => {
    // SETUP

    // CALL
    let theLevel = LevelFactory.createLevel("level2withpaths");

    // ASSERT
    expect(theLevel !== null).toBe(true);
});