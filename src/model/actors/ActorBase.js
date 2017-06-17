import DataSourceBase from "../DataSourceBase";
import Direction from "../../utils/Direction";
import Location from "../Location";
import moment from "../../../node_modules/moment/moment";
import Level from "../Level";
import KeyEventer from "../../utils/KeyEventer";

/**
 * This is an abstract class that should be used by any game agent.
 *
 * i.e. Player, Ghost, etc....
 */
class ActorBase extends DataSourceBase {
    static _aiMode = true;
    static _fastLearnMode = false;
    static _onKeyDownRef = null;

    constructor(level) {
        super();

        if (!(level instanceof Level)) {
            throw new Error ("Invalid Level");
        }

        this._level = this._wireUp("_level", level);
        this._direction = Direction.LEFT;
        this._startDirection = Direction.LEFT;
        this._location = this._wireUp("_location", new Location(-1, -1));
        this._cellTransitionDuration = 0.3; // seconds
        this._spawnLocation = null;
        this._lastTick = moment();
        this._editMode = false;
        this._paused = false;
        this._isAlive = true;

    }

    static bindOnKeyDown() {
        if (ActorBase._onKeyDownRef === null) {
            ActorBase._onKeyDownRef = (e) => ActorBase.onKeyDown(e);
            KeyEventer.instance.addCallback(ActorBase._onKeyDownRef, KeyEventer.CALLBACK_KEYDOWN);
        }
    }


    static onKeyDown(key) {
        if (key.toLowerCase() === "f") {
            ActorBase._fastLearnMode = !ActorBase._fastLearnMode;
        }
    }

    /**
     * This method should be overridden in child classes.
     * It infinitely fires after the cellTransitionDuration has elapsed.
     * @param e The timer events args.  You can probably just ignore this.
     */
    timerTick(e) {
        console.log("This method should be overridden in child classes.");
    }

    resetLocations() {
        console.log("This method should be overridden in child classes.");
    }

    executeActorStep(e) {

        let toRet = false;

        if (this.paused) {
            return toRet;
        }

        let currentMoment = moment();
        let lastTickPlusDuration = this._lastTick.clone().add(this._cellTransitionDuration, "s");

        // Use this to train fast.
        if (ActorBase._fastLearnMode || currentMoment.isAfter(lastTickPlusDuration)) {
        // if (currentMoment.isAfter(lastTickPlusDuration)) {

            this.timerTick(e);

            this._lastTick = moment();
            toRet = true;
        }

        return toRet;
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

    get cellTransitionDuration() {
        return this._cellTransitionDuration;
    }

    set cellTransitionDuration(value) {
        this._setValueAndRaiseOnChange("_cellTransitionDuration", value);
    }

    get editMode() {
        return this._editMode;
    }

    set editMode(value) {
        this._setValueAndRaiseOnChange("_editMode", value);

        if (value) {
            this.paused = true;

            if ((this._spawnLocation !== null) && this._spawnLocation.isValid) {
                this.direction = this._startDirection;
                this.location.setWithLocation(this._spawnLocation);
            }
        } else {
            this.paused = false;
        }
    }

    get spawnLocation() {
        return this._spawnLocation;
    }

    set spawnLocation(value) {
        this._setValueAndRaiseOnChange("_spawnLocation", value);
    }

    get level() {
        return this._level;
    }

    set level(value) {
        if (value !== this._level) {
            this._unWire(this._level);
            this._wireUp("_level", value);
        }

        this._setValueAndRaiseOnChange("_level", value);
        this.resetLocations();
    }

    canMoveInDirection(sourceLocation, direction) {
        let theCell = this.level.getCellByLocation(sourceLocation);
        let hasSolidBorder = theCell.getSolidBorder(direction);
        let hasPartialBorder = theCell.getPartialBorder(direction);

        return !(hasSolidBorder || hasPartialBorder);
    }

    /**
     * This will move an Actor (Player or Ghost) in the appropriate
     * direction according the the level's borders
     * @param direction - The Direction to move
     */
    moveInDirection(direction) {
        let sourceLocation = this.location;

        if (typeof(direction) === "undefined") {
            console.log("how is direction undefined?");
            return;
        }

        if ((Direction.NONE === direction) || !this.canMoveInDirection(sourceLocation, direction)) {
            return;
        }

        sourceLocation.moveInDirection(direction, this.level.height, this.level.width);
        this.direction = direction;
    }

    moveBackToSpawn() {
        if (this._spawnLocation === null) {
            throw new Error("_spawnLocation is null");
        }

        this.location.setWithLocation(this._spawnLocation);
    }

    resetDirection() {
        this.direction = this._startDirection;
    }

    get paused() {
        return this._paused;
    }

    set paused(value) {
        this._setValueAndRaiseOnChange("_paused", value);
    }

    get isAlive() {
        return this._isAlive;
    }

    set isAlive(value) {
        this._setValueAndRaiseOnChange("_isAlive", value);
    }

    get aiMode() {
        return ActorBase._aiMode;
    }

    set aiMode(value) {
        ActorBase._aiMode = value;
    }
}

ActorBase.bindOnKeyDown();

export default ActorBase;