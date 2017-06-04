import LevelRunner from "./LevelRunner";

it ("LevelRunner constructor works", () => {
    new LevelRunner("Level2WithPaths");
});

it ("DataSourceBase dispose works", () => {
    let lr = new LevelRunner("Level2WithPaths");
    lr.dispose();
    lr = null;
});