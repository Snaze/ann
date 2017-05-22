import { default as LevelModel } from "./model/Level";
import React, { Component } from 'react';
import './Level.css';
import Cell from "./Cell";
import {default as CellModel} from "./model/Cell";
import LevelEditPanel from "./LevelEditPanel";
import KeyEventer from "./utils/KeyEventer";
import GameState from "./model/GameTimer";
import Player from "./actors/Player";
import Ghost from "./actors/Ghost";
import PropTypes from 'prop-types';
import DataSourceComponent from "./DataSourceComponent";

class Level extends DataSourceComponent {
    constructor(props) {
        super(props);

        this._keyEventer = new KeyEventer();
    }

    componentDidMount() {
        this._keyEventer.bindEvents(document.body, (e) => this.onKeyDown(e), (e) => this.onKeyUp(e));
    }

    componentWillUnmount() {
        this._keyEventer.unBindEvents();
    }

    get level() {
        return this.dataSource;
    }

    /** KEY EVENTER EVENTS - START **/
    onKeyDown(key) {
        if (this.level.selectedCell === null) {
            return;
        }

        let currentCell = this.level.selectedCell;
        let newSelectedCell = null;

        switch (key) {
            case "ArrowDown":
                if ((currentCell.y + 1) < this.level.height) {
                    currentCell.selected = false;
                    newSelectedCell = this.level.gameMatrix[currentCell.y + 1][currentCell.x];
                    newSelectedCell.selected = true;
                }
                break;
            case "ArrowUp":
                if ((currentCell.y - 1) >= 0) {
                    currentCell.selected = false;
                    newSelectedCell = this.level.gameMatrix[currentCell.y - 1][currentCell.x];
                    newSelectedCell.selected = true;
                }
                break;
            case "ArrowLeft":
                if ((currentCell.x - 1) >= 0) {
                    currentCell.selected = false;
                    newSelectedCell = this.level.gameMatrix[currentCell.y][currentCell.x - 1];
                    newSelectedCell.selected = true;
                }
                break;
            case "ArrowRight":
                if ((currentCell.x + 1) < this.level.width) {
                    currentCell.selected = false;
                    newSelectedCell = this.level.gameMatrix[currentCell.y][currentCell.x + 1];
                    newSelectedCell.selected = true;
                }
                break;
            default:
                return;
        }
    }

    onKeyUp(key) {

    }
    /** KEY EVENTER EVENTS - END **/

    cellOnClick(e) {

        let cellId = e.target.dataset["cell_id"];
        let theArray = cellId.split("_");
        let y = theArray[0];
        let x = theArray[1];
        let cellModel = this.level.getCell(x, y);

        if (cellModel.id !== cellId) {
            throw new Error("Mismatched cell Ids");
        }

        this.level.setSelectedLocation(cellModel.location);
    }

    renderCells(rowIndex) {
        let toRet = [];

        for (let colIndex = 0; colIndex < this.level.gameMatrix[rowIndex].length; colIndex++) {
            let currentCell = this.level.gameMatrix[rowIndex][colIndex];
            toRet.push(<Cell key={"Cell_" + currentCell.id}
                             dataSource={currentCell}
                             onClick={(e) => this.cellOnClick(e)} />);
        }

        return toRet;
    }

    renderRows() {
        let toRet = [];

        for (let rowIndex = 0; rowIndex < this.level.gameMatrix.length; rowIndex++) {
            let key = "Level_row_" + rowIndex;
            toRet.push(<tr key={key}>{this.renderCells(rowIndex)}</tr>);
        }

        return toRet;
    }

    getEntityStyle(spawnLocation) {
        let toRet = {
            display: "none"
        };

        if (spawnLocation.isValid) {
            let cellModel = this.level.gameMatrix[spawnLocation.y][spawnLocation.x];
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
            <div className="Level">
                <table cellPadding={0} cellSpacing={0}>
                    <tbody>{this.renderRows()}</tbody>
                </table>
                <div className="LevelPlayer" style={this.getEntityStyle(this.level.playerSpawnLocation)}>
                    <Player gender={Player.MR_PAC_MAN} />
                </div>
                <div className="LevelGhostRed" style={this.getEntityStyle(this.state.level.spawnIndices.ghostRed)}>
                    <Ghost color={Ghost.RED} stepNumber={this.state.stepNumber} />
                </div>
                <div className="LevelGhostBlue" style={this.getEntityStyle(this.state.level.spawnIndices.ghostBlue)}>
                    <Ghost color={Ghost.BLUE} stepNumber={this.state.stepNumber} />
                </div>
                <div className="LevelGhostPink" style={this.getEntityStyle(this.state.level.spawnIndices.ghostPink)}>
                    <Ghost color={Ghost.PINK} stepNumber={this.state.stepNumber} />
                </div>
                <div className="LevelGhostOrange" style={this.getEntityStyle(this.state.level.spawnIndices.ghostOrange)}>
                    <Ghost color={Ghost.ORANGE} stepNumber={this.state.stepNumber} />
                </div>
            </div>
        );
    }
}

Level.propTypes = {
    dataSource: PropTypes.object.isRequired
};

export default Level;