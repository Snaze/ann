import DataSourceBase from "./DataSourceBase";
import GameObjectContainer from "./GameObjectContainer";
import GameHeader from "./GameHeader";
import GameFooter from "./GameFooter";
import LevelFactory from "./LevelFactory";

class LevelRunner extends DataSourceBase {
    constructor(levelName) {
        super();

        this._editMode = false;
        this._levelName = levelName;
        this._level = this._wireUp("_level", LevelFactory.createLevel(levelName));
        this._gameObjectContainer = new GameObjectContainer(this._level);
        this._gameObjectContainer.paused = true;
        this._editPanelEnabled = false;

        this._gameHeader = new GameHeader(this._gameObjectContainer.player,
            this._gameObjectContainer.player2);

        this._gameFooter = new GameFooter(this._gameObjectContainer.player,
            this._gameObjectContainer.player2,
            this._level, GameFooter.ACTIVE_PLAYER_1);

        this._levelFinished = false;
        this._levelFinishedCallbackRef = (e) => this.levelFinishedCallback(e);
        this._gameObjectContainer.levelFinishedCallback = this._levelFinishedCallbackRef;
        this._levelNum = 1;
    }

    levelFinishedCallback(e) {
        this.levelFinished = true;
    }

    startLevel(levelName, forceReload=false, levelNum=1) {

        this.loadLevel(levelName, forceReload, levelNum);

        this.levelFinished = false;
        this._gameObjectContainer.startOrRestartLevel();
    }

    loadLevel(levelName, forceReload, levelNum) {
        this._levelNum = levelNum;

        if ((this._levelName !== levelName) || forceReload) {
            this._levelName = levelName;
            this._unWire(this._level);

            let oldLevel = this._level;
            let newLevel = this._wireUp("_level", LevelFactory.createLevel(levelName));
            newLevel.levelNum = levelNum;
            this._gameObjectContainer.level = newLevel;
            this._gameFooter.level = newLevel;
            this._level = newLevel;
            oldLevel.dispose();
            oldLevel = null;

        }
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

    get gameObjectContainer() {
        return this._gameObjectContainer;
    }

    get gameHeader() {
        return this._gameHeader;
    }

    reloadLevel() {
        this.loadLevel(this._levelName, true, this._levelNum);
    }

    get levelFinished() {
        return this._levelFinished;
    }

    set levelFinished(value) {
        this._setValueAndRaiseOnChange("_levelFinished", value);
    }

    get levelNum() {
        return this._levelNum;
    }
}

export default LevelRunner;