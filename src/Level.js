import { default as LevelModel } from "./model/Level";
import React, { Component } from 'react';
import './Level.css';
import Cell from "./Cell";
import {default as CellModel} from "./model/Cell";
import LevelEditPanel from "./LevelEditPanel";
import KeyEventer from "./utils/KeyEventer";
import GameState from "./model/GameState";
import Player from "./actors/Player";
import Ghost from "./actors/Ghost";
import PropTypes from 'prop-types';

class Level extends Component {
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
        return this.props.level;
    }

    /** KEY EVENTER EVENTS - START **/
    onKeyDown(key) {
        if (this.props.selectedCell === null) {
            return;
        }

        let currentCell = this.props.selectedCell;
        let newSelectedCell = null;

        switch (key) {
            case "ArrowDown":
                if ((currentCell.y + 1) < this.props.level.height) {
                    currentCell.selected = false;
                    newSelectedCell = this.props.level.gameMatrix[currentCell.y + 1][currentCell.x];
                    newSelectedCell.selected = true;
                }
                break;
            case "ArrowUp":
                if ((currentCell.y - 1) >= 0) {
                    currentCell.selected = false;
                    newSelectedCell = this.props.level.gameMatrix[currentCell.y - 1][currentCell.x];
                    newSelectedCell.selected = true;
                }
                break;
            case "ArrowLeft":
                if ((currentCell.x - 1) >= 0) {
                    currentCell.selected = false;
                    newSelectedCell = this.props.level.gameMatrix[currentCell.y][currentCell.x - 1];
                    newSelectedCell.selected = true;
                }
                break;
            case "ArrowRight":
                if ((currentCell.x + 1) < this.props.level.width) {
                    currentCell.selected = false;
                    newSelectedCell = this.props.level.gameMatrix[currentCell.y][currentCell.x + 1];
                    newSelectedCell.selected = true;
                }
                break;
            default:
                return;
        }


        if (newSelectedCell) {
            this.setState({
                selectedCell: newSelectedCell
            });
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
        let cellModel = this.props.level.getCell(x, y);

        if (cellModel.id !== cellId) {
            throw new Error("Mismatched cell Ids");
        }

        if (this.state.selectedCell !== null) {
            let theSelectedCell = this.state.selectedCell;
            theSelectedCell.selected = false;
        }

        cellModel.selected = true;

        // let newState = {
        //     selectedCell: cellModel
        // };
        //
        // this.setState(newState);
    }

    onCellChange(selectedCell) {

        this.setState({
            selectedCell: selectedCell
        });
    }

    renderCells(rowIndex) {
        let toRet = [];

        for (let colIndex = 0; colIndex < this.state.level.gameMatrix[rowIndex].length; colIndex++) {
            let currentCell = this.state.level.gameMatrix[rowIndex][colIndex];
            toRet.push(<Cell key={"Cell_" + currentCell.id}
                             cell={currentCell}
                             onClick={(e) => this.cellOnClick(e)} />);
        }

        return toRet;
    }

    renderRows() {
        let toRet = [];

        for (let rowIndex = 0; rowIndex < this.state.level.gameMatrix.length; rowIndex++) {
            let key = "Level_row_" + rowIndex;
            toRet.push(<tr key={key}>{this.renderCells(rowIndex)}</tr>);
        }

        return toRet;
    }

    onLevelEditPanelUpdate(theLevel) {
        this.setState({
            level: theLevel
        });
    }

    onLoadComplete(level) {
        level.gameMatrix[0][0].selected = true;

        // this.forceUpdate();
        // this.setState({
        //     level: level,
        //     selectedCell: level.gameMatrix[0][0]
        // });
    }

    getLevelTableStyle() {
        return {
            width: Cell.DEFAULT_CELL_WIDTH * this.level.width,
            height: Cell.DEFAULT_CELL_HEIGHT * this.level.height,
        }
    }

    render() {
        return (
            <div className="Level">
                <table cellPadding={0} cellSpacing={0} style={this.getLevelTableStyle()}>
                    <tbody>{this.renderRows()}</tbody>
                </table>
            </div>
        );
    }
}

Level.propTypes = {
    level: PropTypes.instanceOf(LevelModel).isRequired,
    selectedCell: PropTypes.instanceOf(CellModel)
};

export default Level;