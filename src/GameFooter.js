import React from 'react';
import DataSourceComponent from "./DataSourceComponent";
import "./GameFooter.css";
import PropTypes from 'prop-types';
import {default as GameFooterModel} from "./model/GameFooter";
import Entity from "./Entity";
import Player from "./model/actors/Player";

const modifierMap = {
    "Cherry": Entity.MODIFIER_POWER_UP_CHERRY,
    "Strawberry": Entity.MODIFIER_POWER_UP_STRAWBERRY,
    "Orange": Entity.MODIFIER_POWER_UP_PEACH, // TODO: FIX THE NAME OF THIS
    "Pretzel": Entity.MODIFIER_POWER_UP_PRETZEL,
    "Apple": Entity.MODIFIER_POWER_UP_APPLE,
    "Pear": Entity.MODIFIER_POWER_UP_PEAR,
    "Banana": Entity.MODIFIER_POWER_UP_BANANA
};

class GameFooter extends DataSourceComponent {

    // constructor(props) {
    //     super(props);
    //
    //     // this.debug = true;
    // }

    get gameFooter() {
        return this.dataSource;
    }

    getLifeDesignator() {
        let activePlayerGender = this.gameFooter.getActivePlayerGender();

        if (activePlayerGender === Player.MR_PAC_MAN) {
            return Entity.DESIGNATOR_PAC_MAN;
        }

        return Entity.DESIGNATOR_MRS_PAC_MAN;
    }

    getLifeEntities() {
        let toRet = [];

        for (let i = 0; i < this.gameFooter.numLives; i++) {
            toRet.push(<div key={"LifeEntity_" + i} style={{display: "inline-block"}}>
                <Entity designator={this.getLifeDesignator()}
                               modifier={Entity.MODIFIER_DIRECTION_LEFT}
                                animating={false} />
            </div>);
        }

        return toRet;
    }

    _getModifierByPowerUpName(powerUpName) {
        return modifierMap[powerUpName];
    }

    getPowerUpEntities() {
        let toRet = [];
        let self = this;

        this.gameFooter.powerUps.forEach(function (powerUpName, index) {
            toRet.push(<div key={"PowerUpEntity_" + index} style={{display: "inline-block"}}>
                <Entity designator={Entity.DESIGNATOR_POWER_UP}
                        modifier={self._getModifierByPowerUpName(powerUpName)}
                        animating={false} />
            </div>);
        });

        return toRet;
    }

    getPlayerState() {
        if (this.gameFooter.getPlayer().aiMode) {
            return (<td className="GameFooterCenter">
                <div style={{display: "inline"}}>State: {this.gameFooter.playerState}</div>
            </td>);
        }

        return null;
    }

    render() {
        return (<div className="GameFooter"><table className="GameFooterTable">
            <tbody>
                <tr className="GameFooterRow">
                    <td className="GameFooterLeft">
                        <div style={{display: "inline"}}>
                            {this.getLifeEntities()}
                        </div>
                    </td>
                    {this.getPlayerState()}
                    <td className="GameFooterRight">
                        <div style={{display: "inline"}}>
                            {this.getPowerUpEntities()}
                        </div>
                    </td>
                </tr>
            </tbody>
        </table></div>);
    }
}

GameFooter.propTypes = {
    dataSource: PropTypes.instanceOf(GameFooterModel).isRequired
};

export default GameFooter;