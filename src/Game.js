import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {default as GameModel} from "./model/Game";
import Level from "./Level";
import Player from "./actors/Player";
import Ghost from "./actors/Ghost";
import LevelEditPanel from "./LevelEditPanel";
import GameState from "./model/GameTimer";
import Cell from "./Cell";
import {default as LevelModel} from "./model/Level";

class Game extends Component {

    constructor(props) {
        super(props);


        this._gameState = GameState.instance;
        this._theHandler = null;
    }

    get level() {
        return this.props.game.level;
    }

    render() {
        return (<div className="Game">
            <div className="GameLevel">
                <Level level={this.level} />
            </div>
            <div className="GameLevelEditorPanel">
                <LevelEditPanel level={this.level} />
            </div>
        </div>);
    }
}

Game.propTypes = {
    game: PropTypes.instanceOf(GameModel).isRequired
};

export default Game;