import Direction from "../utils/Direction";
import Location from "./Location";
import DataSourceBase from "./DataSourceBase";

const mr_pac_man = 0;
const mrs_pac_man = 1;
const valid_gender = [mr_pac_man, mrs_pac_man];

class Player extends DataSourceBase {

    static get MR_PAC_MAN() { return mr_pac_man; }
    static get MRS_PAC_MAN() { return mrs_pac_man; }

    static genderIsValid(theGender) {
        return valid_gender.indexOf(theGender) > -1;
    }

    constructor(direction, location, gender) {
        super();

        if (!Direction.isValid(direction)) {
            throw new Error ("Invalid direction");
        }

        if (!(location instanceof Location)) {
            throw new Error ("Invalid Location");
        }

        if (!Player.genderIsValid(gender)) {
            throw new Error ("Invalid gender");
        }

        this._direction = direction;
        this._location = location;
        this._gender = gender;
    }

    get direction() {
        return this._direction;
    }

    set direction(value) {
        this._setValueAndRaiseOnChange("_direction", value);
    }

    get location() {
        return this._location;
    }

    set location(value) {
        this._setValueAndRaiseOnChange("_location", value);
    }

    get gender() {
        return this._gender;
    }

    set gender(value) {
        this._setValueAndRaiseOnChange("_gender", value);
    }
}

export default Player;