import React from 'react';
import Entity from "../Entity";
import Direction from "../utils/Direction";
import PropTypes from 'prop-types';
import DataSourceComponent from "../DataSourceComponent";
import {default as GhostModel} from "../model/actors/Ghost";
import Cell from "../Cell";

class Ghost extends DataSourceComponent {

    constructor(props) {
        super(props);

        this.state.direction = Direction.LEFT;
    }

    get ghost() {
        return this.dataSource;
    }

    getEntityStyle(currentGridLocation) {
        let toRet = {
            display: "none"
        };

        if (currentGridLocation.isValid) {
            // let cellModel = this.level.gameMatrix[spawnLocation.y][spawnLocation.x];
            let cellLocation = Cell.getCellLocation(currentGridLocation);

            toRet.display = "block";
            toRet.position = "absolute";
            toRet.top =  (cellLocation.y - 2) + "px";
            toRet.left = (cellLocation.x - 2) + "px";
            toRet.pointerEvents = "none";
            if (!this.ghost.editMode) {
                let transitionStr = "top " + this.ghost.cellTransitionDuration + "s," +
                    " left " + this.ghost.cellTransitionDuration + "s";
                toRet.webKitTransition = transitionStr; /* Safari */
                toRet.transition = transitionStr;
            }
        }

        return toRet;
    }

    getGhostEntityColor() {
        if (this.ghost.scaredState === GhostModel.SCARED_STATE_SCARED) {
            return Entity.DESIGNATOR_SCARED_GHOST;
        }

        if (this.ghost.scaredState === GhostModel.SCARED_STATE_SCARED_FLASH) {
            return Entity.DESIGNATOR_FLASH_GHOST;
        }

        switch (this.ghost.color) {
            case GhostModel.RED:
                return Entity.DESIGNATOR_RED_GHOST;
            case GhostModel.BLUE:
                return Entity.DESIGNATOR_BLUE_GHOST;
            case GhostModel.PINK:
                return Entity.DESIGNATOR_PINK_GHOST;
            case GhostModel.ORANGE:
                return Entity.DESIGNATOR_ORANGE_GHOST;
            default:
                throw new Error("Unknown ghost color found.");
        }
    }

    render() {
        return (
            <div className="Ghost" style={this.getEntityStyle(this.ghost.location)}>
                <Entity designator={this.getGhostEntityColor()}
                            modifier={this.ghost.direction}
                            animating={this.props.animating} />
            </div>);
    }
}

Ghost.propTypes = {
    dataSource: PropTypes.instanceOf(GhostModel).isRequired,
    animating: PropTypes.bool
};

Ghost.defaultProps = {
    animating: true
};

export default Ghost;