import React from 'react';
import DataSourceComponent from "./DataSourceComponent";
import "./GameHeader.css";
import PropTypes from 'prop-types';
import {default as GameHeaderModel} from "./model/GameHeader";
// import Player from "./model/actors/Player";

class GameHeader extends DataSourceComponent {
    // constructor(props) {
    //     super (props);
    //
    //     // this.propsToAccept.push("_score");
    //     // this.debug = true;
    // }

    get gameHeader() {
        return this.dataSource;
    }

    render() {
        return (<table className="GameHeaderTable">
            <tbody>
                <tr className="GameHeader">
                    <td className="GameHeaderCell">
                        1UP
                    </td>
                    <td className="GameHeaderCell">
                        HI-SCORE
                    </td>
                    <td className="GameHeaderCell">
                        2UP
                    </td>
                </tr>
                <tr className="GameHeaderData">
                    <td className="GameHeaderCell">
                        {this.gameHeader.player1Score}
                    </td>
                    <td className="GameHeaderCell">
                        {this.gameHeader.highScore}
                    </td>
                    <td className="GameHeaderCell">
                        {this.gameHeader.player2Score}
                    </td>
                </tr>
            </tbody>
        </table>);
    }
}

GameHeader.propTypes = {
    dataSource: PropTypes.instanceOf(GameHeaderModel).isRequired
};

export default GameHeader;

