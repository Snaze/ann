import DataSourceBase from "./DataSourceBase";
import Player from "./actors/Player";
import Ghost from "./actors/Ghost";
import GameTimer from "./GameTimer";
import moment from "../../node_modules/moment/moment";
import PowerUp from "./actors/PowerUp";

const max_power_up_spawn_time = 90.0;

class GameObjectContainer extends DataSourceBase {
    constructor(level) {
        super();

        this._player = this._wireUp("_player", new Player(level, Player.MR_PAC_MAN));
        this._player2 = this._wireUp("_player2", new Player(level, Player.MRS_PAC_MAN));
        this._ghostRed = this._wireUp("_ghostRed", new Ghost(level, Ghost.RED, this._player));
        this._ghostBlue = this._wireUp("_ghostBlue", new Ghost(level, Ghost.BLUE, this._player));
        this._ghostPink = this._wireUp("_ghostPink", new Ghost(level, Ghost.PINK, this._player));
        this._ghostOrange = this._wireUp("_ghostOrange", new Ghost(level, Ghost.ORANGE, this._player));
        this._powerUp = this._wireUp("_powerUp", new PowerUp(level, PowerUp.POWER_UP_CHERRY));
        this._powerUpActive = false;
        this._powerUpSpawnTime = moment().add(Math.floor(Math.random() * max_power_up_spawn_time), "s");
        // YOU ARE HERE, WIRING UP THE POWER UP

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

        this._currentPlayerDead = false;
        this._restartLevelRef = null;
    }

    static _nextKillScore = 100;
    static get nextKillScore() {
        GameObjectContainer._nextKillScore *= 2;
        return GameObjectContainer._nextKillScore;
    }

    static resetNextKillScore() {
        GameObjectContainer._nextKillScore = 100;
    }

    restartLevel(timeout=3000) {
        this.moveAllBackToSpawn();

        if (!this.player.isAlive) {
            this.player.isAlive = true;
            this.player.numLives = this.player.numLives - 1;
        }

        if (this.player.numLives === 0) {
            alert ('Game Over');
        } else {
            let self = this;
            setTimeout(function (e) {
                self.paused = false;
                self._restartLevelRef = null;
            }, timeout);
        }
    }

    _killIfCollision(thePlayer, theGhost, now) {
        if (thePlayer.location.equals(theGhost.location)) {
            if (thePlayer.attackModeFinishTime > now) {
                // GHOST IS DEAD SINCE PLAYER IS ATTACKING
                if (theGhost.isAlive) {
                    theGhost.isAlive = false;
                    theGhost.killScore = GameObjectContainer.nextKillScore;
                    theGhost.points.show(theGhost.location);
                    thePlayer.score += theGhost.killScore;
                }
                // console.log("Ghost DEAD");
            } else {
                // PLAYER IS DEAD SINCE PLAYER IS NOT ATTACKING
                if (thePlayer.isAlive) {
                    thePlayer.isAlive = false;
                    this.paused = true;
                    this.currentPlayerDead = true;

                    if (this._restartLevelRef === null) {
                        this._restartLevelRef = () => this.restartLevel();
                        let self = this;
                        setTimeout(function (e) {
                            self.restartLevel();
                        }, 3000);
                    }
                }
            }
        }
    }

    _pickUpPowerUpIfCollision(thePlayer, thePowerup) {
        if (thePlayer.location.equals(thePowerup.location)) {
            thePowerup.points.show(thePowerup.location);
            thePlayer.score += thePowerup.powerUpValue;
            thePowerup.isAlive = false;
            this._powerUpActive = false;
            this._powerUpSpawnTime = moment().add(Math.floor(Math.random() * max_power_up_spawn_time), "s");
            thePowerup.moveBackToSpawn();
        }
    }

    // TODO: This fires a lot.  There may be a better way to accomplish this.
    gameTimerTickFinished(e) {

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
        }
    }

    checkAndSpawnPowerUp(now) {
        if (this._powerUpActive) {
            return;
        }

        if (now > this._powerUpSpawnTime) {
            this._powerUp.isAlive = true;
            this._powerUp.location.setWithLocation(this.level.getRandomPowerUpSpawnLocation());
            this._powerUpActive = true;
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
        });
    }

    set paused(value) {
        this.iterateOverGameObjects(function (gameObject) {
            gameObject.paused = value
        });
    }


    get currentPlayerDead() {
        return this._currentPlayerDead;
    }

    set currentPlayerDead(value) {
        this._setValueAndRaiseOnChange("_currentPlayerDead", value);
    }
}

export default GameObjectContainer;