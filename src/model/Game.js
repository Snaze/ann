import LevelFactory from "./LevelFactory";
import Player from "./Player";
import Ghost from "./Ghost";
import Direction from "../utils/Direction";
import Location from "./Location";
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
}

export default Game;