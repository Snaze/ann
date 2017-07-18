import DataSourceBase from "./DataSourceBase";
import Player from "./actors/Player";
import Ghost from "./actors/Ghost";
import GameTimer from "./GameTimer";
import moment from "../../node_modules/moment/moment";
import PowerUp from "./actors/PowerUp";
import GameModal from "./GameModal";
import SoundPlayer from "../utils/SoundPlayer";
import KeyEventer from "../utils/KeyEventer";
import GameMode from "./GameMode";
import DeepQLearner from "./ai/dqn/DeepQLearner";
import SimpleStateConverter from "./ai/SimpleStateConverter";
import StateConverter from "./ai/StateConverter";
import BinaryMatrix from "./utils/BinaryMatrix";
import Direction from "../utils/Direction";

const max_power_up_spawn_time = 90.0;
const callback_type_level_finished = 0;
const callback_type_game_over = 1;
const toBinaryIndices = {
    littleDot: 4,
    bigDot: 3,
    ghost: 2,
    player: 1,
    powerUp: 0,
    directionHeader: 0
};

class GameObjectContainer extends DataSourceBase {

    static get CALLBACK_TYPE_LEVEL_FINISHED() { return callback_type_level_finished; }
    static get CALLBACK_TYPE_GAME_OVER() { return callback_type_game_over; }

    constructor(level) {
        super();

        this._player = this._wireUp("_player", new Player(level, Player.MRS_PAC_MAN));
        this._player2 = this._wireUp("_player2", new Player(level, Player.MR_PAC_MAN));
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
        this._timerWired = false;

        // This is used to create the feature vector to feed the Deep Q Learner
        this._simpleStateConverter = new SimpleStateConverter();

        // This is used to save / restore state between learning.  Mainly this is because of you are storing
        // static times in the entities.  You should really just store ms or s remaining.
        // TODO: Fix times issue.
        this._stateConverter = new StateConverter();
        this._previousState = null;
        this._deepQLearner = null;
        this._deepQLearnerCallbackRef = (deepQLearner, actionNum) => this._deepQLearnerCallback(deepQLearner, actionNum);
        this._playerActionNum = 0;

        this._keyPressRef = (e) => this._keyPress(e);
        KeyEventer.instance.addCallback(this._keyPressRef, KeyEventer.CALLBACK_KEYDOWN);

        this._currentPlayerDead = false;
        this._restartLevelRef = null;

        this._callback = null;
        this._gameOver = false;
        this._levelFirstStart = true;
        this._levelRunning = false;
        // this._binaryMatrix = null;
        this._graph = null;
        this._gameMode = GameMode.PLAY;

        this.toIgnore.push("_state");
    }

    static _nextKillScore = 100;
    static get nextKillScore() {
        GameObjectContainer._nextKillScore *= 2;
        return GameObjectContainer._nextKillScore;
    }

    static resetNextKillScore() {
        GameObjectContainer._nextKillScore = 100;
    }

    static peekNextKillScore() {
        return GameObjectContainer._nextKillScore;
    }

    dispose() {
        KeyEventer.instance.removeCallback(this._keyPressRef, KeyEventer.CALLBACK_KEYDOWN);

        super.dispose();
    }

    _wireGameTimer() {
        if (!this._timerWired) {
            this._timerWired = true;
            GameTimer.instance.addTickFinishedCallback(this._gameTimerTickFinishedRef);
        }
    }

    _wireQLearner() {
        if (!this._timerWired) {
            this._timerWired = true;
            let initialState = this._simpleStateConverter.toFeatureVector(this);
            // this._previousState = this._stateConverter.toFeatureVector(this);
            this.deepQLearner.learn(this._deepQLearnerCallbackRef, initialState);
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

    _gameModalDismissCallback() {
        if (this.callback) {
            if (this._gameModal.mode === GameModal.MODAL_MODE_GAME_OVER) {
                this.callback({
                    callbackType: GameObjectContainer.CALLBACK_TYPE_GAME_OVER,
                    object: this
                });
            } else if (this._gameModal.mode === GameModal.MODAL_MODE_COUNTDOWN) {
                this._runLevel();
            }
        }
    }

    _runLevel() {
        this.resetAllGhostBrains();
        this.paused = false;
        this._restartLevelRef = null;
        this._levelRunning = true;
    }

    _killIfCollision(thePlayer, theGhost, now) {

        if (thePlayer.isCollision(theGhost)) {
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
                    thePlayer.numLives -= 1;
                    // thePlayer.resetReward();

                    this.resetAllGhostBrains();
                    this.currentPlayerDead = true;
                    this.paused = true;
                    this._levelRunning = false;

                    if (this._restartLevelRef === null) {
                        this._restartLevelRef = () => this.startOrRestartLevel();
                        let self = this;
                        if (this._gameMode !== GameMode.TRAIN) {
                            setTimeout(function () {
                                self.startOrRestartLevel();
                            }, 3000);
                        }
                    }
                }
            }
        }
    }

