import Direction from "../../utils/Direction";
import KeyEventer from "../../utils/KeyEventer";
import ActorBase from "./ActorBase";
import _ from "../../../node_modules/lodash/lodash";
import Dot from "../Dot";
import moment from "../../../node_modules/moment/moment";

const mr_pac_man = 0;
const mrs_pac_man = 1;
const valid_gender = [mr_pac_man, mrs_pac_man];

class Player extends ActorBase {

    static get MR_PAC_MAN() { return mr_pac_man; }
    static get MRS_PAC_MAN() { return mrs_pac_man; }

    static genderIsValid(theGender) {
        return valid_gender.indexOf(theGender) > -1;
    }

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
        // this._attackModeDuration = 60;
        this._attackModeFinishTime = moment();
        this._prevLocation = this.location.clone();
        this._numLives = 3;
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
        let cell = this.level.getCellByLocation(theLocation);
        if (cell.dotType === Dot.LITTLE) {
            this.score = this.score + 10;
            cell.dotType = Dot.NONE;
            this._setValueAndRaiseOnChange("_dotsEaten", this._dotsEaten + 1);
        } else if (cell.dotType === Dot.BIG) {
            // console.log("DotType = BIG");
            this.score = this.score + 50;
            cell.dotType = Dot.NONE;
            this._setValueAndRaiseOnChange("_attackModeFinishTime", moment().add(this._attackModeDuration, "s"));
            this._setValueAndRaiseOnChange("_dotsEaten", this._dotsEaten + 1);
        }
    }

    removeAllCallbacks() {
        super.removeAllCallbacks();
    }

    timerTick(e) {

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
}

export default Player;