import Direction from "../../utils/Direction";
import Location from "../Location";
import GameTimer from "../GameTimer";
import moment from "../../../node_modules/moment/moment";
import KeyEventer from "../../utils/KeyEventer";
import ActorBase from "./ActorBase";

const mr_pac_man = 0;
const mrs_pac_man = 1;
const valid_gender = [mr_pac_man, mrs_pac_man];

class Player extends ActorBase {

    static get MR_PAC_MAN() { return mr_pac_man; }
    static get MRS_PAC_MAN() { return mrs_pac_man; }

    static genderIsValid(theGender) {
        return valid_gender.indexOf(theGender) > -1;
    }

    constructor(direction, location, level, gender) {
        super(direction, location, level);

        if (!Player.genderIsValid(gender)) {
            throw new Error ("Invalid gender");
        }

        this._gender = gender;
        this._keyEventer = new KeyEventer();
        this._keyEventer.bindEvents(document.body, null, null);
    }

    timerTick(e) {

        let newDirection = this.direction;

        if (this._keyEventer.lastArrowPressed !== null) {
            if (this._keyEventer.lastArrowPressed === Direction.UP) {
                newDirection = Direction.UP;
            } else if (this._keyEventer.lastArrowPressed === Direction.DOWN) {
                newDirection = Direction.DOWN;
            } else if (this._keyEventer.lastArrowPressed === Direction.LEFT) {
                newDirection = Direction.LEFT;
            } else if (this._keyEventer.lastArrowPressed === Direction.RIGHT) {
                newDirection = Direction.RIGHT;
            }
        }

        this.attemptToMoveInDirection(newDirection);
    }

    attemptToMoveInDirection(direction) {
        let prevX = this.location.x;
        let prevY = this.location.y;

        this.level.moveInDirection(this, direction);
        if (this.location.isEqualTo(prevX, prevY)) {
            this.level.moveInDirection(this, this._direction);
        }
    }

    get gender() {
        return this._gender;
    }

    set gender(value) {
        this._setValueAndRaiseOnChange("_gender", value);
    }
}

export default Player;