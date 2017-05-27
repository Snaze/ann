import React from 'react';
import "./GameEntities.css";
import GameObjectContainer from "./model/GameObjectContainer";
import Player from "./actors/Player";
import Ghost from "./actors/Ghost";
import DataSourceComponent from "./DataSourceComponent";
import PropTypes from 'prop-types';

class GameEntities extends DataSourceComponent {

    get gameObjectContainer() {
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
                <Player dataSource={this.gameObjectContainer.player} />

                <Ghost dataSource={this.gameObjectContainer.ghostRed} />
                <Ghost dataSource={this.gameObjectContainer.ghostBlue} />
                <Ghost dataSource={this.gameObjectContainer.ghostPink} />
                <Ghost dataSource={this.gameObjectContainer.ghostOrange} />
            </div>);
    }
}

GameEntities.propTypes = {
    dataSource: PropTypes.instanceOf(GameObjectContainer).isRequired
};

export default GameEntities;