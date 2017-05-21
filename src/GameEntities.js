import React, { Component } from 'react';
import "./GameEntities.css";
import {default as LevelModel} from "./model/Level";

class GameEntities extends Component {
    constructor(props) {
        super(props);


    }

    getEntityStyle(spawnIndicesName) {
        let toRet = {
            display: "none"
        };

        let spawnIndices = this.level.getSpawnIndices(spawnIndicesName);
        let yIndex = spawnIndices[0];
        let xIndex = spawnIndices[1];

        if ((yIndex > -1) && (xIndex > -1)) {
            let cellModel = this.level.gameMatrix[yIndex][xIndex];
            let cellLocation = Cell.getCellLocation(cellModel);

            toRet.display = "block";
            toRet.position = "absolute";
            toRet.top =  (cellLocation.y - 2) + "px";
            toRet.left = (cellLocation.x - 2) + "px";
            toRet.pointerEvents = "none";
        }

        return toRet;
    }

    render() {
        return (
            <div className="GameEntities">
                <div className="GamePlayer" style={this.getEntityStyle(LevelModel.SPAWN_INDICES_PLAYER)}>
                    <Player gender={Player.MR_PAC_MAN} stepNumber={this.state.stepNumber} />
                </div>
                <div className="GameGhostRed" style={this.getEntityStyle(LevelModel.SPAWN_INDICES_GHOST_RED)}>
                    <Ghost color={Ghost.RED} stepNumber={this.state.stepNumber} />
                </div>
                <div className="GameGhostBlue" style={this.getEntityStyle(LevelModel.SPAWN_INDICES_GHOST_BLUE)}>
                    <Ghost color={Ghost.BLUE} stepNumber={this.state.stepNumber} />
                </div>
                <div className="GameGhostPink" style={this.getEntityStyle(LevelModel.SPAWN_INDICES_GHOST_PINK)}>
                    <Ghost color={Ghost.PINK} stepNumber={this.state.stepNumber} />
                </div>
                <div className="LevelGhostOrange" style={this.getEntityStyle(LevelModel.SPAWN_INDICES_GHOST_ORANGE)}>
                    <Ghost color={Ghost.ORANGE} stepNumber={this.state.stepNumber} />
                </div>
            </div>);
    }
}

export default GameEntities;