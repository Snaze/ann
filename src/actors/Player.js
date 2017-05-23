import React from 'react';
import Entity from "../Entity";
import Direction from "../utils/Direction";
import PropTypes from 'prop-types';
import DataSourceComponent from "../DataSourceComponent";
import {default as PlayerModel} from "../model/Player";
import {default as LevelModel} from "../model/Level";
import Cell from "../Cell";
import KeyEventer from "../utils/KeyEventer";

class Player extends DataSourceComponent {

    constructor(props) {
        super(props);

        this.state.direction = Direction.LEFT;
        this.state.cellTransitionDuration = 0.5; // seconds
        this._keyEventer = new KeyEventer();
    }

    /** KEY EVENTER EVENTS - START **/

    onKeyDown(key) {
        if (this.level.editMode) {
            return;
        }

        // let currentCell = this.level.selectedCell;
        // let newSelectedCell = null;

        switch (key) {
            case "ArrowDown":
                if ((this.location.y + 1) < this.level.height) {
                    this.location.y = this.location.y + 1;
                } else {
                    this.location.y = 0;
                }
                this.player.direction = Direction.DOWN;
                break;
            case "ArrowUp":
                if ((this.location.y - 1) >= 0) {
                    this.location.y = this.location.y - 1;
                } else {
                    this.location.y = this.level.height - 1;
                }
                this.player.direction = Direction.UP;
                break;
            case "ArrowLeft":
                if ((this.location.x - 1) >= 0) {
                    this.location.x = this.location.x - 1;
                } else {
                    this.location.x = this.level.width - 1;
                }
                this.player.direction = Direction.LEFT;
                break;
            case "ArrowRight":
                if ((this.location.x + 1) < this.level.width) {
                    this.location.x = this.location.x + 1;
                } else {
                    this.location.x = 0;
                }
                this.player.direction = Direction.RIGHT;
                break;
            default:
                break;
        }
    }

    onKeyUp(key) {

    }

    /** KEY EVENTER EVENTS - END **/

    componentDidMount() {
        super.componentDidMount();

        this._keyEventer.bindEvents(document.body, (e) => this.onKeyDown(e), (e) => this.onKeyUp(e));
    }

    componentWillUnmount() {
        super.componentWillUnmount();

        let ds = this.dataSource;
        ds.removeOnChangeCallback(this._callback);

        this._keyEventer.unBindEvents();
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
                let transitionStr = "top " + this.state.cellTransitionDuration + "s," +
                    " left " + this.state.cellTransitionDuration + "s";
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