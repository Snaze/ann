import Direction from "../../utils/Direction";
import KeyEventer from "../../utils/KeyEventer";
import ActorBase from "./ActorBase";
import _ from "../../../node_modules/lodash/lodash";

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
        // this.debug = true;
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

    removeAllCallbacks() {
        super.removeAllCallbacks();

        if (typeof(document) !== "undefined") {
            this._keyEventer.unBindEvents();
        }
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
}

export default Player;