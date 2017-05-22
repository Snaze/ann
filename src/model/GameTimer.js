import Eventer from "../utils/Eventer";
import moment from "../../node_modules/moment/moment";

let _singleton = Symbol();

const tickFrequency = 256;

// const time_25ms = 0;
// const time_50ms = 1;
// const time_100ms = 2;
// const time_250ms = 3;
// const time_500ms = 4;
// const time_1000ms = 5;

const time_250ms = 0;
const time_500ms = 1;
const time_1000ms = 2;

class GameTimer {

    // static get TIME_25MS() { return time_25ms; }
    // static get TIME_50MS() { return time_50ms; }
    // static get TIME_100MS() { return time_100ms; }
    static get TIME_250MS() { return time_250ms; }
    static get TIME_500MS() { return time_500ms; }
    static get TIME_1000MS() { return time_1000ms; }

    constructor(singletonToken) {
        if (_singleton !== singletonToken){
            throw new Error('Cannot instantiate directly.');
        }

        this._interval = setInterval((e) => this.intervalTick(e), tickFrequency);
        this._stepDetails = [
            // {
            //     stepNumber: 0,
            //     increment: 25,
            //     nextTime: moment().add(25, 'ms')
            // },
            // {
            //     stepNumber: 0,
            //     increment: 50,
            //     nextTime: moment().add(50, 'ms')
            // },
            // {
            //     stepNumber: 0,
            //     increment: 100,
            //     nextTime: moment().add(100, 'ms')
            // },
            {
                stepNumber: 0,
                increment: 250,
                nextTime: moment().add(250, 'ms')
            },
            {
                stepNumber: 0,
                increment: 500,
                nextTime: moment().add(500, 'ms')
            },
            {
                stepNumber: 0,
                increment: 1000,
                nextTime: moment().add(1000, 'ms')
            }
        ];

        this._steps = [0, 0, 0, 0, 0, 0];
        this._eventer = new Eventer();
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
                current.nextTime = moment().add(current.increment, 'ms');
            }
        }

        this._eventer.raiseEvent(this._steps);
    }

    getStepNumber(timeIndex) {
        return this._stepDetails[timeIndex].stepNumber;
    }

    addCallback(theCallback) {
        this._eventer.addCallback(theCallback);
    }

    removeCallback(theCallback) {
        this._eventer.removeCallback(theCallback);
    }

    removeAllCallbacks() {
        this._eventer.removeAllCallbacks();
    }
}

export default GameTimer;