import LevelFactory from "./LevelFactory";
import DataSourceBase from "./DataSourceBase";
import Location from "./Location";

class Game extends DataSourceBase {
    constructor(levelName="Level1") {
        super();

        this._score = 0;
        this._editMode = false;
        this._level = LevelFactory.createLevel(levelName);
        this._levelChangeCallback = (e) => this.levelChangeCallback(e);
        this._level.addOnChangeCallback(this._levelChangeCallback);
    }

    levelChangeCallback(e) {
        this._raiseOnChangeCallbacks("level." + e.source);
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
        this.level.editMode = value;

        if (value) {
            this.level.setSelectedLocation(new Location(0, 0));
        }

        this._setValueAndRaiseOnChange("_editMode", value);
    }

    set level(value) {
        this._setValueAndRaiseOnChange("_level", value);
    }
}

export default Game;