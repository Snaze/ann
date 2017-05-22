import React from 'react';
import "./GameEntities.css";
import {default as LevelModel} from "./model/Level";
import {default as CellModel} from "./model/Level";
import Player from "./actors/Player";
import Ghost from "./actors/Ghost";
import DataSourceComponent from "./DataSourceComponent";
import PropTypes from 'prop-types';

class GameEntities extends DataSourceComponent {

    getEntityStyle(spawnLocation) {
        let toRet = {
            display: "none"
        };

        if (spawnLocation.isValid) {
            let cellModel = this.level.gameMatrix[spawnLocation.y][spawnLocation.x];
            let cellLocation = CellModel.getCellLocation(cellModel);

            toRet.display = "block";
            toRet.position = "absolute";
            toRet.top =  (cellLocation.y - 2) + "px";
            toRet.left = (cellLocation.x - 2) + "px";
            toRet.pointerEvents = "none";
        }

        return toRet;
    }

    get level() {
        return this.dataSource;
    }

    render() {
        return (
            <div className="GameEntities">
                <div className="GameEntitiesPlayer" style={this.getEntityStyle(this.level.playerSpawnLocation)}>
                    <Player gender={Player.MR_PAC_MAN}  />
                </div>
                <div className="GameEntitiesGhostRed" style={this.getEntityStyle(this.level.ghostRedLocation)}>
                    <Ghost color={Ghost.RED} />
                </div>
                <div className="GameEntitiesGhostBlue" style={this.getEntityStyle(this.level.ghostBlueLocation)}>
                    <Ghost color={Ghost.BLUE} />
                </div>
                <div className="GameEntitiesGhostPink" style={this.getEntityStyle(this.level.ghostPinkLocation)}>
                    <Ghost color={Ghost.PINK} />
                </div>
                <div className="GameEntitiesGhostOrange" style={this.getEntityStyle(this.level.ghostOrangeLocation)}>
                    <Ghost color={Ghost.ORANGE} />
                </div>
            </div>);
    }
}

GameEntities.propTypes = {
    dataSource: PropTypes.instanceOf(LevelModel).isRequired
};

export default GameEntities;