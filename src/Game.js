import React from 'react';
import PropTypes from 'prop-types';
import {default as GameModel} from "./model/Game";
import Level from "./Level";
import LevelEditPanel from "./LevelEditPanel";
import DataSourceComponent from "./DataSourceComponent";
import "./Game.css";

class Game extends DataSourceComponent {

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