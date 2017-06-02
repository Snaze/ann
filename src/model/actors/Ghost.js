import ActorBase from "./ActorBase";
import _ from "../../../node_modules/lodash/lodash";
import GhostBrainManual from "./GhostBrains/GhostBrainManual";
import Player from "./Player";
import Points from "../Points";

const red = 0;
const blue = 1;
const pink = 2;
const orange = 3;
const valid_color = [red, blue, pink, orange];

const not_scared = 0;
const scared = 1;
const scared_flash = 2;

class Ghost extends ActorBase {

    static get RED() { return red; }
    static get BLUE() { return blue; }
    static get PINK() { return pink; }
    static get ORANGE() { return orange; }

    static get SCARED_STATE_NOT_SCARED() { return not_scared; }
    static get SCARED_STATE_SCARED() { return scared; }
    static get SCARED_STATE_SCARED_FLASH() { return scared_flash; }

    get SCARED_STATE_NOT_SCARED() { return not_scared; }
    get SCARED_STATE_SCARED() { return scared; }
    get SCARED_STATE_SCARED_FLASH() { return scared_flash; }

    static colorIsValid(color) {
        return valid_color.indexOf(color) > -1;
    }

    constructor(level, color, player) {
        super(level);

        if (!Ghost.colorIsValid(color)) {
            throw new Error ("Invalid Color");
        }

        if (!(player instanceof Player)) {
            throw new Error ("Invalid Player");
        }

        this._player = player;
        this._color = color;
        switch(this._color) {
            case Ghost.RED:
                this.location.setWithLocation(level.ghostRedLocation);
                break;
            case Ghost.BLUE:
                this.location.setWithLocation(level.ghostBlueLocation);
                break;
            case Ghost.PINK:
                this.location.setWithLocation(level.ghostPinkLocation);
                break;
            case Ghost.ORANGE:
                this.location.setWithLocation(level.ghostOrangeLocation);
                break;
            default:
                throw new Error("Unknown Ghost color detected");
        }
        this._spawnLocation = this.location.clone();
        this._ghostBrain = new GhostBrainManual();
        this._scaredState = Ghost.SCARED_STATE_NOT_SCARED;
        this._prevLocation = this.location.clone();
        this._killScore = 0;
        this._points = this._wireUp("_points", new Points(Points.POINTS_TYPE_GHOST_KILL));
        this._previouslyKilled = false;
    }

    _nestedDataSourceChanged(e) {

        if (_.startsWith(e.source, "_ghostRedLocation") && this.color === Ghost.RED) {
            this._spawnLocation.setWithLocation(this.level.ghostRedLocation);
            if (this.editMode) {
                this.location.setWithLocation(this._spawnLocation);
            }
        } else if (_.startsWith(e.source, "_ghostBlueLocation") && this.color === Ghost.BLUE) {
            this._spawnLocation.setWithLocation(this.level.ghostBlueLocation);
            if (this.editMode) {
                this.location.setWithLocation(this._spawnLocation);
            }
        } else if (_.startsWith(e.source, "_ghostPinkLocation") && this.color === Ghost.PINK) {
            this._spawnLocation.setWithLocation(this.level.ghostPinkLocation);
            if (this.editMode) {
                this.location.setWithLocation(this._spawnLocation);
            }
        } else if (_.startsWith(e.source, "_ghostOrangeLocation") && this.color === Ghost.ORANGE) {
            this._spawnLocation.setWithLocation(this.level.ghostOrangeLocation);
            if (this.editMode) {
                this.location.setWithLocation(this._spawnLocation);
            }
        }

        super._nestedDataSourceChanged(e);
    }

    get color() {
        return this._color;
    }

    get player() {
        return this._player;
    }

    canMoveInDirection(sourceLocation, direction) {

        if (!this.isAlive) {
            let theCell = this.level.getCellByLocation(sourceLocation);
            let hasSolidBorder = theCell.getSolidBorder(direction);

            return !hasSolidBorder;
        }

        return super.canMoveInDirection(sourceLocation, direction);
    }

    executeActorStep(e) {
        let toRet = super.executeActorStep(e);

        this.points.timerTick(e);

        return toRet;
    }

    timerTick(e) {
        let theDirection = this._ghostBrain.getNextDirection(this, this.player, this.level);
        this.cellTransitionDuration = this._ghostBrain.cellTransitionDuration;
        this.scaredState = this._ghostBrain.getScaredState(this, this.player, this.level);

        this._prevLocation.setWithLocation(this.location);
        this.moveInDirection(theDirection);
    }

    get scaredState() {
        return this._scaredState;
    }

    set scaredState(value) {
        this._setValueAndRaiseOnChange("_scaredState", value);
    }

    get prevLocation() {
        return this._prevLocation;
    }

    get killScore() {
        return this._killScore;
    }

    set killScore(value) {
        if (value !== this._killScore) {
            this.points.amount = value;
            // this.points.pointsType = Points.POINTS_TYPE_GHOST_KILL;
            this.points.location.setWithLocation(this.location);
        }
        this._setValueAndRaiseOnChange("_killScore", value);
    }

    resetBrain() {
        this._ghostBrain.reset();
    }

    // set isAlive(value) {
    //     if (value) {
    //         this.points.reset();
    //     }
    //
    //     this._setValueAndRaiseOnChange("_isAlive", value);
    // }

    get points() {
        return this._points;
    }


    get previouslyKilled() {
        return this._previouslyKilled;
    }

    set previouslyKilled(value) {
        this._setValueAndRaiseOnChange("_previouslyKilled", value);
    }
}

export default Ghost;