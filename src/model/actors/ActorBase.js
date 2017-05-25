import DataSourceBase from "../DataSourceBase";
import Direction from "../../utils/Direction";
import Location from "../Location";
import moment from "../../../node_modules/moment/moment";
import GameTimer from "../GameTimer";
// import Level from "../Level";

/**
 * This is an abstract class that should be used by any game agent.
 *
 * i.e. Player, Ghost, etc....
 */
class ActorBase extends DataSourceBase {
    constructor(direction, location, level) {
        super();

        if (!Direction.isValid(direction)) {
            throw new Error ("Invalid direction");
        }

        if (!(location instanceof Location)) {
            throw new Error ("Invalid Location");
        }

        // if (!(level instanceof Level)) {
        //     throw new Error ("Invalid Level");
        // }

        this._direction = direction;
        this._startDirection = direction;
        this._location = location;
        this._level = level;
        this._cellTransitionDuration = 0.25; // seconds
        this._spawnLocation = null;
        this._lastTick = moment();
        this._editMode = false;

        this._timerCallbackHandle = (e) => this._timerCallback(e);
        GameTimer.instance.addCallback(this._timerCallbackHandle);

        this._locationOnChangeCallbackRef = (e) => this._locationOnChangeCallback(e);
        this._location.addOnChangeCallback(this._locationOnChangeCallbackRef);
    }

    _locationOnChangeCallback(e) {
        this._raiseOnChangeCallbacks("_location." + e.source);

        // TODO: FIXME this is kind of a hack
        if ((this._spawnLocation === null) && e.object.isValid) {
            this._spawnLocation = e.object.clone();
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

    _timerCallback(e) {

        let currentMoment = moment();
        let lastTickPlusDuration = this._lastTick.clone().add(this._cellTransitionDuration, "s");

        if (currentMoment.isAfter(lastTickPlusDuration)) {

            this.timerTick(e);
            this._lastTick = moment();
        }
    }

    removeAllCallbacks() {
        super.removeAllCallbacks();

        this._location.removeOnChangeCallback(this._locationOnChangeCallbackRef);
        GameTimer.instance.removeCallback(this._timerCallbackHandle);
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
            GameTimer.instance.removeCallback(this._timerCallbackHandle);

            if ((this._spawnLocation !== null) && this._spawnLocation.isValid) {
                this.direction = this._startDirection;
                this.location.setWithLocation(this._spawnLocation);
            }
        } else {
            GameTimer.instance.addCallback(this._timerCallbackHandle);
        }
    }

    get spawnLocation() {
        return this._spawnLocation;
    }

    set spawnLocation(value) {
        this._spawnLocation = value;
    }

    get level() {
        return this._level;
    }

    set level(value) {
        this._level = value;
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
     * @param actor - Player or the Ghost
     * @param direction - The Direction to move
     */
    moveInDirection(direction) {
        let sourceLocation = this.location;

        if ((Direction.NONE === direction) || !this.canMoveInDirection(sourceLocation, direction)) {
            return;
        }

        switch (direction) {
            case Direction.DOWN:
                if ((sourceLocation.y + 1) < this.level.height) {
                    sourceLocation.y += 1;
                } else {
                    sourceLocation.y = 0;
                }
                this.direction = Direction.DOWN;
                break;
            case Direction.UP:
                if ((sourceLocation.y - 1) >= 0) {
                    sourceLocation.y -= 1;
                } else {
                    sourceLocation.y = this.level.height - 1;
                }
                this.direction = Direction.UP;
                break;
            case Direction.LEFT:
                if ((sourceLocation.x - 1) >= 0) {
                    sourceLocation.x -= 1;
                } else {
                    sourceLocation.x = this.level.width - 1;
                }
                this.direction = Direction.LEFT;
                break;
            case Direction.RIGHT:
                if ((sourceLocation.x + 1) < this.level.width) {
                    sourceLocation.x += 1;
                } else {
                    sourceLocation.x = 0;
                }
                this.direction = Direction.RIGHT;
                break;
            default:
                break;
        }
    }
}

export default ActorBase;