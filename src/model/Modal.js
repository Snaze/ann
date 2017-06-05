import DataSourceBase from "./DataSourceBase";

class Modal extends DataSourceBase {
    constructor() {
        super();

        this._width = 400;
        this._height = 400;
        this._yesButtonText = "OK";
        this._noButtonText = "CANCEL";
        this._fontSize = 24;
        this._title = "TITLE";
        this._show = false;
        this._buttonClick = null;
    }

    get width() {
        return this._width;
    }

    set width(value) {
        this._setValueAndRaiseOnChange("_width", value);
    }

    get height() {
        return this._height;
    }

    set height(value) {
        this._setValueAndRaiseOnChange("_height", value);
    }

    get yesButtonText() {
        return this._yesButtonText;
    }

    set yesButtonText(value) {
        this._setValueAndRaiseOnChange("_yesButtonText", value);
    }

    get noButtonText() {
        return this._noButtonText;
    }

    set noButtonText(value) {
        this._setValueAndRaiseOnChange("_noButtonText", value);
    }

    get fontSize() {
        return this._fontSize;
    }

    set fontSize(value) {
        this._setValueAndRaiseOnChange("_fontSize", value);
    }

    get title() {
        return this._title;
    }

    set title(value) {
        this._setValueAndRaiseOnChange("_title", value);
    }

    get show() {
        return this._show;
    }

    set show(value) {
        this._setValueAndRaiseOnChange("_show", value);
    }

    get buttonClick() {
        return this._buttonClick;
    }

    set buttonClick(value) {
        this._setValueAndRaiseOnChange("_buttonClick", value);
    }
}

export default Modal;