import DataSourceBase from "./DataSourceBase";
import Player from "./actors/Player";
import Ghost from "./actors/Ghost";
import GameTimer from "./GameTimer";
import moment from "../../node_modules/moment/moment";
import PowerUp from "./actors/PowerUp";
import GameModal from "./GameModal";
import SoundPlayer from "../utils/SoundPlayer";
import KeyEventer from "../utils/KeyEventer";

const max_power_up_spawn_time = 90.0;
const callback_type_level_finished = 0;
const callback_type_game_over = 1;

class GameObjectContainer extends DataSourceBase {

    static get CALLBACK_TYPE_LEVEL_FINISHED() { return callback_type_level_finished; }
    static get CALLBACK_TYPE_GAME_OVER() { return callback_type_game_over; }

    constructor(level) {
        super();

        this._player = this._wireUp("_player", new Player(level, Player.MR_PAC_MAN));
        this._player2 = this._wireUp("_player2", new Player(level, Player.MRS_PAC_MAN));
        this._ghostRed = this._wireUp("_ghostRed", new Ghost(level, Ghost.RED, this._player));
        this._ghostBlue = this._wireUp("_ghostBlue", new Ghost(level, Ghost.BLUE, this._player));
        this._ghostPink = this._wireUp("_ghostPink", new Ghost(level, Ghost.PINK, this._player));
        this._ghostOrange = this._wireUp("_ghostOrange", new Ghost(level, Ghost.ORANGE, this._player));
        this._powerUp = this._wireUp("_powerUp", new PowerUp(level, PowerUp.POWER_UP_CHERRY));
        // this._countDownMenu = this._wireUp("_countDownMenu", new CountDownMenu());
        // this._modal = this._wireUp("_modal", new Modal());
        this._gameModal = this._wireUp("_gameModal", new GameModal());
        this._powerUpSpawnTime = moment().add(Math.floor(Math.random() * max_power_up_spawn_time), "s");

        this._gameObjects = [
            this._player,
            // this._player2,
            this._ghostRed,
            this._ghostBlue,
            this._ghostPink,
            this._ghostOrange,
            this._powerUp
        ];

        this._gameTimerTickFinishedRef = (e) => this.gameTimerTickFinished(e);
        GameTimer.instance.addTickFinishedCallback(this._gameTimerTickFinishedRef);

        this._keyPressRef = (e) => this._keyPress(e);
        KeyEventer.instance.addCallback(this._keyPressRef, KeyEventer.CALLBACK_KEYDOWN);

        this._currentPlayerDead = false;
        this._restartLevelRef = null;

        this._callback = null;
        this._gameOver = false;
        this._levelFirstStart = true;
        this._levelRunning = false;
    }

    static _nextKillScore = 100;
    static get nextKillScore() {
        GameObjectContainer._nextKillScore *= 2;
        return GameObjectContainer._nextKillScore;
    }

    static resetNextKillScore() {
        GameObjectContainer._nextKillScore = 100;
    }

    dispose() {
        KeyEventer.instance.removeCallback(this._keyPressRef, KeyEventer.CALLBACK_KEYDOWN);

        super.dispose();
    }

    _keyPress(key) {
        if (!this._levelRunning) {
            return;
        }

        if (key.toLowerCase() === "p") {
            if (this.paused) {
                this.paused = false;
                this._gameModal.hideModal();
            } else {
                this.paused = true;
                this._gameModal.showPausedModal();
            }
        }
    }

    _gameModalDismissCallback(e) {
        if (this.callback) {
            if (this._gameModal.mode === GameModal.MODAL_MODE_GAME_OVER) {
                this.callback({
                    callbackType: GameObjectContainer.CALLBACK_TYPE_GAME_OVER,
                    object: this
                });
            } else if (this._gameModal.mode === GameModal.MODAL_MODE_COUNTDOWN) {
                this.resetAllGhostBrains();
                this.paused = false;
                this._restartLevelRef = null;
                this._levelRunning = true;
            }
        }
    }

    _nestedDataSourceChanged(e) {

        if (e.object === this._powerUp &&
            e.source === "_isAlive" &&
            !e.newValue) {
            // console.log("_resetPowerUpSpawnTime");
            this._resetPowerUpSpawnTime();
        } else if (e.object === this._gameModal &&
                   e.source === "_visible" &&
                   !e.newValue) {
            this._gameModalDismissCallback(this._gameModal);
        }

        super._nestedDataSourceChanged(e);
    }

    startOrRestartLevel(timeout=3000) {

        this.moveAllBackToSpawnAndResetActors();
        this.gameOver = false;
        this._levelRunning = false;



        if (this.player.numLives === 0) {
            this.gameModal.showGameOverModal(this.player.score, this.level.levelNum);
        } else {
            if (!this._levelFirstStart) {
                this.gameModal.showCountDownModal();
            } else {
                this._levelFirstStart = false;
                SoundPlayer.instance.play(SoundPlayer.instance.beginning, function (id) {
                    this.gameModal.showCountDownModal();
                }.bind(this));
            }
        }
    }

