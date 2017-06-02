import Level1 from "../levels/Level1.json";
import Level1WithPaths from "../levels/Level1WithPaths.json";
import Level2WithPaths from "../levels/Level2WithPaths.json"
import Level from "./Level";


class LevelFactory {
    static createLevel (levelName) {
        levelName = levelName.toLowerCase();

        switch (levelName) {
            case "level1":
                return Level.fromJSON(Level1);
            case "level1withpaths":
                return Level.fromJSON(Level1WithPaths);
            case "level2withpaths":
                return Level.fromJSON(Level2WithPaths);
            default:
                throw new Error("Unknown Level Name found");
        }

        // throw new Error("Unknown Level Name found");
    }
}

export default LevelFactory;