import ActorBase from "./ActorBase";
import Points from "../Points";
import Direction from "../../utils/Direction";
import moment from "../../../node_modules/moment/moment";
import SoundPlayer from "../../utils/SoundPlayer";

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

const powerUpNameMap = {
    "cherry": cherry,
    "strawberry": strawberry,
    "orange": orange,
    "pretzel": pretzel,
    "apple": apple,
    "pear": pear,
    "banana": banana
};

const life_duration = 30; // seconds
const blink_time = 20;

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
        this._points = this._wireUp("_points", new Points(Points.POINTS_TYPE_POWER_UP));
        this._points.amount = powerUpType;
        this._cellTransitionDuration = 0.6;
        this._isAlive = false;
        this._blink = false;

        this._lifeExpirationTime = null;
        this._blinkTime = null;
    }

    resetLocations() {
        this.location.set(-1, -1);
        this._spawnLocation.set(-1, -1);
        this._prevLocation.set(-1, -1);
        this._destinationLocation.set(-1, -1);
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
            return Direction.NONE;
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

    executeActorStep(e) {
        let toRet = super.executeActorStep(e);

        this.points.timerTick(e);

        return toRet;
    }

    timerTick(e) {
        let theDirection = this.getNextDirection();

        this._prevLocation.setWithLocation(this.location);
        this.moveInDirection(theDirection);

        if (this.isAlive) {
            let now = moment();

            if (this._lifeExpirationTime <= now) {
                this.isAlive = false;
                this.moveBackToSpawn();
                this.blink = false;
            } else if (now > this._blinkTime) {
                this.blink = true;
            } else {
                this.blink = false;
            }
        }
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

    get powerUpValue() {
        return this.powerUpType;
    }

    get blink() {
        return this._blink;
    }

    set blink(value) {
        this._setValueAndRaiseOnChange("_blink", value);
    }

    set powerUpType(value) {
        if (validPowerUps.indexOf(value) < 0) {
            throw new Error("Invalid Power up");
        }

        this.points.amount = value;

        this._setValueAndRaiseOnChange("_powerUpType", value);
    }

    setPowerUpTypeByName(name) {
        this.powerUpType = powerUpNameMap[name.toLowerCase()];
    }

    spawn() {
        let powerUps = this.level.powerUps;
        let powerUpIndex = Math.floor(Math.random() * powerUps.length);
        let randomPowerUp = this.level.powerUps[powerUpIndex];

        this.setPowerUpTypeByName(randomPowerUp);
        this.isAlive = true;
        this.location.setWithLocation(this.level.getRandomPowerUpSpawnLocation());
        let now = moment();
        this._blinkTime = now.clone().add(blink_time, "s");
        this._lifeExpirationTime = now.clone().add(life_duration, "s");
    }

    pickUp(thePlayer) {
        this.points.show(this.location);
        thePlayer.score += this.powerUpValue;
        SoundPlayer.instance.play(SoundPlayer.instance.eatfruit);
        this.isAlive = false;
        this.moveBackToSpawn();
    }

    static _trainingFeatureIndices = null;
    static get trainingFeatureIndices() {
        if (PowerUp._trainingFeatureIndices === null) {
            PowerUp._trainingFeatureIndices = [
                2,  // delta x
                3,  // delta y
                4,  // isAlive
                11, // powerUpType
                10  // blink
            ];
        }

        return PowerUp._trainingFeatureIndices;
    }

    static get featureVectorLength() {
        return 14;
    }

    /**
     * This will return the feature vector that can be used to train machine learning algorithms
     *
     * @returns {Array}
     */
    toFeatureVector() {

        let lifeExpirationTime = 0;
        if (!!this._lifeExpirationTime && this._lifeExpirationTime > moment()) {
            lifeExpirationTime = this._lifeExpirationTime.clone().diff(moment(), "ms");
        }
        let blinkTime = 0;
        if (!!this._blinkTime && this._blinkTime > moment()) {
            blinkTime = this._blinkTime.clone().diff(moment(), "ms");
        }

        let toRet = [];
        let delta = this.location.getDelta(this.prevLocation);

        toRet.push(this.location.x);                    // location                 0
        toRet.push(this.location.y);                    // location                 1
        toRet.push(delta.x);                            //                          2
        toRet.push(delta.y);                            //                          3
        toRet.push(this.isAlive ? 1 : 0);               // isAlive                  4
        toRet.push(this.prevLocation.x);                // prevLocation             5
        toRet.push(this.prevLocation.y);                // prevLocation             6
        toRet.push(Direction.directionToDecimal(this.direction)); // direction      7
        toRet.push(this._destinationLocation.x);        // destination location x   8
        toRet.push(this._destinationLocation.y);        // destination location x   9
        toRet.push(this._blink ? 1 : 0);                // blink                    10
        toRet.push(this._powerUpType);                  // powerUpType              11
        toRet.push(lifeExpirationTime);                 // life expiration time     12
        toRet.push(blinkTime);                          // blink time               13

        return toRet;
    }

    /**
     * This will change the state of the PowerUp back to the state represented by the feature vector
     *
     * @param featureVector {Array} The state you wish to go back to
     */
    setFeatureVector(featureVector) {
        let locationX = featureVector[0], locationY = featureVector[1];
        this.location.set(locationX, locationY);
        this.isAlive = featureVector[4] === 1;
        let prevLocation = this.location.clone();
        prevLocation.set(featureVector[5], featureVector[6]);
        this._prevLocation = prevLocation;
        this._direction = Direction.decimalToDirection(featureVector[7]);
        let destinationLocation = this.location.clone();
        destinationLocation.set(featureVector[8], featureVector[9]);
        this._destinationLocation = destinationLocation;
        this._blink = featureVector[10] === 1;
        this._powerUpType = featureVector[11];
        this._lifeExpirationTime = moment().add(featureVector[12]);
        this._blinkTime = moment().add(featureVector[13]);
    }
}

export default PowerUp;