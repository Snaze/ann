import React, {Component} from 'react';
import Entity from "../Entity";
import Direction from "../utils/Direction";
import PropTypes from 'prop-types';

class Ghost extends Component {

    static get RED() { return Entity.DESIGNATOR_RED_GHOST; }
    static get BLUE() { return Entity.DESIGNATOR_BLUE_GHOST; }
    static get PINK() { return Entity.DESIGNATOR_PINK_GHOST; }
    static get ORANGE() { return Entity.DESIGNATOR_ORANGE_GHOST; }

    constructor(props) {
        super(props);

        this.state = {
            direction: Direction.LEFT
        };

    }

    render() {
        return (<Entity designator={this.props.color}
                        modifier={this.state.direction}
                        animating={this.props.animating} />);
    }
}

Ghost.propTypes = {
    color: PropTypes.string.isRequired,
    animating: PropTypes.bool
};

Ghost.defaultProps = {
    animating: true
};

export default Ghost;