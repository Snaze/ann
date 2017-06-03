import Level1 from "../levels/Level1.json";
import Level1WithPaths from "../levels/Level1WithPaths.json";
import Level2WithPaths from "../levels/Level2WithPaths.json"
import Level3WithPaths from "../levels/Level3WithPaths.json";
import Level4WithPaths from "../levels/Level4WithPaths.json";
import Level5WithPaths from "../levels/Level5WithPaths.json";
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
            case "level3withpaths":
                return Level.fromJSON(Level3WithPaths);
            case "level4withpaths":
                return Level.fromJSON(Level4WithPaths);
            case "level5withpaths":
                return Level.fromJSON(Level5WithPaths);
            default:
                throw new Error("Unknown Level Name found");
        }

        // throw new Error("Unknown Level Name found");
    }
}

export default LevelFactory;