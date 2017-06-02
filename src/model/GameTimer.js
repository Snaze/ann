import Eventer from "../utils/Eventer";
import moment from "../../node_modules/moment/moment";

let _singleton = Symbol();

const tickFrequency = 5;

const time_25ms = 0;
const time_50ms = 1;
const time_100ms = 2;
const time_250ms = 3;
const time_500ms = 4;
const time_1000ms = 5;

// const time_250ms = 0;
// const time_500ms = 1;
// const time_1000ms = 2;

class GameTimer {

    static get TIME_25MS() { return time_25ms; }
    static get TIME_50MS() { return time_50ms; }
    static get TIME_100MS() { return time_100ms; }
    static get TIME_250MS() { return time_250ms; }
    static get TIME_500MS() { return time_500ms; }
    static get TIME_1000MS() { return time_1000ms; }

    constructor(singletonToken) {
        if (_singleton !== singletonToken){
            throw new Error('Cannot instantiate directly.');
        }

        if (typeof(document) !== "undefined") {
            this._interval = setInterval((e) => this.intervalTick(e), tickFrequency);
        }
        let now = moment();
        this._stepDetails = [
            {
                stepNumber: 0,
                increment: 25,
                nextTime: now.clone().add(25, 'ms')
            },
            {
                stepNumber: 0,
                increment: 50,
                nextTime: now.clone().add(50, 'ms')
            },
            {
                stepNumber: 0,
                increment: 100,
                nextTime: now.clone().add(100, 'ms')
            },
            {
                stepNumber: 0,
                increment: 250,
                nextTime: now.clone().add(250, 'ms')
            },
            {
                stepNumber: 0,
                increment: 500,
                nextTime: now.clone().add(500, 'ms')
            },
            {
                stepNumber: 0,
                increment: 1000,
                nextTime: now.clone().add(1000, 'ms')
            }
        ];

        this._steps = [0, 0, 0, 0, 0, 0];
        this._eventer = new Eventer();
        this._tickFinishedEventer = new Eventer();
        this._intervalEventers = {};
    }

    static get instance() {
        if(!this[_singleton]) {
            this[_singleton] = new GameTimer(_singleton);
        }

        return this[_singleton];
    }

    intervalTick(e) {
        let now = moment();
        let current = null;

        for (let i = 0; i < this._stepDetails.length; i++) {
            current = this._stepDetails[i];

            if (now.isAfter(current.nextTime)) {
                current.stepNumber += 1;
                this._steps[i] += 1;
                current.nextTime = now.clone().add(current.increment, 'ms');
            }
        }

        // LEAVE THIS COMMENT IN HERE.  YOU MAY WANT THIS AT SOME POINT
        // this._iterateOverIntervalEventer(function (intervalObject) {
        //     if (now >= intervalObject.nextTime) {
        //         intervalObject.eventer.raiseEvent(this);
        //         intervalObject.tickFinishedEventer.raiseEvent(this);
        //         intervalObject.nextTime = moment().add(intervalObject.timeInMilliSec, "ms");
        //     }
        // });

        this._eventer.raiseEvent(this._steps);
        this._tickFinishedEventer.raiseEvent(this);
    }

    getStepNumber(timeIndex) {
        return this._stepDetails[timeIndex].stepNumber;
    }

    addCallback(theCallback) {
        this._eventer.addCallback(theCallback);
    }

    addTickFinishedCallback(theCallback) {
        this._tickFinishedEventer.addCallback(theCallback);
    }

    addIntervalCallback(theCallback, timeInMilliSec) {
        this._createIntervalEventer(timeInMilliSec);

        this._intervalEventers[timeInMilliSec].eventer.addCallback(theCallback);
    }

    addTickFinishedIntervalCallback(theCallback, timeInMilliSec) {
        this._createIntervalEventer(timeInMilliSec);
        this._intervalEventers[timeInMilliSec].tickFinishedEventer.addCallback(theCallback);
    }

    _createIntervalEventer(timeInMilliSec) {
        if (typeof(this._intervalEventers[timeInMilliSec]) === "undefined") {
            this._intervalEventers[timeInMilliSec] = {
                timeInMilliSec: timeInMilliSec,
                nextTime: moment().add(timeInMilliSec, "ms"),
                eventer: new Eventer(),
                tickFinishedEventer: new Eventer()
            };
        }
    }

    removeIntervalCallback(theCallback, timeInMilliSec) {
        this._intervalEventers[timeInMilliSec].eventer.removeCallback(theCallback);
    }

    removeTickFinishedIntervalCallback(theCallback, timeInMilliSec) {
        this._intervalEventers[timeInMilliSec].tickFinishedEventer.removeCallback(theCallback);
    }

    removeCallback(theCallback) {
        this._eventer.removeCallback(theCallback);
    }

    removeTickCallback(theCallback) {
        this._tickFinishedEventer.removeCallback();
    }

    removeAllCallbacks() {
        this._eventer.removeAllCallbacks();
        this._tickFinishedEventer.removeAllCallbacks();
        this._iterateOverIntervalEventer(function (intervalObject) {
            intervalObject.eventer.removeAllCallbacks();
            intervalObject.tickFinishedEventer.removeAllCallbacks();
        });
    }

    _iterateOverIntervalEventer(callback) {
        for (let prop in this._intervalEventers) {
            if (this._intervalEventers.hasOwnProperty(prop)) {
                callback(this._intervalEventers[prop]);
            }
        }
    }
}

export default GameTimer;