import React, { Component } from 'react';
import './GameBoard.css';
import Level1 from "./levels/Level1.json"
import Square from "./Square"

class GameBoard extends Component {
    componentDidMount() {

    }

    componentWillUnmount() {

    }

    renderSquare(levelBlock, rowIndex, colIndex) {

        let key = "level_block_" + rowIndex + "_" + colIndex;

        return (
            <Square key={key}
                    borderLeft={levelBlock.left === true ? 1: 0}
                    borderRight={levelBlock.right === true ? 1: 0}
                    borderTop={levelBlock.top === true ? 1: 0}
                    borderBottom={levelBlock.bottom === true ? 1: 0}
                    width="30"
                    height="30"
                    littleDotDisplay={levelBlock.dot === "little" ? "block": "none"}
                    bigDotDisplay={levelBlock.dot === "big" ? "block": "none"} />
        );
    }

    squares() {
        let toRet = []

        for (let rowIndex = 0; rowIndex < Level1.length; rowIndex++) {
            for (let colIndex = 0; colIndex < Level1[rowIndex].length; colIndex++) {
                toRet.push(this.renderSquare(Level1[rowIndex][colIndex], rowIndex, colIndex));
            }
        }

        return toRet;
    }

    render() {
        return (
            <div className="GameBoard">
                {this.squares()}
            </div>
        );
    }
}

export default GameBoard;