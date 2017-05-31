import DataSourceBase from "./DataSourceBase"

class GameHeader extends DataSourceBase {
    constructor(player1, player2) {
        super ();

        if (player1 === null) {
            throw new Error("Player1 must have a value");
        }

        this._player1 = this._wireUp("_player1", player1);

        if (player2 !== null) {
            this._player2 = this._wireUp("_player2", player2);
        } else {
            this._player2 = null;
        }

        this._highScore = this.localStorageHighScore;
    }

    get localStorageHighScore() {
        let theHighScore = 0;

        try {
            theHighScore = localStorage.getItem("highScore");

            if (theHighScore) {
                return theHighScore;
            }
        } catch (e) {
            console.log("localStorage not working.");
            // DO SOMETHING HERE
        }

        return 0;
    }

    set localStorageHighScore(value) {
        try {
            localStorage.setItem("highScore", value);
        } catch (e) {
            console.log("localStorage not working.");
        }
    }

    persistHighScore() {
        this.localStorageHighScore = Math.max(this.player1Score, this.player2Score, this.localStorageHighScore);
    }

    _nestedDataSourceChanged(e) {
        if (e.source === "_score") {
            let highScore = Math.max(this.player1Score, this.player2Score, this._highScore);
            this._setValueAndRaiseOnChange("_highScore", highScore);

            super._nestedDataSourceChanged(e);
        }
    }

    get player1Score() {
        return this._player1.score;
    }

    get player2Score() {
        if (this._player2 !== null) {
            return this._player2.score;
        }

        return 0;
    }

    get player1() {
        return this._player1;
    }

    set player1(value) {
        if (this._player1 !== null) {
            this._unWire(this._player1);
        }

        this._setValueAndRaiseOnChange("_player1", value);
    }

    get player2() {
        return this._player2;
    }

    set player2(value) {
        if (this._player2 !== null) {
            this._unWire(this._player2);
        }

        this._setValueAndRaiseOnChange("_player2", value);
    }

    get highScore() {
        return this._highScore;
    }

}

export default GameHeader;