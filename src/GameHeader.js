import React from 'react';
import DataSourceComponent from "./DataSourceComponent";
import "./GameHeader.css";
import PropTypes from 'prop-types';
import Player from "./model/actors/Player";

class GameHeader extends DataSourceComponent {
    // constructor(props) {
    //     super (props);
    //
    //
    // }

    get player() {
        return this.dataSource;
    }

    render() {
        return (<thead>
            <tr className="GameHeader">
                <th className="GameHeaderCell">
                    1UP
                </th>
                <th className="GameHeaderCell">
                    HI-SCORE
                </th>
                <th className="GameHeaderCell">
                    2UP
                </th>
            </tr>
            <tr className="GameHeaderData">
                <th className="GameHeaderCell">
                    {this.player.score}
                </th>
                <th className="GameHeaderCell">
                    0
                </th>
                <th className="GameHeaderCell">
                    0
                </th>
            </tr>
        </thead>);
    }
}

GameHeader.propTypes = {
    dataSource: PropTypes.instanceOf(Player).isRequired
};

export default GameHeader;

