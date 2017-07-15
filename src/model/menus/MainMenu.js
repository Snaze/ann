import DataSourceBase from "../DataSourceBase";
import SoundPlayer from "../../utils/SoundPlayer";
import GameMode from "../GameMode";

class MainMenu extends DataSourceBase {

    constructor() {
        super();

        this._selectedValue = GameMode.PLAY;
        this._selectionConfirmed = false;
        this._soundCompleteCallbackRef = (e) => this._soundCompleteCallback(e);
        this._soundId = SoundPlayer.instance.play(SoundPlayer.instance.intermission);
    }

    _soundCompleteCallback(e) {
        // setTimeout(function () {
        //     SoundPlayer.instance.play(SoundPlayer.instance.beginning, this._soundCompleteCallbackRef);
        // }.bind(this), 10000);
    }

    get selectedValue() {
        return this._selectedValue;
    }

    set selectedValue(value) {
        if (GameMode.ALL.indexOf(value) < 0) {
            throw new Error("Invalid selected player");
        }

        this._setValueAndRaiseOnChange("_selectedValue", value);
        SoundPlayer.instance.play(SoundPlayer.instance.eatfruit);
    }

    get numPlayers() {
        return 1;
    }

    get selectionConfirmed() {
        return this._selectionConfirmed;
    }

    set selectionConfirmed(value) {
        if (!this._selectionConfirmed && value) {
            SoundPlayer.instance.play(SoundPlayer.instance.eatghost);

            if (this._soundId !== null) {
                SoundPlayer.instance.intermission.stop(this._soundId);
                this._soundId = null;
            }

            if (this.numPlayers === MainMenu.SELECTED_PLAYERS_2) {
                return;
            }
        }

        this._setValueAndRaiseOnChange("_selectionConfirmed", value);
    }
}

export default MainMenu;