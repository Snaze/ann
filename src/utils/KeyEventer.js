

class KeyEventer {
    constructor() {
        this._bindingElement = null;
        this._left = false;
        this._up = false;
        this._right = false;
        this._down = false;
        this._onKeyDownCallback = null;
        this._onKeyUpCallback = null;
    }

    get left() { return this._left; }
    get up() { return this._up; }
    get right() { return this._right; }
    get down() { return this._down; }

    bindEvents(bindingElement, onKeyDownCallback, onKeyUpCallback) {
        this._bindingElement = bindingElement;
        this._bindingElement.onkeydown = (e) => this.onKeyDown(e);
        this._bindingElement.onkeyup = (e) => this.onKeyUp(e);
        this._onKeyDownCallback = onKeyDownCallback;
        this._onKeyUpCallback = onKeyUpCallback;
    }

    unBindEvents() {
        this._bindingElement = null;
        this._bindingElement.onkeydown = null;
        this._bindingElement.onkeyup = null;
        this._onKeyDownCallback = null;
        this._onKeyUpCallback = null;
    }

    onKeyDown(e) {
        switch (e.key) {
            case "ArrowDown":
                this._down = true;
                break;
            case "ArrowUp":
                this._up = true;
                break;
            case "ArrowLeft":
                this._left = true;
                break;
            case "ArrowRight":
                this._right = true;
                break;
            default:
                return; // Quit when this doesn't handle the key event.
        }

        if (this._onKeyDownCallback) {
            this._onKeyDownCallback(e.key);
        }
    }

    onKeyUp(e) {
        switch (e.key) {
            case "ArrowDown":
                this._down = false;
                break;
            case "ArrowUp":
                this._up = false;
                break;
            case "ArrowLeft":
                this._left = false;
                break;
            case "ArrowRight":
                this._right = false;
                break;
            default:
                return; // Quit when this doesn't handle the key event.
        }

        if (this._onKeyUpCallback) {
            this._onKeyUpCallback(e.key);
        }
    }
}

export default KeyEventer;