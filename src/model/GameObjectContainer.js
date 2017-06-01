import DataSourceBase from "./DataSourceBase";
import Player from "./actors/Player";
import Ghost from "./actors/Ghost";
import GameTimer from "./GameTimer";
import moment from "../../node_modules/moment/moment";

class GameObjectContainer extends DataSourceBase {
    constructor(level) {
        super();

        this._player = this._wireUp("_player", new Player(level, Player.MR_PAC_MAN));
        this._player2 = this._wireUp("_player2", new Player(level, Player.MRS_PAC_MAN));
        this._ghostRed = this._wireUp("_ghostRed", new Ghost(level, Ghost.RED, this._player));
        this._ghostBlue = this._wireUp("_ghostBlue", new Ghost(level, Ghost.BLUE, this._player));
        this._ghostPink = this._wireUp("_ghostPink", new Ghost(level, Ghost.PINK, this._player));
        this._ghostOrange = this._wireUp("_ghostOrange", new Ghost(level, Ghost.ORANGE, this._player));

        this._gameObjects = [
            this._player,
            this._player2,
            this._ghostRed,
            this._ghostBlue,
            this._ghostPink,
            this._ghostOrange
        ];

        this._gameTimerTickFinishedRef = (e) => this.gameTimerTickFinished(e);
        GameTimer.instance.addTickFinishedCallback(this._gameTimerTickFinishedRef);
    }

    _killIfCollision(thePlayer, theGhost, now) {
        if (thePlayer.location.equals(theGhost.location)) {
            if (thePlayer.attackModeFinishTime > now) {
                // GHOST IS DEAD SINCE PLAYER IS ATTACKING
                theGhost.isAlive = false;
                // console.log("Ghost DEAD");
            } else {
                // PLAYER IS DEAD SINCE PLAYER IS NOT ATTACKING
                thePlayer.isAlive = false;
                // console.log("Player DEAD");
            }
        }
    }

    // TODO: This fires a lot.  There may be a better way to accomplish this.
    gameTimerTickFinished(e) {
        let now = moment();

        this._killIfCollision(this.player, this.ghostRed, now);
        this._killIfCollision(this.player, this.ghostBlue, now);
        this._killIfCollision(this.player, this.ghostPink, now);
        this._killIfCollision(this.player, this.ghostOrange, now);
    }

    get player() {
        return this._player;
    }

    get player2() {
        return this._player2;
    }

    get ghostRed() {
        return this._ghostRed;
    }

    get ghostBlue() {
        return this._ghostBlue;
    }

    get ghostPink() {
        return this._ghostPink;
    }

    get ghostOrange() {
        return this._ghostOrange;
    }

    get level() {
        return this.player.level;
    }

    set level(value) {
        this.iterateOverGameObjects(function (gameObject) {
           gameObject.level = value;
        });
    }

    get editMode() {
        return this.player.editMode;
    }

    set editMode(value) {
        this.iterateOverGameObjects(function (gameObject) {
            gameObject.editMode = value;
        });
    }

    iterateOverGameObjects(theCallback) {
        this._gameObjects.forEach(function (go) {
            theCallback(go, this);
        });
    }

    moveAllBackToSpawn() {
        this.iterateOverGameObjects(function (gameObject) {
            if (typeof(gameObject.moveBackToSpawn) !== "undefined") {
                gameObject.moveBackToSpawn();
            }
        });
    }
}

export default GameObjectContainer;