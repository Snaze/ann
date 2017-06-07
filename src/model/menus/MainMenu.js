import DataSourceBase from "../DataSourceBase";
import SoundPlayer from "../../utils/SoundPlayer";

const selected_players_1 = 1;
const selected_players_2 = 2;
const valid_selected_players = [
    selected_players_1,
    selected_players_2
];

class MainMenu extends DataSourceBase {

    static get SELECTED_PLAYERS_1() { return selected_players_1; }
    static get SELECTED_PLAYERS_2() { return selected_players_2; }

    constructor() {
        super();

        this._selectedPlayer = MainMenu.SELECTED_PLAYERS_1;
        this._selectionConfirmed = false;
        this._soundCompleteCallbackRef = (e) => this._soundCompleteCallback(e);
        this._soundId = SoundPlayer.instance.play(SoundPlayer.instance.intermission);
    }

    _soundCompleteCallback(e) {
        // setTimeout(function () {
        //     SoundPlayer.instance.play(SoundPlayer.instance.beginning, this._soundCompleteCallbackRef);
        // }.bind(this), 10000);
    }

    get selectedPlayer() {
        return this._selectedPlayer;
    }

    set selectedPlayer(value) {
        if (valid_selected_players.indexOf(value) < 0) {
            throw new Error("Invalid selected player");
        }

        this._setValueAndRaiseOnChange("_selectedPlayer", value);
        SoundPlayer.instance.play(SoundPlayer.instance.eatfruit);
    }

    get numPlayers() {
        return this.selectedPlayer;
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
        }

        this._setValueAndRaiseOnChange("_selectionConfirmed", value);
    }
}

export default MainMenu;