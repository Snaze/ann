import React from 'react';
import './Level.css';
import Cell from "./Cell";
import PropTypes from 'prop-types';
import DataSourceComponent from "./DataSourceComponent";
import GameEntities from "./GameEntities";
import {default as LevelModel} from "./model/Level";
import GameObjectContainer from "./model/GameObjectContainer";

class Level extends DataSourceComponent {

    get level() {
        return this.dataSource;
    }

    renderCells(rowIndex) {
        let toRet = [];

        for (let colIndex = 0; colIndex < this.level.gameMatrix[rowIndex].length; colIndex++) {
            let currentCell = this.level.gameMatrix[rowIndex][colIndex];
            toRet.push(<Cell key={"Cell_" + currentCell.id}
                             dataSource={currentCell} />);
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

    get tableStyle() {
        return {
            width: (this.level.width * Cell.DEFAULT_CELL_WIDTH) + "px",
            height: (this.level.height * Cell.DEFAULT_CELL_HEIGHT) + "px",
        };
    }

    render() {
        return (
            <div className="Level">
                <table cellPadding={0} cellSpacing={0} style={this.tableStyle}>
                    <tbody>{this.renderRows()}</tbody>
                </table>
                <GameEntities dataSource={this.props.gameObjectContainer} />
            </div>
        );
    }
}

Level.propTypes = {
    dataSource: PropTypes.instanceOf(LevelModel).isRequired,
    gameObjectContainer: PropTypes.instanceOf(GameObjectContainer).isRequired
};

export default Level;