import LevelFactory from "./LevelFactory";
import DataSourceBase from "./DataSourceBase";
import MainMenu from "./menus/MainMenu";
import LevelRunner from "./LevelRunner";

const levelNumToLevelMap = {
    0: "Level2WithPaths",
    1: "Level2WithPaths",

    2: "Level3WithPaths",
    3: "Level3WithPaths",
    4: "Level3WithPaths",

    5: "Level4WithPaths",
    6: "Level4WithPaths",
    7: "Level4WithPaths",
    8: "Level4WithPaths",

    9: "Level5WithPaths",
    10: "Level5WithPaths",
    11: "Level5WithPaths",
    12: "Level5WithPaths",
    13: "Level5WithPaths"
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
                this._mainMenu.selectionConfirmed = false;
                this.numPlayers = this._mainMenu.numPlayers;

            }
        }

        super._nestedDataSourceChanged(e);
    }

    startGame() {
        this._gameStarted = true;
        let levelName = Game.getLevelName(this._levelNum);


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
}

export default Game;