    _resetPowerUpSpawnTime() {
        this._powerUpSpawnTime = moment().add(Math.floor(Math.random() * max_power_up_spawn_time), "s");
    }

    _pickUpPowerUpIfCollision(thePlayer, thePowerup) {
        if (thePlayer.isCollision(thePowerup)) {
            thePowerup.pickUp(thePlayer);

            this._resetPowerUpSpawnTime();
        }
    }

    _checkIfAllDotsEaten(thePlayer, theLevel) {
        let levelFinished = false;

        if (thePlayer.dotsEaten === theLevel.numDots && !this.paused) {
        // if (thePlayer.dotsEaten >= 2 && !this.paused) {

            levelFinished = true;

            if (this._gameMode !== GameMode.TRAIN) {
                this.level.blinkBorder = true;
                this.resetAllGhostBrains();

                this._levelRunning = false;
                this.paused = true;

                if (!!this.callback) {
                    setTimeout(function () {
                        this.callback({
                            callbackType: GameObjectContainer.CALLBACK_TYPE_LEVEL_FINISHED,
                            object: this
                        });
                    }.bind(this), 4000);
                }
            }
        }

        return levelFinished;
    }

    startOrRestartLevel() {

        this.moveAllBackToSpawnAndResetActors();
        this.gameOver = false;
        this._levelRunning = false;

        if (this._gameMode === GameMode.PLAY) {
            if (this.player.numLives === 0) {
                this.gameModal.showGameOverModal(this.player.score, this.level.levelNum);
            } else {
                this._wireGameTimer();

                let count = 3;
                if (!this._levelFirstStart) {
                    this.gameModal.showCountDownModal(count);
                } else {
                    this._levelFirstStart = false;
                    SoundPlayer.instance.play(SoundPlayer.instance.beginning, function () {
                        this.gameModal.showCountDownModal(count);
                    }.bind(this));
                }
            }
        } else if (this._gameMode === GameMode.TRAIN) {
            this._player.learnMode = true;
            this._player.resetNumLives();
            this._runLevel();
            this._wireQLearner();
        }
    }

    _deepQLearnerCallback(deepQLearner, actionNum) {
        // FIRST, restore previous state because Deep Q Learner may be slow.
        // this._stateConverter.setFeatureVector(this, this._previousState);

        // NEXT, store the action for the player to perform.
        // console.log(`actionNum = ${actionNum}`);
        this.playerActionNum = actionNum;

        // NEXT, execute the game step.
        let levelFinished = this.gameTimerTickFinished();
        let isTerminal = false;

        // If the player is killed restart the level.
        if (!this.player.isAlive) {
            this.startOrRestartLevel();
            isTerminal = true;
        }

        // If the level is finish, fire the event to load the next level.
        if (levelFinished && !!this.callback) {
            this.callback({
                callbackType: GameObjectContainer.CALLBACK_TYPE_LEVEL_FINISHED,
                object: this
            });

            isTerminal = true;
            this._runLevel();
        }

        // save new state
        // this._previousState = this._stateConverter.toFeatureVector(this);

        return {
            reward: this.player.scoreDelta,
            state: this._simpleStateConverter.toFeatureVector(this),
            isTerminal: isTerminal
        };
    }

    gameTimerTickFinished() {

        let levelFinished = false;

        if (!this.level.playerSpawnLocation.isValid || this.editMode) {
            return;
        }

        let moved = false;

        this.iterateOverGameObjects(function (gameObj) {
            let temp = gameObj.executeActorStep(this);
            if (temp) {
                moved = true;
            }
        }.bind(this));

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

            levelFinished = this._checkIfAllDotsEaten(this.player, this.level);
        }

