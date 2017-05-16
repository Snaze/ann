import { default as LevelModel } from "./model/Level";
import React, { Component } from 'react';
import './Level.css';
import Cell from "./Cell";
import BorderType from "./model/BorderType";
import {default as CellModel} from "./model/Cell";
import ContextMenu from "./ContextMenu";
import LevelEditPanel from "./LevelEditPanel";

class Level extends Component {
    constructor(props) {
        super(props);

        this.state = {
            level: new LevelModel(),
            contextMenu: {
                display: "none",
                position: "absolute",
                top: "0px",
                left: "0px",
                activeCell: new CellModel("-1_-1")
            }
        };
    }

    componentDidMount() {

    }

    componentWillUnmount() {

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

        let newState = {
            contextMenu: {
                display: "inline",
                position: "absolute",
                top: e.pageY + "px",
                left: e.pageX + "px",
                activeCell: cellModel
            }
        };

        this.setState(newState);
    }

    contextMenuDismiss(e) {
        let cellId = this.state.contextMenu.activeCell.id;
        let theArray = cellId.split("_");
        let y = theArray[0];
        let x = theArray[1];

        let cellModel = this.state.level.gameMatrix[y][x];
        if (cellModel.id !== cellId) {
            throw new Error("Mismatched cell Ids");
        }

        let newState = {
            contextMenu: {
                display: "none",
                position: "absolute",
                top: "0px",
                left: "0px",
                activeCell: cellModel
            }
        };

        this.setState(newState);
    }

    onContextMenuChange(activeCell) {

        this.setState({
            contextMenu: {
                display: this.state.contextMenu.display,
                position: this.state.contextMenu.position,
                top: this.state.contextMenu.top,
                left: this.state.contextMenu.left,
                activeCell: activeCell
            }
        });
    }

    renderCells(rowIndex) {
        let toRet = [];

        for (let colIndex = 0; colIndex < this.state.level.gameMatrix[rowIndex].length; colIndex++) {
            let currentCell = this.state.level.gameMatrix[rowIndex][colIndex];
            toRet.push(<Cell key={"Cell_" + currentCell.id}
                             y={rowIndex}
                             x={colIndex}
                             borderLeft={currentCell.getSolidBorder(BorderType.LEFT)}
                             borderTop={currentCell.getSolidBorder(BorderType.TOP)}
                             borderRight={currentCell.getSolidBorder(BorderType.RIGHT)}
                             borderBottom={currentCell.getSolidBorder(BorderType.BOTTOM)}
                             dotType={currentCell.dotType}
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

    contextMenuStyle() {
        return {
            display: this.state.contextMenu.display,
            position: this.state.contextMenu.position,
            left: this.state.contextMenu.left,
            top: this.state.contextMenu.top
        };
    }

    onLevelEditPanelUpdate(theLevel) {
        this.setState({
            level: theLevel
        });
    }

    render() {
        return (
            <div>
                <table className="Level" cellPadding={0} cellSpacing={0}>
                    <tbody>{this.renderRows()}</tbody>
                </table>
                <div style={this.contextMenuStyle()}>
                    <ContextMenu onDismiss={(e) => this.contextMenuDismiss(e)}
                                 onChange={(e) => this.onContextMenuChange(e)}
                                 cell={this.state.contextMenu.activeCell} />
                </div>
                <div className="LevelEditorPanel">
                    <LevelEditPanel width={this.state.level.width}
                                    height={this.state.level.height}
                                    level={this.state.level}
                                    onUpdate={(l) => this.onLevelEditPanelUpdate(l)} />
                </div>
            </div>
        );
    }
}

export default Level;