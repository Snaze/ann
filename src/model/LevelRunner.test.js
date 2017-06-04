import LevelRunner from "./LevelRunner";

it ("LevelRunner constructor works", () => {
    new LevelRunner("Level2WithPaths");
});

it ("DataSourceBase dispose works", () => {
    let lr = new LevelRunner("Level2WithPaths");
    lr.dispose();
    lr = null;
});

it ("startLevel doesnt bomb", () => {
    // SETUP
    let lr = new LevelRunner("Level2WithPaths");
    let origLevel = lr.level;

    // CALL
    lr.startLevel("Level2WithPaths");

    // ASSERT
    expect(origLevel === lr.level).toBe(true);
});

it ("startLevel doesnt bomb diff level", () => {
    // SETUP
    let lr = new LevelRunner("Level2WithPaths");
    let origLevel = lr.level;

    // CALL
    lr.startLevel("Level3WithPaths");

    // ASSERT
    expect(origLevel !== lr.level).toBe(true);
});

it ("startLevel doesnt bomb same level force reload", () => {
    // SETUP
    let lr = new LevelRunner("Level2WithPaths");
    let origLevel = lr.level;

    // CALL
    lr.startLevel("Level2WithPaths", true);

    // ASSERT
    expect(origLevel !== lr.level).toBe(true);
});

it ("loadLevel sets the level num", () => {
    // SETUP
    let lr = new LevelRunner("Level2WithPaths");
    let origLevel = lr.level;

    // CALL
    lr.loadLevel("Level3WithPaths", false, 5);

    // ASSERT
    expect(origLevel !== lr.level).toBe(true);
    expect(lr.level.levelNum).toBe(5);
    expect(lr.levelNum).toBe(5);
});

it ("loadLevel sets the level num", () => {
    // SETUP
    let lr = new LevelRunner("Level2WithPaths");
    let origLevel = lr.level;

    // CALL
    lr.loadLevel("Level3WithPaths", false, 5);

    // ASSERT
    expect(origLevel !== lr.level).toBe(true);
    expect(lr.level.levelNum).toBe(5);
    expect(lr.levelNum).toBe(5);
});

it ("loadLevel resets the level in the gamefooter", () => {
    // SETUP
    let lr = new LevelRunner("Level2WithPaths");
    let origLevel = lr.level;

    // CALL
    lr.loadLevel("Level3WithPaths", true, 5);

    // ASSERT
    expect(origLevel !== lr.level).toBe(true);
    expect(origLevel !== lr.gameFooter.level).toBe(true);
});