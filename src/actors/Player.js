import React, {Component} from 'react';
import Entity from "../Entity";
import Direction from "../utils/Direction";
import GameState from "../model/GameState";
import PropTypes from 'prop-types';

class Player extends Component {

    static get MR_PAC_MAN() { return Entity.DESIGNATOR_PAC_MAN; }
    static get MRS_PAC_MAN() { return Entity.DESIGNATOR_MRS_PAC_MAN; }

    constructor(props) {
        super(props);

        this.state = {
            direction: Direction.LEFT
        };

    }

    render() {
        return (<Entity designator={this.props.gender || Player.MR_PAC_MAN}
                       modifier={this.state.direction}
                       stepNumber={this.props.stepNumber} />);
    }
}

Player.propTypes = {
    gender: PropTypes.string.isRequired,
    stepNumber: PropTypes.number.isRequired
};

export default Player;