        return levelFinished;
    }

    checkAndSpawnPowerUp(now) {
        if (this._powerUp.isAlive) {
            return;
        }

        if (now > this._powerUpSpawnTime) {
            this._powerUp.spawn(this.level);
        }
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

    _updateBinaryMatrix() {
        let directionBinary = Direction.toBinary(this.player.direction);
        this._binaryMatrix.setBinaryHeaderValue(toBinaryIndices.directionHeader, directionBinary);

        this._binaryMatrix.setBinaryValueAtLocation("player", this.player.location, toBinaryIndices.player, "1");

        // If the player is at a current location, then he must have already eaten the dot.
        this._binaryMatrix.setBinaryValueAtLocation(null, this.player.location, toBinaryIndices.bigDot, "0");
        this._binaryMatrix.setBinaryValueAtLocation(null, this.player.location, toBinaryIndices.littleDot, "0");

        this._binaryMatrix.setBinaryValueAtLocation("ghostRed", this.ghostRed.location, toBinaryIndices.ghost, "1");
        this._binaryMatrix.setBinaryValueAtLocation("ghostBlue", this.ghostBlue.location, toBinaryIndices.ghost, "1");
        this._binaryMatrix.setBinaryValueAtLocation("ghostOrange", this.ghostOrange.location, toBinaryIndices.ghost, "1");
        this._binaryMatrix.setBinaryValueAtLocation("ghostPink", this.ghostPink.location, toBinaryIndices.ghost, "1");

        this._binaryMatrix.setBinaryValueAtLocation("powerUp", this.powerUp.location, toBinaryIndices.powerUp, "1");
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
            this._graph = null;
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

    get gameMode() {
        return this._gameMode;
    }

    set gameMode(value) {
        this._gameMode = value;
    }

    get playerActionNum() {
        return this._playerActionNum;
    }

    set playerActionNum(value) {
        this._playerActionNum = value;
    }

    get binaryMatrix() {

        if (null === this._binaryMatrix) {
            let theMatrix = this.level.toBinary();
            this._binaryMatrix = new BinaryMatrix(theMatrix, 1);
        }

        this._updateBinaryMatrix();

        return this._binaryMatrix;
    }

    get graph() {
        if (this._graph === null) {
            this._graph = this.level.toGraph();
        }

        return this._graph;
    }

    get deepQLearner() {
        if (this._deepQLearner === null) {
            let temp = this._simpleStateConverter.toFeatureVector(this);
            let rar = 0.98;
            let finalRar = 0.001;
            let maxEpochs = 1600;
            let radr = Math.pow((finalRar / rar), 1 / maxEpochs);

            this._deepQLearner = new DeepQLearner(temp.length, 4, 0.03, 0.9, rar, radr, true, maxEpochs,
                1, maxEpochs, 1000000, 4, 32, 100);
        }

        return this._deepQLearner;
    }

    static _trainingFeatureIndices = null;
    static get trainingFeatureIndices() {
        if (GameObjectContainer._trainingFeatureIndices === null) {
            GameObjectContainer._trainingFeatureIndices = [
                2,  // ghostRed distance
                3,  // ghostBlue distance
                4,  // ghostPink distance
                5,  // ghostOrange distance
                6   // powerUp Distance
            ];
        }

        return GameObjectContainer._trainingFeatureIndices;
    }

    static get featureVectorLength() {
        return 7;
    }

    toFeatureVector() {
        let toRet = [];
        // _powerUpSpawnTime
        // GameObjectContainer._nextKillScore

        let powerUpSpawnTime = 0;
        if (this._powerUpSpawnTime > moment()) {
            powerUpSpawnTime = this._powerUpSpawnTime.diff(moment(), "ms");
        }

        toRet[0] = powerUpSpawnTime;
        toRet[1] = GameObjectContainer._nextKillScore;
        toRet[2] = this.level.floydWarshall.getPathDistance(this.player.location.toCellId(),
            this.ghostRed.location.toCellId());
        toRet[3] = this.level.floydWarshall.getPathDistance(this.player.location.toCellId(),
            this.ghostBlue.location.toCellId());
        toRet[4] = this.level.floydWarshall.getPathDistance(this.player.location.toCellId(),
            this.ghostPink.location.toCellId());
        toRet[5] = this.level.floydWarshall.getPathDistance(this.player.location.toCellId(),
            this.ghostOrange.location.toCellId());
        toRet[6] = this.level.floydWarshall.getPathDistance(this.player.location.toCellId(),
            this.powerUp.location.toCellId());

        if (Number.isNaN(toRet[2])) {
            toRet[2] = -1;
        }
        if (Number.isNaN(toRet[3])) {
            toRet[3] = -1;
        }
        if (Number.isNaN(toRet[4])) {
            toRet[4] = -1;
        }
        if (Number.isNaN(toRet[5])) {
            toRet[5] = -1;
        }
        if (Number.isNaN(toRet[6])) {
            toRet[6] = -1;
        }

        return toRet;
    }

    setFeatureVector(featureVector) {
        this._powerUpSpawnTime = moment().add(featureVector[0], "ms");
        GameObjectContainer._nextKillScore = featureVector[1];
        // The rest should always be static for a give level.
    }
}

export default GameObjectContainer;