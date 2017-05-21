import Level from "./Level";
import LevelFactory from "./LevelFactory";
import Player from "./Player";
import Ghost from "./Ghost";
import Direction from "../utils/Direction";
import Location from "./Location";

class Game {
    constructor(levelName="Level1") {
        this._score = 0;
        this._editMode = false;
        this._level = LevelFactory.createLevel(levelName);

        let playerLocation = Location.fromIndexArray(this._level.spawnIndices.player);
        this._player = new Player(Direction.LEFT, playerLocation, Player.MR_PAC_MAN);

        let ghostLocation = Location.fromIndexArray(this._level.spawnIndices.ghostRed);
        if (ghostLocation.isValid) {
            this._ghostRed = new Ghost(Direction.LEFT, ghostLocation, Ghost.RED);
        } else {
            this._ghostRed = null;
        }

        ghostLocation = Location.fromIndexArray(this._level.spawnIndices.ghostPink);
        if (ghostLocation.isValid) {
            this._ghostPink = new Ghost(Direction.LEFT, ghostLocation, Ghost.PINK);
        } else {
            this._ghostPink = null;
        }

        ghostLocation = Location.fromIndexArray(this._level.spawnIndices.ghostBlue);
        if (ghostLocation.isValid) {
            this._ghostBlue = new Ghost(Direction.LEFT, ghostLocation, Ghost.BLUE);
        } else {
            this._ghostBlue = null;
        }

        ghostLocation = Location.fromIndexArray(this._level.spawnIndices.ghostOrange);
        if (ghostLocation.isValid) {
            this._ghostOrange = new Ghost(Direction.LEFT, ghostLocation, Ghost.ORANGE);
        } else {
            this._ghostOrange = null;
        }
    }

    get level() {
        return this._level;
    }

    get player() {
        return this._player;
    }

    get ghostRed() {
        return this._ghostRed;
    }

    get ghostPink() {
        return this._ghostPink;
    }

    get ghostBlue() {
        return this._ghostBlue;
    }

    get ghostOrange() {
        return this._ghostOrange;
    }

    get score() {
        return this._score;
    }

    get editMode() {
        return this._editMode;
    }
}

export default Game;