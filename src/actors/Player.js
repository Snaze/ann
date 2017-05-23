import React from 'react';
import Entity from "../Entity";
import Direction from "../utils/Direction";
import PropTypes from 'prop-types';
import DataSourceComponent from "../DataSourceComponent";
import {default as PlayerModel} from "../model/Player";
import {default as LevelModel} from "../model/Level";
import Cell from "../Cell";

class Player extends DataSourceComponent {

    constructor(props) {
        super(props);

        this.propsToIgnore.push("_nextDirection");
    }

    timerCallback(e) {

    }


    componentDidMount() {
        super.componentDidMount();

    }

    componentWillUnmount() {
        super.componentWillUnmount();

        let ds = this.dataSource;
        ds.removeOnChangeCallback(this._callback);
    }

    get player() {
        return this.dataSource;
    }

    get location() {
        return this.player.location;
    }

    get level() {
        return this.props.level;
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
            if (!this.level.editMode) {
                let transitionStr = "top " + this.player.cellTransitionDuration + "s," +
                    " left " + this.player.cellTransitionDuration + "s";
                toRet.webKitTransition = transitionStr; /* Safari */
                toRet.transition = transitionStr;
            }
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
    level: PropTypes.instanceOf(LevelModel).isRequired,
    animating: PropTypes.bool
};

Player.defaultProps = {
    animating: true
};

export default Player;