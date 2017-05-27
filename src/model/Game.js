import LevelFactory from "./LevelFactory";
import DataSourceBase from "./DataSourceBase";
import GameObjectContainer from "./GameObjectContainer";

class Game extends DataSourceBase {
    constructor(levelName="Level1") {
        super();

        this._levelName = levelName;
        this._editMode = false;
        this._level = this._wireUp("_level", LevelFactory.createLevel(levelName));
        this._gameObjectContainer = new GameObjectContainer(this._level);
    }

    get level() {
        return this._level;
    }

    get editMode() {
        return this._editMode;
    }

    set editMode(value) {
        this.level.editMode = value;
        this.gameObjectContainer.editMode = value;

        if (value) {
            this.level.getCell(0, 0).selected = true;
        }

        this._setValueAndRaiseOnChange("_editMode", value);
    }

    get levelName() {
        return this._levelName;
    }

    get gameObjectContainer() {
        return this._gameObjectContainer;
    }
}

export default Game;