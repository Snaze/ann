import React from 'react';
import Entity from "../Entity";
import Direction from "../utils/Direction";
import PropTypes from 'prop-types';
import DataSourceComponent from "../DataSourceComponent";
import {default as GhostModel} from "../model/Ghost";
import {default as LevelModel} from "../model/Level";
import Cell from "../Cell";

class Ghost extends DataSourceComponent {

    constructor(props) {
        super(props);

        this.state.direction = Direction.LEFT;
    }

    get ghost() {
        return this.dataSource;
    }

    getEntityStyle(spawnLocation) {
        let toRet = {
            display: "none"
        };

        if (spawnLocation.isValid) {
            // let cellModel = this.level.gameMatrix[spawnLocation.y][spawnLocation.x];
            let cellLocation = Cell.getCellLocation(spawnLocation);

            toRet.display = "block";
            toRet.position = "absolute";
            toRet.top =  (cellLocation.y - 2) + "px";
            toRet.left = (cellLocation.x - 2) + "px";
            toRet.pointerEvents = "none";
        }

        return toRet;
    }

    getGhostEntityColor() {
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
    level: PropTypes.instanceOf(LevelModel).isRequired,
    animating: PropTypes.bool
};

Ghost.defaultProps = {
    animating: true
};

export default Ghost;