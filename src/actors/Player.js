import React from 'react';
import Entity from "../Entity";
import Direction from "../utils/Direction";
import PropTypes from 'prop-types';
import DataSourceComponent from "../DataSourceComponent";
import {default as PlayerModel} from "../model/Player";
import Cell from "../Cell";

class Player extends DataSourceComponent {

    constructor(props) {
        super(props);

        this.state.direction = Direction.LEFT;
        this.debug = true;
    }

    get player() {
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

    getPlayerEntityGender() {
        switch (this.player.gender) {
            case PlayerModel.MR_PAC_MAN:
                return Entity.DESIGNATOR_PAC_MAN;
            case PlayerModel.MRS_PAC_MAN:
                return Entity.DESIGNATOR_MRS_PAC_MAN;
            default:
                throw new Error("Unknown player gender found");
        }
    }

    render() {
        return (
            <div className="Player" style={this.getEntityStyle(this.player.location)}>
                <Entity designator={this.getPlayerEntityGender()}
                            modifier={this.player.direction}
                            animating={this.props.animating} />
            </div>);
    }
}

Player.propTypes = {
    dataSource: PropTypes.instanceOf(PlayerModel).isRequired,
    animating: PropTypes.bool
};

Player.defaultProps = {
    animating: true
};

export default Player;