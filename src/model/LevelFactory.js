import Level from "./Level";
import _ from "../../node_modules/lodash/lodash";

class LevelFactory {
    static getLevel(levelName) {


        if (!window || !window.react_pac_man || !window.react_pac_man[levelName]) {
            return new Level().toJSON();
        }

        return window.react_pac_man[levelName];
    }

    static createLevel (levelName) {
        levelName = levelName.toLowerCase();
        levelName = _.replace(levelName, "withpaths", "");

        switch (levelName) {
            case "level1":
                throw new Error("this level is not longer supported");
            case "level2":
            case "level3":
            case "level4":
            case "level5":
            case "level6":
                return Level.fromJSON(LevelFactory.getLevel(levelName));
            default:
                throw new Error("Unknown Level Name found");
        }

        // throw new Error("Unknown Level Name found");
    }
}

export default LevelFactory;