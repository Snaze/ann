import Direction from "../../utils/Direction";
import KeyEventer from "../../utils/KeyEventer";
import ActorBase from "./ActorBase";
import _ from "../../../node_modules/lodash/lodash";
import Dot from "../Dot";
import moment from "../../../node_modules/moment/moment";
import EasingFunctions from "../../utils/EasingFunctions";
import SoundPlayer from "../../utils/SoundPlayer";
import PlayerAgent from "./PlayerBrains/PlayerAgent";

const mr_pac_man = 0;
const mrs_pac_man = 1;
const valid_gender = [mr_pac_man, mrs_pac_man];
const min_cell_duration = 0.1;
const max_cell_duration = 0.175;
const min_attack_duration = 0.0; // seconds
const max_attack_duration = 8.0; // seconds
const new_life_increment = 10000;

class Player extends ActorBase {

    static get MR_PAC_MAN() { return mr_pac_man; }
    static get MRS_PAC_MAN() { return mrs_pac_man; }
    static get MAX_CELL_DURATION() { return max_cell_duration; }
    static get MIN_CELL_DURATION() { return min_cell_duration; }
    static get MAX_ATTACK_DURATION() { return max_attack_duration; }
    static get MIN_ATTACK_DURATION() { return min_attack_duration; }

    static genderIsValid(theGender) {
        return valid_gender.indexOf(theGender) > -1;
    }

    static _nextAttackModeId = 1;
    static sirenSoundId = null;

    constructor(level, gender) {
        super(level);

        if (!Player.genderIsValid(gender)) {
            throw new Error ("Invalid gender");
        }

        this._gender = gender;

        this.location.setWithLocation(level.playerSpawnLocation);
        this._spawnLocation = level.playerSpawnLocation.clone();
        this._score = 0;
        this._dotsEaten = 0;
        this._attackModeId = Player._nextAttackModeId++;
        this._attackModeFinishTime = moment();
        this._prevLocation = this.location.clone();
        this._numLives = 3;
        this._originalNumLives = this._numLives;
        this._aiMode = false;
        this._scoreDelta = -1;
        this._agent = null;

        this._cellTransitionDuration = Player.getCellTransitionDuration(this.level); // seconds
    }

    static getCellTransitionDuration(level) {
        let levelNumberAsRange = level.getLevelNumAsTimeRange();
        levelNumberAsRange = Math.abs(1.0 - levelNumberAsRange);
        return EasingFunctions.doCalculation(EasingFunctions.easeOutCubic, levelNumberAsRange,
                                             min_cell_duration, max_cell_duration);
    }

    static getAttackDuration(level) {
        let levelNumberAsRange = level.getLevelNumAsTimeRange();
        levelNumberAsRange = Math.abs(1.0 - levelNumberAsRange);
        return EasingFunctions.doCalculation(EasingFunctions.easeOutCubic, levelNumberAsRange,
            min_attack_duration, max_attack_duration);
    }

    resetLocations() {
        this.location.setWithLocation(this.level.playerSpawnLocation);
        this._spawnLocation.setWithLocation(this.location);
        this._prevLocation.setWithLocation(this.location);
    }

    _nestedDataSourceChanged(e) {

        if (_.startsWith(e.source, "_playerSpawnLocation")) {
            this._spawnLocation.setWithLocation(this.level.playerSpawnLocation);
            if (this.editMode) {
                this.location.setWithLocation(this._spawnLocation);
            }
        }

        super._nestedDataSourceChanged(e);
    }

    handleLocationChanged(theLocation) {

        if (!theLocation.isValid) {
            return;
        }

        let cell = this.level.getCellByLocation(theLocation);

        if (cell === null) {
            this.location.set(-1, -1);
            return;
        }

        if (cell.dotType === Dot.LITTLE) {
            this.score = this.score + 10;
            cell.dotType = Dot.NONE;
            this._setValueAndRaiseOnChange("_dotsEaten", this._dotsEaten + 1);
            SoundPlayer.instance.play(SoundPlayer.instance.chompSmall);
        } else if (cell.dotType === Dot.BIG) {
            this._eatBigDot(cell);
            // SoundPlayer.instance.chomp.stop();
            SoundPlayer.instance.play(SoundPlayer.instance.chompBig);
        }
    }

    _eatBigDot(cell) {
        this.score = this.score + 50;
        cell.dotType = Dot.NONE;

        // This use to be here but ghosts wouldn't turn blue again
        // when you picked up a new power pellet.
        // if (moment() >= this._attackModeFinishTime) {
        this._attackModeId = Player._nextAttackModeId++;
        // }

        let attackDuration = Player.getAttackDuration(this.level);
        let attackFinishTime = moment().add(attackDuration, "s");
        this._setValueAndRaiseOnChange("_attackModeFinishTime", attackFinishTime);
        this._setValueAndRaiseOnChange("_dotsEaten", this._dotsEaten + 1);
        if (Player.sirenSoundId === null) {
            Player.sirenSoundId = SoundPlayer.instance.play(SoundPlayer.instance.siren, null, "main");
        }
    }

