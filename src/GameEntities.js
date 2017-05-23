import React from 'react';
import "./GameEntities.css";
import {default as LevelModel} from "./model/Level";
import Player from "./actors/Player";
import Ghost from "./actors/Ghost";
import DataSourceComponent from "./DataSourceComponent";
import PropTypes from 'prop-types';

class GameEntities extends DataSourceComponent {

    get level() {
        return this.dataSource;
    }

    componentDidMount() {
        // I put this here so all the players don't end up in the top left
        // of the screen
        this.forceUpdate();
    }

    render() {
        return (
            <div className="GameEntities">
                <Player dataSource={this.level.player} level={this.level} />

                <Ghost dataSource={this.level.ghostRed} level={this.level} />
                <Ghost dataSource={this.level.ghostBlue} level={this.level} />
                <Ghost dataSource={this.level.ghostPink} level={this.level} />
                <Ghost dataSource={this.level.ghostOrange} level={this.level} />
            </div>);
    }
}

GameEntities.propTypes = {
    dataSource: PropTypes.instanceOf(LevelModel).isRequired
};

export default GameEntities;