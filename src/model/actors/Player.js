import Direction from "../../utils/Direction";
import KeyEventer from "../../utils/KeyEventer";
import ActorBase from "./ActorBase";
import _ from "../../../node_modules/lodash/lodash";
import Dot from "../Dot";
import moment from "../../../node_modules/moment/moment";
import EasingFunctions from "../../utils/EasingFunctions";

const mr_pac_man = 0;
const mrs_pac_man = 1;
const valid_gender = [mr_pac_man, mrs_pac_man];
const min_cell_duration = 0.15;
const max_cell_duration = 0.25;

class Player extends ActorBase {

    static get MR_PAC_MAN() { return mr_pac_man; }
    static get MRS_PAC_MAN() { return mrs_pac_man; }
    static get MAX_CELL_DURATION() { return max_cell_duration; }
    static get MIN_CELL_DURATION() { return min_cell_duration; }

    static genderIsValid(theGender) {
        return valid_gender.indexOf(theGender) > -1;
    }

    static _nextAttackModeId = 1;

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
        this._attackModeDuration = 20;
        this._attackModeId = Player._nextAttackModeId++;
        this._attackModeFinishTime = moment();
        this._prevLocation = this.location.clone();
        this._numLives = 3;

        this._cellTransitionDuration = Player.getCellTransitionDuration(this.level); // seconds
    }

    static getCellTransitionDuration(level) {
        let levelNumberAsRange = level.getLevelNumAsTimeRange();
        levelNumberAsRange = Math.abs(1.0 - levelNumberAsRange);
        return EasingFunctions.doCalculation(EasingFunctions.easeOutCubic, levelNumberAsRange,
                                             min_cell_duration, max_cell_duration);
    }

    resetLocations() {
        this.location.setWithLocation(this.level.playerSpawnLocation);
        this._spawnLocation.setWithLocation(this.location);
    }

    _nestedDataSourceChanged(e) {

        if (_.startsWith(e.source, "_playerSpawnLocation")) {
            this._spawnLocation.setWithLocation(this.level.playerSpawnLocation);
            if (this.editMode) {
                this.location.setWithLocation(this._spawnLocation);
            }
        } else if (e.object === this.location) {
            // HMMMM, maybe make a copy of the location and pass it in
            // if this gives you trouble.
            setTimeout((e) => this.handleLocationChanged(this.location.clone()),
                        ((this._cellTransitionDuration * 1000.0) / 2.0));
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
        } else if (cell.dotType === Dot.BIG) {
            // console.log("DotType = BIG");
            this.score = this.score + 50;
            cell.dotType = Dot.NONE;
            // only increment if this is a new attack mode.
            // and not and extension of the existing one.
            if (moment() >= this._attackModeFinishTime) {
                this._attackModeId = Player._nextAttackModeId++;
            }
            this._setValueAndRaiseOnChange("_attackModeFinishTime", moment().add(this._attackModeDuration, "s"));
            this._setValueAndRaiseOnChange("_dotsEaten", this._dotsEaten + 1);
        }
    }

    removeAllCallbacks() {
        super.removeAllCallbacks();
    }

    timerTick(e) {

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

        this.attemptToMoveInDirection(newDirection);
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
        this._setValueAndRaiseOnChange("_score", value);
    }

    get attackModeDuration() {
        return this._attackModeDuration;
    }

    set attackModeDuration(value) {
        this._setValueAndRaiseOnChange("_attackModeDuration", value);
    }

    get attackModeFinishTime() {
        return this._attackModeFinishTime;
    }

    get dotsEaten() {
        return this._dotsEaten;
    }

    get numLives() {
        return this._numLives;
    }

    set numLives(value) {
        this._setValueAndRaiseOnChange("_numLives", value);
    }

    get attackModeId() {
        return this._attackModeId;
    }

    get isAlive() {
        return super.isAlive;
    }

    set isAlive(value) {
        this._attackModeFinishTime = moment().add(-1, "s");

        super.isAlive = value;
    }

    get level() {
        return this._level;
    }

    set level(value) {
        this._dotsEaten = 0;
        this._cellTransitionDuration = Player.getCellTransitionDuration(value);

        super.level = value;
    }
}

export default Player;