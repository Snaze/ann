import DataSourceBase from "./DataSourceBase";
import MainMenu from "./menus/MainMenu";
import LevelRunner from "./LevelRunner";

const levelNumToLevelMap = {
    0: "Level2WithPaths",
    1: "Level2WithPaths",
    2: "Level2WithPaths",

    3: "Level3WithPaths",
    4: "Level3WithPaths",
    5: "Level3WithPaths",

    6: "Level4WithPaths",
    7: "Level4WithPaths",
    8: "Level4WithPaths",

    9: "Level5WithPaths",
    10: "Level5WithPaths",
    11: "Level5WithPaths",

    12: "Level6WithPaths",
    13: "Level6WithPaths",
    14: "Level6WithPaths"
};

class Game extends DataSourceBase {
    static getLevelName(levelNum) {
        let keys = Object.keys(levelNumToLevelMap);
        let keysAsNumbers = keys.map(function (item) {
            return parseInt(item, 10);
        });
        let maxValue = Math.max(...keysAsNumbers);

        let theKey = levelNum % (maxValue + 1);
        return levelNumToLevelMap[theKey];
    }

    constructor() {
        super();

        this._levelNum = 0;
        this._mainMenu = this._wireUp("_mainMenu", new MainMenu());
        this._levelRunner = this._wireUp("_levelRunner", new LevelRunner(Game.getLevelName(this._levelNum)));
        this._gameStarted = false;
        this._numPlayers = 1;
    }

    _nestedDataSourceChanged(e) {
        if (e.object === this._mainMenu) {
            if (e.source === "_selectionConfirmed" && this._mainMenu.selectionConfirmed) {
                // this._mainMenu.selectionConfirmed = false;
                this.numPlayers = this._mainMenu.numPlayers;
                this.startGame();
            }
        } else if (e.object === this._levelRunner) {
            if (e.source === "_levelFinished" &&
                this.levelRunner.levelFinished) {
                this._levelNum++;

                let levelName = Game.getLevelName(this._levelNum);
                this._levelRunner.startLevel(levelName, true, this._levelNum + 1);
            } else if (e.source === "_gameOver" &&
                this.levelRunner.gameOver) {
                this._levelNum = 0;

                this.gameStarted = false;
                this.mainMenu.selectionConfirmed = false;
                // this.levelRunner.gameOver = false;
            }
        }

        super._nestedDataSourceChanged(e);
    }

    startGame() {
        this._setValueAndRaiseOnChange("_gameStarted", true);

        let levelName = Game.getLevelName(this._levelNum);
        this._levelRunner.startLevel(levelName, true, this._levelNum + 1);
    }

    get level() {
        return this._levelRunner.level;
    }

    get levelNum() {
        return this._levelNum;
    }

    set levelNum(value) {
        this._setValueAndRaiseOnChange("_levelNum", value);
    }

    get numPlayers() {
        return this._numPlayers;
    }

    set numPlayers(value) {
        this._setValueAndRaiseOnChange("_numPlayers", value);
    }

    get gameStarted() {
        return this._gameStarted;
    }

    set gameStarted(value) {
        this._setValueAndRaiseOnChange("_gameStarted", value);
    }

    get editMode() {
        return this._levelRunner.editMode;
    }

    set editMode(value) {
        this._levelRunner.editMode = value;
    }

    get levelRunner() {
        return this._levelRunner;
    }

    get mainMenu() {
        return this._mainMenu;
    }
}

export default Game;