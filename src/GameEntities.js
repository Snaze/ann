import React from 'react';
import "./GameEntities.css";
import GameObjectContainer from "./model/GameObjectContainer";
import Player from "./actors/Player";
import Ghost from "./actors/Ghost";
import DataSourceComponent from "./DataSourceComponent";
import PropTypes from 'prop-types';
import Points from "./Points";

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

                <Points dataSource={this.gameObjectContainer.ghostRed.points} />
                <Points dataSource={this.gameObjectContainer.ghostBlue.points} />
                <Points dataSource={this.gameObjectContainer.ghostPink.points} />
                <Points dataSource={this.gameObjectContainer.ghostOrange.points} />
            </div>);
    }
}

GameEntities.propTypes = {
    dataSource: PropTypes.instanceOf(GameObjectContainer).isRequired
};

export default GameEntities;