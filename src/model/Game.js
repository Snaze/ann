import LevelFactory from "./LevelFactory";
import DataSourceBase from "./DataSourceBase";

class Game extends DataSourceBase {
    constructor(levelName="Level1") {
        super();

        this._score = 0;
        this._editMode = false;
        this._level = LevelFactory.createLevel(levelName);
    }

    get level() {
        return this._level;
    }

    get score() {
        return this._score;
    }

    get editMode() {
        return this._editMode;
    }

    set score(value) {
        this._setValueAndRaiseOnChange("_score", value);
    }

    set editMode(value) {
        this._setValueAndRaiseOnChange("_editMode", value);
    }

    set level(value) {
        this._setValueAndRaiseOnChange("_level", value);
    }
}

export default Game;