    _killIfCollision(thePlayer, theGhost, now) {
        if (thePlayer.location.equals(theGhost.location)) {
            if (thePlayer.attackModeFinishTime > now && theGhost.isScared) {
                // GHOST IS DEAD SINCE PLAYER IS ATTACKING
                if (theGhost.isAlive) {
                    theGhost.kill(this.player, GameObjectContainer.nextKillScore);
                }
            } else if (theGhost.isAlive) {
                // PLAYER IS DEAD SINCE PLAYER IS NOT ATTACKING
                // OR GHOST IS NOT SCARED
                if (thePlayer.isAlive) {
                    thePlayer.isAlive = false;
                    this.player.numLives = this.player.numLives - 1;
                    this.resetAllGhostBrains();
                    this.currentPlayerDead = true;
                    this.paused = true;
                    this._levelRunning = false;

                    if (this._restartLevelRef === null) {
                        this._restartLevelRef = () => this.startOrRestartLevel();
                        let self = this;
                        setTimeout(function (e) {
                            self.startOrRestartLevel();
                        }, 3000);
                    }
                }
            }
        }
    }

    _resetPowerUpSpawnTime() {
        this._powerUpSpawnTime = moment().add(Math.floor(Math.random() * max_power_up_spawn_time), "s");
    }

    _pickUpPowerUpIfCollision(thePlayer, thePowerup) {
        if (thePlayer.location.equals(thePowerup.location)) {
            thePowerup.pickUp(thePlayer);

            this._resetPowerUpSpawnTime();
        }
    }

    _checkIfAllDotsEaten(thePlayer, theLevel) {
        if (thePlayer.dotsEaten === theLevel.numDots && !this.paused) {
        // if (thePlayer.dotsEaten >= 2 && !this.paused) {

            this.level.blinkBorder = true;
            this.resetAllGhostBrains();

            this._levelRunning = false;
            this.paused = true;


            if (this.callback) {
                setTimeout(function () {
                    this.callback({
                        callbackType: GameObjectContainer.CALLBACK_TYPE_LEVEL_FINISHED,
                        object: this
                    });
                }.bind(this), 4000);
            }
        }
    }

    gameTimerTickFinished(e) {

        if (!this.level.playerSpawnLocation.isValid || this.editMode) {
            return;
        }

        let moved = false;
        this.iterateOverGameObjects(function (gameObj) {
            let temp = gameObj.executeActorStep(e);
            if (temp) {
                moved = true;
            }
        });

        if (moved) {
            if (this.player.attackModeFinishTime <= moment()) {
                GameObjectContainer.resetNextKillScore();
            }

            let now = moment();

            this.checkAndSpawnPowerUp(now);

            this._killIfCollision(this.player, this.ghostRed, now);
            this._killIfCollision(this.player, this.ghostBlue, now);
            this._killIfCollision(this.player, this.ghostPink, now);
            this._killIfCollision(this.player, this.ghostOrange, now);

            this._pickUpPowerUpIfCollision(this.player, this.powerUp);

            this._checkIfAllDotsEaten(this.player, this.level);
        }
    }

    checkAndSpawnPowerUp(now) {
        if (this._powerUp.isAlive) {
            return;
        }

        if (now > this._powerUpSpawnTime) {
            this._powerUp.spawn(this.level);
        }
    }

    get powerUp() {
        return this._powerUp;
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
        if (value !== this.level) {
            this._levelFirstStart = true;
        }

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

    resetAllGhostBrains() {
        this.iterateOverGameObjects(function (gameObject) {
            if (gameObject instanceof Ghost) {
                gameObject.resetBrain();
            }
        });
    }

    moveAllBackToSpawnAndResetActors() {
        let self = this;

        this.iterateOverGameObjects(function (gameObject) {
            // We want to move everything except the powerup
            if (gameObject === self.powerUp) {
                return;
            }

            if (typeof(gameObject.moveBackToSpawn) !== "undefined") {
                gameObject.moveBackToSpawn();
            }

            if (typeof(gameObject.resetDirection) !== "undefined") {
                gameObject.resetDirection();
            }

            if (typeof(gameObject.resetBrain) !== "undefined") {
                gameObject.resetBrain();
            }

            if (typeof(gameObject.isAlive) !== "undefined") {
                gameObject.isAlive = true;
            }
        });
    }

    set paused(value) {
        this.iterateOverGameObjects(function (gameObject) {
            gameObject.paused = value
        });
    }

    get paused() {
        return this._gameObjects[0].paused;
    }

    get currentPlayerDead() {
        return this._currentPlayerDead;
    }

    set currentPlayerDead(value) {
        this._setValueAndRaiseOnChange("_currentPlayerDead", value);
    }

    get callback() {
        return this._callback;
    }

    set callback(value) {
        this._callback = value;
    }

    get gameOverCallback() {
        return this._gameOverCallback;
    }

    set gameOverCallback(value) {
        this._gameOverCallback = value;
    }

    get countDownMenu() {
        return this._countDownMenu;
    }

    set countDownMenu(value) {
        this._setValueAndRaiseOnChange("_countDownMenu", value);
    }

    get modal() {
        return this._modal;
    }

    set modal(value) {
        this._setValueAndRaiseOnChange("_modal", value);
    }

    get gameOver() {
        return this._gameOver;
    }

    set gameOver(value) {
        this._setValueAndRaiseOnChange("_gameOver", value);
    }

    get gameOverText() {
        return this._gameOverText;
    }

    set gameOverText(value) {
        this._setValueAndRaiseOnChange("_gameOverText", value);
    }

    get gameModal() {
        return this._gameModal;
    }
}

export default GameObjectContainer;