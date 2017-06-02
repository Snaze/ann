import LevelFactory from "./LevelFactory";
import DataSourceBase from "./DataSourceBase";
import GameObjectContainer from "./GameObjectContainer";
import GameHeader from "./GameHeader";
import GameFooter from "./GameFooter";

class Game extends DataSourceBase {
    constructor(levelName="Level1") {
        super();

        this._levelName = levelName;
        this._editMode = false;
        this._level = this._wireUp("_level", LevelFactory.createLevel(levelName));
        this._gameObjectContainer = new GameObjectContainer(this._level);
        this._gameObjectContainer.paused = true;
        this._editPanelEnabled = true;
        this._gameHeader = new GameHeader(this._gameObjectContainer.player, null);
        this._gameFooter = new GameFooter(this._gameObjectContainer.player,
                                          this._gameObjectContainer.player2,
                                          this._level, GameFooter.ACTIVE_PLAYER_1);
        this._gameObjectContainer.restartLevel();
    }

    get editPanelEnabled() {
        return this._editPanelEnabled;
    }

    get gameFooter() {
        return this._gameFooter;
    }

    set editPanelEnabled(value) {
        this._setValueAndRaiseOnChange("_editPanelEnabled", value);
    }

    get level() {
        return this._level;
    }

    set level(value) {
        if (this._level !== null) {
            this._unWireForDestruction(this._level);
            this._level = null;
        }

        let toSet = this._wireUp("_level", value);
        this._gameObjectContainer.level = toSet;
        this._setValueAndRaiseOnChange("_level", toSet);
    }

    get editMode() {
        return this._editMode;
    }

    set editMode(value) {
        if (value) {
            this.reloadLevel();
            this.level.getCell(0, 0).selected = true;
        }

        this.level.editMode = value;
        this.gameObjectContainer.editMode = value;
        this._setValueAndRaiseOnChange("_editMode", value);
    }

    get levelName() {
        return this._levelName;
    }

    get gameObjectContainer() {
        return this._gameObjectContainer;
    }

    reloadLevel() {
        this.level = LevelFactory.createLevel(this._levelName);
    }

    get gameHeader() {
        return this._gameHeader;
    }
}

export default Game;