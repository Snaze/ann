import React from 'react';
import PropTypes from 'prop-types';
import DataSourceComponent from "../DataSourceComponent";
import {default as PowerUpModel} from "../model/actors/PowerUp";
import Cell from "../Cell";
import Entity from "../Entity";

class PowerUp extends DataSourceComponent {

    static _powerUpMap = null;
    static get powerUpMap() {
        if (PowerUp._powerUpMap === null) {
            PowerUp._powerUpMap = {};
            PowerUp._powerUpMap[PowerUpModel.POWER_UP_CHERRY] = Entity.MODIFIER_POWER_UP_CHERRY;
            PowerUp._powerUpMap[PowerUpModel.POWER_UP_APPLE] = Entity.MODIFIER_POWER_UP_APPLE;
            PowerUp._powerUpMap[PowerUpModel.POWER_UP_BANANA] = Entity.MODIFIER_POWER_UP_BANANA;
            PowerUp._powerUpMap[PowerUpModel.POWER_UP_ORANGE] = Entity.MODIFIER_POWER_UP_PEACH;
            PowerUp._powerUpMap[PowerUpModel.POWER_UP_PEAR] = Entity.MODIFIER_POWER_UP_PEAR;
            PowerUp._powerUpMap[PowerUpModel.POWER_UP_PRETZEL] = Entity.MODIFIER_POWER_UP_PRETZEL;
            PowerUp._powerUpMap[PowerUpModel.POWER_UP_STRAWBERRY] = Entity.MODIFIER_POWER_UP_STRAWBERRY;
        }

        return PowerUp._powerUpMap;
    }

    get powerup() {
        return this.dataSource;
    }

    get location() {
        return this.powerup.location;
    }

    get level() {
        return this.props.level;
    }

    getEntityStyle(currentGridLocation) {
        let toRet = {
            display: "none"
        };

        if (!this.powerup.isAlive) {
            return toRet;
        }

        if (currentGridLocation.isValid) {
            let cellLocation = Cell.getCellLocation(currentGridLocation);

            toRet.display = "block";
            toRet.position = "absolute";
            toRet.top =  (cellLocation.y - 2) + "px";
            toRet.left = (cellLocation.x - 2) + "px";
            toRet.pointerEvents = "none";
            if (!this.powerup.editMode) {
                let transitionStr = "top " + this.powerup.cellTransitionDuration + "s," +
                    " left " + this.powerup.cellTransitionDuration + "s";
                toRet.webKitTransition = transitionStr; /* Safari */
                toRet.transition = transitionStr;
            }
        }

        return toRet;
    }

    render() {
        return (
            <div className="PowerUp" style={this.getEntityStyle(this.powerup.location)}>
                <Entity designator={Entity.DESIGNATOR_POWER_UP}
                        modifier={PowerUp.powerUpMap[this.powerup.powerUpType]}
                        animating={this.props.animating}
                        blink={this.powerup.blink} />
            </div>);
    }
}

PowerUp.propTypes = {
    dataSource: PropTypes.instanceOf(PowerUpModel).isRequired,
    animating: PropTypes.bool
};

PowerUp.defaultProps = {
    animating: true
};

export default PowerUp;