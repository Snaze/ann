import ActorBase from "./ActorBase";
import Points from "../Points";

const cherry = 100;
const strawberry = 200;
const orange = 500;
const pretzel = 700;
const apple = 1000;
const pear = 2000;
const banana = 5000;
const validPowerUps = [
    cherry, strawberry, orange, pretzel, apple, pear, banana
];

class PowerUp extends ActorBase {

    static get POWER_UP_CHERRY() { return cherry; }
    static get POWER_UP_STRAWBERRY() { return strawberry; }
    static get POWER_UP_ORANGE() { return orange; }
    static get POWER_UP_PRETZEL() { return pretzel; }
    static get POWER_UP_APPLE() { return apple; }
    static get POWER_UP_PEAR() { return pear; }
    static get POWER_UP_BANANA() { return banana; }

    constructor(level, powerUpType) {
        super(level);

        if (validPowerUps.indexOf(powerUpType) < 0) {
            throw new Error("Invalid Power up");
        }

        this._powerUpType = powerUpType;
        this._spawnLocation = this.location.clone();
        this._prevLocation = this.location.clone();
        this._destinationLocation = this.location.clone();
        this._points = this._wireUp("_points", new Points());
        this._cellTransitionDuration = 0.4;
    }

    _getRandomLocation() {
        let toRet = this.location;

        while (toRet.equals(this.location)) {
            toRet = this.level.getRandomActiveCellLocation();
        }

        return toRet;
    }

    getNextDirection() {

        if (!this.location.isValid) {
            return;
        }

        if (!this._destinationLocation.isValid) {
            this._destinationLocation = this.location.clone();
        }

        if ((this._destinationLocation.equals(this.location)) ||
            (this.prevLocation.equals(this.location))) { // THIS CHECK HERE IS SO THEY DONT GET STUCK ON PARTIAL BORDER
            this._destinationLocation = this._getRandomLocation();
        }

        let fromCellId = this.location.toCellId();
        let toCellId = this._destinationLocation.toCellId();

        return this.level.floydWarshall.getDirection(fromCellId, toCellId);
    }

    timerTick(e) {
        let theDirection = this.getNextDirection();

        this._prevLocation.setWithLocation(this.location);
        this.moveInDirection(theDirection);
    }

    get prevLocation() {
        return this._prevLocation;
    }

    get points() {
        return this._points;
    }

    get powerUpType() {
        return this._powerUpType;
    }
}

export default PowerUp;