    executeActorStep(e) {
        let toRet = super.executeActorStep(e);

        if (moment() >= this._attackModeFinishTime &&
            Player.sirenSoundId !== null) {
            let tempId = Player.sirenSoundId;
            Player.sirenSoundId = null;

            SoundPlayer.instance.siren.stop(tempId);
        }

        this.resetAnimating();

        return toRet;
    }

    timerTick(e) {

        if (this.aiMode) {
            this.aiTick(e);
        } else {
            this.humanTick(e);
        }

        this.resetAnimating(true);
    }

    aiTick(e) {
        let agent = this.getAgent(e.numMatrix.length);
        let decimalDirection = agent.act(e.numMatrix);
        let newDirection = Direction.decimalToDirection(decimalDirection);

        this.prevLocation.setWithLocation(this.location);
        this.attemptToMoveInDirection(newDirection);

        this.handleLocationChanged(this.location);

        // agent.learn(this._scoreDelta);
    }

    learn() {
        if (!this.aiMode) {
            return;
        }

        this.getAgent().learn(this._scoreDelta);
        if (this._scoreDelta !== -1 && typeof(console) !== "undefined") {
            console.log("Learned with score = " + this._scoreDelta);
        }

        this._scoreDelta = -1;
    }

    humanTick(e) {
        if (!this.location.isValid) {
            return;
        }

        let newDirection = this.direction;

        if (KeyEventer.instance.lastArrowPressed !== null) {
            if (KeyEventer.instance.lastArrowPressed === Direction.UP) {
                newDirection = Direction.UP;
            } else if (KeyEventer.instance.lastArrowPressed === Direction.DOWN) {
                newDirection = Direction.DOWN;
            } else if (KeyEventer.instance.lastArrowPressed === Direction.LEFT) {
                newDirection = Direction.LEFT;
            } else if (KeyEventer.instance.lastArrowPressed === Direction.RIGHT) {
                newDirection = Direction.RIGHT;
            }
        }

        this.prevLocation.setWithLocation(this.location);
        this.attemptToMoveInDirection(newDirection);

        setTimeout((e) => this.handleLocationChanged(this.location.clone()),
            ((this._cellTransitionDuration * 1000.0) / 2.0));

    }

    attemptToMoveInDirection(direction) {
        let prevX = this.location.x;
        let prevY = this.location.y;

        this.moveInDirection(direction);
        if (this.location.isEqualTo(prevX, prevY)) {
            this.moveInDirection(this._direction);
        }
    }

    get gender() {
        return this._gender;
    }

    set gender(value) {
        this._setValueAndRaiseOnChange("_gender", value);
    }

    get score() {
        return this._score;
    }

    set score(value) {
        this._scoreDelta = value - this.score;

        let origValue = Math.floor(this.score / new_life_increment);
        let newValue = Math.floor(value / new_life_increment);

        if (newValue > origValue) {
            this.numLives = this.numLives + 1;
            SoundPlayer.instance.play(SoundPlayer.instance.extrapac);
        }

        this._setValueAndRaiseOnChange("_score", value);
    }

    get attackModeFinishTime() {
        return this._attackModeFinishTime;
    }

    get dotsEaten() {
        return this._dotsEaten;
    }

    get numLives() {
        if (this.aiMode) {
            return 3;
        }

        return this._numLives;
    }

    set numLives(value) {
        if (!this.aiMode) {
            this._setValueAndRaiseOnChange("_numLives", value);
        }
    }

    get attackModeId() {
        return this._attackModeId;
    }

    get isAlive() {
        return super.isAlive;
    }

    set isAlive(value) {
        this._attackModeFinishTime = moment().add(-1, "s");

        if (this._isAlive && !value) {
            SoundPlayer.instance.play(SoundPlayer.instance.death);
            this._scoreDelta = -10000;
        }

        super.isAlive = value;
    }

    get level() {
        return this._level;
    }

    set level(value) {
        this._dotsEaten = 0;
        this._cellTransitionDuration = Player.getCellTransitionDuration(value);
        this._attackModeFinishTime = moment().add(-1, "s");

        super.level = value;
    }

    resetNumLives() {
        this.numLives = this._originalNumLives;
    }

    get prevLocation() {
        return this._prevLocation;
    }

    get animating() {
        return this._animating;
    }

    set animating(value) {
        this._setValueAndRaiseOnChange("_animating", value);
    }

    get aiMode() {
        return this._aiMode;
    }

    set aiMode(value) {
        this._setValueAndRaiseOnChange("_aiMode", value);
    }

    resetAnimating(raiseEvent=false) {
        if (!raiseEvent) {
            this._animating = !(this.location.equals(this.prevLocation) || this.paused);
        } else {
            this.animating = !(this.location.equals(this.prevLocation) || this.paused);
        }
    }

    getAgent(numStates) {
        if (this._agent === null) {
            this._agent = new PlayerAgent(numStates);
        }

        return this._agent;
    }
}

export default Player;