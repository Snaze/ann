import Direction from "./Direction";
import Eventer from "./Eventer";

let _singleton = Symbol();

const callback_keydown = 0;
const callback_keyup = 1;

class KeyEventer {

    static get CALLBACK_KEYDOWN() { return callback_keydown; }
    static get CALLBACK_KEYUP() { return callback_keyup; }

    constructor(singletonToken) {
        if (_singleton !== singletonToken){
            throw new Error('Cannot instantiate directly.');
        }

        this._bindingElement = null;
        this._left = false;
        this._up = false;
        this._right = false;
        this._down = false;
        this._w = false;
        this._a = false;
        this._s = false;
        this._d = false;
        this._q = false;
        this._x = false;
        this._lastArrowPressed = null;
        this._keyDownEventer = new Eventer();
        this._keyUpEventer = new Eventer();

        if (typeof(document) !== "undefined") {
            this._bindingElement = document.body;
            this._bindingElement.onkeydown = (e) => this.onKeyDown(e);
            this._bindingElement.onkeyup = (e) => this.onKeyUp(e);
        }
    }

    static get instance() {
        if(!this[_singleton]) {
            this[_singleton] = new KeyEventer(_singleton);
        }

        return this[_singleton];
    }

    addCallback(theCallback, callbackType) {
        if (callbackType === KeyEventer.CALLBACK_KEYDOWN) {
            this._keyDownEventer.addCallback(theCallback);
        } else if (callbackType === KeyEventer.CALLBACK_KEYUP) {
            this._keyUpEventer.addCallback(theCallback);
        } else {
            throw new Error("Unknown Callback Type");
        }
    }

    removeCallback(theCallback, callbackType) {
        if (callbackType === KeyEventer.CALLBACK_KEYDOWN) {
            this._keyDownEventer.removeCallback(theCallback);
        } else if (callbackType === KeyEventer.CALLBACK_KEYUP) {
            this._keyUpEventer.removeCallback(theCallback);
        } else {
            throw new Error("Unknown Callback Type");
        }
    }


    get left() { return this._left; }
    get up() { return this._up; }
    get right() { return this._right; }
    get down() { return this._down; }

    get w() {
        return this._w;
    }

    get a() {
        return this._a;
    }

    get s() {
        return this._s;
    }

    get d() {
        return this._d;
    }

    get q() {
        return this._q;
    }

    get x() {
        return this._x;
    }

    onKeyDown(e) {
        switch (e.key) {
            case "ArrowDown":
                this._down = true;
                this._lastArrowPressed = Direction.DOWN;
                break;
            case "ArrowUp":
                this._up = true;
                this._lastArrowPressed = Direction.UP;
                break;
            case "ArrowLeft":
                this._left = true;
                this._lastArrowPressed = Direction.LEFT;
                break;
            case "ArrowRight":
                this._right = true;
                this._lastArrowPressed = Direction.RIGHT;
                break;
            case "w":
            case "W":
                this._w = true;
                break;
            case "a":
            case "A":
                this._a = true;
                break;
            case "s":
            case "S":
                this._s = true;
                break;
            case "d":
            case "D":
                this._d = true;
                break;
            case "x":
            case "X":
                this._x = true;
                break;
            case "q":
            case "Q":
                this._q = true;
                break;
            case "Enter":
            case " ":
                break;
            default:
                return; // Quit when this doesn't handle the key event.
        }

        this._keyDownEventer.raiseEvent(e.key);
    }

    onKeyUp(e) {
        switch (e.key) {
            case "ArrowDown":
                this._down = false;
                if (this._lastArrowPressed === Direction.DOWN) {
                    this._lastArrowPressed = null;
                }
                break;
            case "ArrowUp":
                this._up = false;
                if (this._lastArrowPressed === Direction.UP) {
                    this._lastArrowPressed = null;
                }
                break;
            case "ArrowLeft":
                this._left = false;
                if (this._lastArrowPressed === Direction.LEFT) {
                    this._lastArrowPressed = null;
                }
                break;
            case "ArrowRight":
                this._right = false;
                if (this._lastArrowPressed === Direction.RIGHT) {
                    this._lastArrowPressed = null;
                }
                break;
            case "w":
            case "W":
                this._w = false;
                break;
            case "a":
            case "A":
                this._a = false;
                break;
            case "s":
            case "S":
                this._s = false;
                break;
            case "d":
            case "D":
                this._d = false;
                break;
            case "x":
            case "X":
                this._x = false;
                break;
            case "q":
            case "Q":
                this._q = false;
                break;
            case "Enter":
            case " ":
                break;
            default:
                return; // Quit when this doesn't handle the key event.
        }

        this._keyUpEventer.raiseEvent(e.key);
    }

    get lastArrowPressed() {
        return this._lastArrowPressed;
    }
}

export default KeyEventer;