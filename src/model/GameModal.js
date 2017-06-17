import DataSourceBase from "./DataSourceBase";
import Modal from "./Modal";
import CountDownMenu from "./menus/CountDownMenu";

const modal_mode_countdown = 0;
const modal_mode_game_over = 1;
const modal_mode_game_paused = 2;

class GameModal extends DataSourceBase {

    static get MODAL_MODE_COUNTDOWN() { return modal_mode_countdown; }
    static get MODAL_MODE_GAME_OVER() { return modal_mode_game_over; }
    static get MODAL_MODE_GAME_PAUSED() { return modal_mode_game_paused; }

    constructor() {
        super();

        this._modalDismissedCallback = null;
        this._modal = new Modal();
        this._countDownMenu = new CountDownMenu();
        this._gameOverText = "";

        this._countDownCallbackRef = (e) => this._countDownCallback(e);
        this._countDownMenu.callback = this._countDownCallbackRef;

        this._modalButtonClickRef = (e) => this._modalButtonClick(e);
        this._modal.buttonClick = this._modalButtonClickRef;
        this._mode = GameModal.MODAL_MODE_COUNTDOWN;
        this._visible = false;

        this._pausedText = "Game Paused";
    }

    hideModal() {
        this.modal.show = false;
        this.visible = false;

        if (this.modalDismissedCallback) {
            this.modalDismissedCallback(this);
        }
    }

    _modalButtonClick(e) {
        this.hideModal();
    }

    _countDownCallback(e) {
        this.hideModal();
    }

    showPausedModal() {
        this._mode = GameModal.MODAL_MODE_GAME_PAUSED;
        this._modal.yesButtonText = "";
        this._modal.noButtonText = "";
        this._modal.title = "GAME PAUSED";
        this._modal.height = 150;
        this._modal.width = 300;
        this._modal.show = true;
        this.visible = true;

    }

    showCountDownModal(count=3) {
        this._mode = GameModal.MODAL_MODE_COUNTDOWN;

        this._modal.yesButtonText = "";
        this._modal.noButtonText = "";
        this._modal.title = "READY!";
        this._modal.height = 150;
        this._modal.width = 300;
        this._modal.show = true;
        this.visible = true;

        this._countDownMenu.count = count;
        this._countDownMenu.start();
    }

    showGameOverModal(score, levelNum) {
        this._mode = GameModal.MODAL_MODE_GAME_OVER;

        this.gameOverText = "Score=" + score + " Level=" + levelNum;

        this._modal.yesButtonText = "OK";
        this._modal.noButtonText = "";
        this._modal.title = "GAME OVER!";
        this._modal.height = 150;
        this._modal.width = 300;
        this._modal.show = true;
        this.visible = true;
    }

    get modalDismissedCallback() {
        return this._modalDismissedCallback;
    }

    set modalDismissedCallback(value) {
        this._setValueAndRaiseOnChange("_modalDismissedCallback", value);
    }

    get modal() {
        return this._modal;
    }

    get countDownMenu() {
        return this._countDownMenu;
    }

    get mode() {
        return this._mode;
    }

    get visible() {
        return this._visible;
    }

    set visible(value) {
        this._setValueAndRaiseOnChange("_visible", value);
    }

    get gameOverText() {
        return this._gameOverText;
    }

    set gameOverText(value) {
        this._setValueAndRaiseOnChange("_gameOverText", value);
    }

    get pausedText() {
        return this._pausedText;
    }
}

export default GameModal;