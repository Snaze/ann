import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {default as GameModel} from "./model/Game";
import Level from "./Level";
import Player from "./actors/Player";
import Ghost from "./actors/Ghost";
import LevelEditPanel from "./LevelEditPanel";
import Cell from "./Cell";
import {default as LevelModel} from "./model/Level";
import DataSourceComponent from "./DataSourceComponent";

class Game extends DataSourceComponent {

    constructor(props) {
        super(props);

    }

    get level() {
        return this.game.level;
    }

    get game() {
        return this.dataSource;
    }

    levelEditPanel_onLoadComplete(theLevel) {
        this.game.level = theLevel;
    }

    render() {
        return (<div className="Game">
            <div className="GameLevel">
                <Level dataSource={this.level} />
            </div>
            <div className="GameLevelEditorPanel">
                <LevelEditPanel dataSource={this.level}
                                onLoadComplete={(e) => this.levelEditPanel_onLoadComplete(e)} />
            </div>
        </div>);
    }
}

Game.propTypes = {
    dataSource: PropTypes.instanceOf(GameModel).isRequired
};

export default Game;