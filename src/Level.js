import { default as LevelModel } from "./model/Level";
import React, { Component } from 'react';
import './Level.css';
import Cell from "./Cell";
import {default as CellModel} from "./model/Cell";
import LevelEditPanel from "./LevelEditPanel";
import KeyEventer from "./utils/KeyEventer";

class Level extends Component {
    constructor(props) {
        super(props);

        this.state = {
            level: new LevelModel(),
            selectedCell: new CellModel("-1_-1")
        };

        this._keyEventer = new KeyEventer();
    }

    componentDidMount() {
        this._keyEventer.bindEvents(document.body, (e) => this.onKeyDown(e), (e) => this.onKeyUp(e));
        let theSelectedCell = this.state.level.gameMatrix[0][0];
        this.setState({
            selectedCell: theSelectedCell
        });
    }

    componentWillUnmount() {
        this._keyEventer.unBindEvents();
    }

    onKeyDown(key) {
        if (this.state.selectedCell === null) {
            return;
        }

        let currentCell = this.state.selectedCell;
        let newSelectedCell = null;

        switch (key) {
            case "ArrowDown":
                if ((currentCell.y + 1) < this.state.level.height) {
                    currentCell.selected = false;
                    newSelectedCell = this.state.level.gameMatrix[currentCell.y + 1][currentCell.x];
                    newSelectedCell.selected = true;
                }
                break;
            case "ArrowUp":
                if ((currentCell.y - 1) >= 0) {
                    currentCell.selected = false;
                    newSelectedCell = this.state.level.gameMatrix[currentCell.y - 1][currentCell.x];
                    newSelectedCell.selected = true;
                }
                break;
            case "ArrowLeft":
                if ((currentCell.x - 1) >= 0) {
                    currentCell.selected = false;
                    newSelectedCell = this.state.level.gameMatrix[currentCell.y][currentCell.x - 1];
                    newSelectedCell.selected = true;
                }
                break;
            case "ArrowRight":
                if ((currentCell.x + 1) < this.state.level.width) {
                    currentCell.selected = false;
                    newSelectedCell = this.state.level.gameMatrix[currentCell.y][currentCell.x + 1];
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

    cellOnClick(e) {

        let cellId = e.target.dataset["cell_id"];
        let theArray = cellId.split("_");
        let y = theArray[0];
        let x = theArray[1];
        let cellModel = this.state.level.getCell(x, y);

        if (cellModel.id !== cellId) {
            throw new Error("Mismatched cell Ids");
        }

        if (this.state.selectedCell !== null) {
            let theSelectedCell = this.state.selectedCell;
            theSelectedCell.selected = false;
        }

        cellModel.selected = true;

        let newState = {
            selectedCell: cellModel
        };

        this.setState(newState);
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

        this.setState({
            level: level,
            selectedCell: level.gameMatrix[0][0]
        });
    }

    render() {
        return (
            <div>
                <table className="Level" cellPadding={0} cellSpacing={0}>
                    <tbody>{this.renderRows()}</tbody>
                </table>
                <div className="LevelEditorPanel">
                    <LevelEditPanel width={this.state.level.width}
                                    height={this.state.level.height}
                                    level={this.state.level}
                                    onUpdate={(l) => this.onLevelEditPanelUpdate(l)}
                                    onCellChange={(cell) => this.onCellChange(cell)}
                                    cell={this.state.selectedCell}
                                    onLoadComplete={(level) => this.onLoadComplete(level)} />
                </div>
            </div>
        );
    }
}

export default Level;