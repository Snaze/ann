import Level1 from "../levels/Level1.json";
import Level from "./Level";


class LevelFactory {
    static createLevel (levelName) {
        levelName = levelName.toLowerCase();

        switch (levelName) {
            case "level1":
                return Level.fromJSON(Level1);
            default:
                throw new Error("Unknown Level Name found");
        }

        // throw new Error("Unknown Level Name found");
    }
}

export default LevelFactory;