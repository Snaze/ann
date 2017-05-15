import { default as LevelModel } from "./model/Level";
import React, { Component } from 'react';
import './Level.css';
import Cell from "./Cell";
import BorderType from "./model/BorderType";

class Level extends Component {
    constructor(props) {
        super(props);

        this.state = new LevelModel();
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    renderCells(rowIndex) {
        let toRet = [];

        for (let colIndex = 0; colIndex < this.state.gameMatrix[rowIndex].length; colIndex++) {
            let currentCell = this.state.gameMatrix[rowIndex][colIndex];
            toRet.push(<Cell key={"Cell_" + currentCell.id}
                             y={rowIndex}
                             x={colIndex}
                             borderLeft={currentCell.getSolidBorder(BorderType.LEFT)}
                             borderTop={currentCell.getSolidBorder(BorderType.TOP)}
                             borderRight={currentCell.getSolidBorder(BorderType.RIGHT)}
                             borderBottom={currentCell.getSolidBorder(BorderType.BOTTOM)}
                             dotType={currentCell.dotType} />);
        }

        return toRet;
    }

    renderRows() {
        let toRet = [];

        for (let rowIndex = 0; rowIndex < this.state.gameMatrix.length; rowIndex++) {
            let key = "Level_row_" + rowIndex;
            toRet.push(<tr key={key}>{this.renderCells(rowIndex)}</tr>);
        }

        return toRet;
    }

    render() {
        return (
            <table className="Level" cellPadding={0} cellSpacing={0}>
                <tbody>{this.renderRows()}</tbody>
            </table>
        );
    }
}

export default Level;