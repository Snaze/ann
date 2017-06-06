import React from 'react';
import "./GameEntities.css";
import GameObjectContainer from "./model/GameObjectContainer";
import Player from "./actors/Player";
import Ghost from "./actors/Ghost";
import DataSourceComponent from "./DataSourceComponent";
import PropTypes from 'prop-types';
import Points from "./Points";
import PowerUp from "./actors/PowerUp";
import GameModal from "./GameModal";


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
                <Points dataSource={this.gameObjectContainer.ghostRed.points} />

                <Ghost dataSource={this.gameObjectContainer.ghostBlue} />
                <Points dataSource={this.gameObjectContainer.ghostBlue.points} />

                <Ghost dataSource={this.gameObjectContainer.ghostPink} />
                <Points dataSource={this.gameObjectContainer.ghostPink.points} />

                <Ghost dataSource={this.gameObjectContainer.ghostOrange} />
                <Points dataSource={this.gameObjectContainer.ghostOrange.points} />

                <PowerUp dataSource={this.gameObjectContainer.powerUp} />
                <Points dataSource={this.gameObjectContainer.powerUp.points} />

                <GameModal dataSource={this.gameObjectContainer.gameModal} />
            </div>);
    }
}

GameEntities.propTypes = {
    dataSource: PropTypes.instanceOf(GameObjectContainer).isRequired
};

export default GameEntities;