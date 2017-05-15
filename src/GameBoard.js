import React, { Component } from 'react';
import './GameBoard.css';
import Level1 from "./levels/Level1.json"

class GameBoard extends Component {
    componentDidMount() {

    }

    componentWillUnmount() {

    }

    renderCellContents(levelBlock) {
        if (levelBlock.dot === "little") {
            return (<span>.</span>);
        } else if (levelBlock.dot === "big") {
            return (<span>O</span>);
        } else if (levelBlock.dot !== "") {
            throw new Error('unknown levelBlock.dot');
        }
    }

    renderCell(levelBlock, rowIndex, colIndex) {

        let key = "level_block_" + rowIndex + "_" + colIndex;
        let style = {
            borderLeft : levelBlock.left === true ? "Solid 2px #87CEEB": "none",
            borderRight : levelBlock.right === true ? "Solid 2px #87CEEB": "none",
            borderTop : levelBlock.top === true ? "Solid 2px #87CEEB": "none",
            borderBottom : levelBlock.bottom === true ? "Solid 2px #87CEEB": "none"
        };

        let width = 32;
        if (levelBlock.left) {
            width -= 2;
        }
        if (levelBlock.right) {
            width -= 2;
        }

        let height = 32;
        if (levelBlock.top) {
            height -= 2;
        }
        if (levelBlock.bottom) {
            height -= 2;
        }

        return (<td className="GameBoardSquare"
                    key={key}
                    style={style}
                    width={width}
                    height={height}>{this.renderCellContents(levelBlock)}</td>);
    }

    renderCells(rowIndex) {
        let toRet = [];

        for (let colIndex = 0; colIndex < Level1[rowIndex].length; colIndex++) {
            toRet.push(this.renderCell(Level1[rowIndex][colIndex], rowIndex, colIndex));
        }

        return toRet;
    }

    renderRows() {
        let toRet = [];

        for (let rowIndex = 0; rowIndex < Level1.length; rowIndex++) {
            let key = "GameBoard_row_" + rowIndex;
            toRet.push(<tr key={key}>{this.renderCells(rowIndex)}</tr>);
        }

        return toRet;
    }

    render() {
        return (
            <table className="GameBoard" cellPadding={0} cellSpacing={0}>
                <tbody>{this.renderRows()}</tbody>
            </table>
        );
    }
}

export default GameBoard;