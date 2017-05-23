import Direction from "./Direction";

// TODO: refactor this to use the Eventer class
class KeyEventer {
    constructor() {
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
        this._weBoundOnKeyDown = false;
        this._weBoundOnKeyUp = false;
        this._onKeyDownCallback = null;
        this._onKeyUpCallback = null;
    }

    // TODO: Should these really be static?
    static _onKeyDownCallbacks = null;
    static get onKeyDownCallbacks() {
        if (KeyEventer._onKeyDownCallbacks === null) {
            KeyEventer._onKeyDownCallbacks = [];
        }

        return KeyEventer._onKeyDownCallbacks;
    }

    // TODO: Should these really be static?
    static _onKeyUpCallbacks = null;
    static get onKeyUpCallbacks() {
        if (KeyEventer._onKeyUpCallbacks === null) {
            KeyEventer._onKeyUpCallbacks = [];
        }

        return KeyEventer._onKeyUpCallbacks;
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

    bindEvents(bindingElement, onKeyDownCallback, onKeyUpCallback) {
        this._bindingElement = bindingElement;

        if (!this._bindingElement.onkeydown) {
            this._bindingElement.onkeydown = (e) => this.onKeyDown(e);
            this._weBoundOnKeyDown = true;
        }

        if (!this._bindingElement.onkeyup) {
            this._bindingElement.onkeyup = (e) => this.onKeyUp(e);
            this._weBoundOnKeyUp = true;
        }

        if (onKeyDownCallback) {
            this._onKeyDownCallback = onKeyDownCallback;
            KeyEventer.onKeyDownCallbacks.push(this._onKeyDownCallback);
        }

        if (onKeyUpCallback) {
            this._onKeyUpCallback = onKeyUpCallback;
            KeyEventer.onKeyUpCallbacks.push(this._onKeyUpCallback);
        }
    }

    unBindEvents() {

        if (this._weBoundOnKeyDown) {
            this._bindingElement.onkeydown = null;
        }

        if (this._weBoundOnKeyUp) {
            this._bindingElement.onkeyup = null;
        }

        this._bindingElement = null;

        if (this._onKeyDownCallback) {
            let index = KeyEventer.onKeyDownCallbacks.indexOf(this._onKeyDownCallback);
            if (index > -1) {
                KeyEventer.onKeyDownCallbacks.splice(index, 1);
            }
        }

        if (this._onKeyUpCallback) {
            let index = KeyEventer.onKeyUpCallbacks.indexOf(this._onKeyUpCallback);
            if (index > -1) {
                KeyEventer.onKeyUpCallbacks.splice(index, 1);
            }
        }

        this._onKeyDownCallback = null;
        this._onKeyUpCallback = null;
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
            default:
                return; // Quit when this doesn't handle the key event.
        }

        KeyEventer.onKeyDownCallbacks.forEach(function (cb) {
           cb(e.key);
        });
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
            default:
                return; // Quit when this doesn't handle the key event.
        }

        KeyEventer.onKeyUpCallbacks.forEach(function (cb) {
            cb(e.key);
        });
    }

    get lastArrowPressed() {
        return this._lastArrowPressed;
    }
}

export default KeyEventer;