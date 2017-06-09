import React from 'react';
import './MainMenu.css';
import KeyEventer from "../utils/KeyEventer";
import Entity from "../Entity";
import PropTypes from 'prop-types';
import DataSourceComponent from "../DataSourceComponent";
import {default as MainMenuModel} from "../model/menus/MainMenu";

class MainMenu extends DataSourceComponent {

    constructor(props) {
        super(props);

        this.keyDownRef = (e) => this.keyDown(e);
    }

    get mainMenu() {
        return this.dataSource;
    }

    componentDidMount() {
        super.componentDidMount();

        KeyEventer.instance.addCallback(this.keyDownRef, KeyEventer.CALLBACK_KEYDOWN);
    }

    componentWillUnmount() {
        super.componentWillUnmount();

        KeyEventer.instance.removeCallback(this.keyDownRef, KeyEventer.CALLBACK_KEYDOWN);
    }

    togglePlayer() {
        let currentSelectedPlayer = this.mainMenu.selectedPlayer;
        let otherPlayer = MainMenuModel.SELECTED_PLAYERS_2;
        if (currentSelectedPlayer === 2) {
            otherPlayer = MainMenuModel.SELECTED_PLAYERS_1;
        }

        this.mainMenu.selectedPlayer = otherPlayer;
    }

    keyDown(key) {

        switch(key) {
            case "ArrowUp":
                this.togglePlayer();
                break;
            case "ArrowDown":
                this.togglePlayer();
                break;
            case "Enter":
            case " ":
                this.mainMenu.selectionConfirmed = true;
                break;
            default:
                break;
        }

    }

    getSelectionSpan(theNum) {
        if (this.mainMenu.selectedPlayer === theNum) {
            return (<span className="MainMenuBlink">»</span>)
        }

        return null;
    }

    getComingSoonStyle() {
        let toRet = {
            display: "inline-block",
            visibility: "hidden"
        };

        if (this.mainMenu.selectedPlayer === 2) {
            toRet["visibility"] = "visible"
        }

        return toRet;
    }

    render() {
        return (<div className="MainMenu">
            <div className="MainMenuHeader">pac-man</div>
            <div className="MainMenuAnimation">
                <div className="MainMenuAnimationItem">
                    <Entity designator={Entity.DESIGNATOR_PINK_GHOST}
                            modifier={Entity.MODIFIER_DIRECTION_RIGHT}
                            animating={true} />
                </div>
                <div className="MainMenuAnimationItem">
                    <Entity designator={Entity.DESIGNATOR_ORANGE_GHOST}
                            modifier={Entity.MODIFIER_DIRECTION_RIGHT}
                            animating={true} />
                </div>
                <div className="MainMenuAnimationItem">
                    <Entity designator={Entity.DESIGNATOR_BLUE_GHOST}
                            modifier={Entity.MODIFIER_DIRECTION_RIGHT}
                            animating={true} />
                </div>
                <div className="MainMenuAnimationItem">
                    <Entity designator={Entity.DESIGNATOR_RED_GHOST}
                            modifier={Entity.MODIFIER_DIRECTION_RIGHT}
                            animating={true} />
                </div>
                <div className="MainMenuAnimationItemBlank">

                </div>
                <div className="MainMenuAnimationItem">
                    <Entity designator={Entity.DESIGNATOR_PAC_MAN}
                            modifier={Entity.MODIFIER_DIRECTION_RIGHT}
                            animating={true} />
                </div>
                <div className="MainMenuAnimationItem">
                    <Entity designator={Entity.DESIGNATOR_MRS_PAC_MAN}
                            modifier={Entity.MODIFIER_DIRECTION_RIGHT}
                            animating={true} />
                </div>
            </div>
            <div className="MainMenuItems">
                <table>
                    <tbody>
                        <tr>
                            <td className="MainMenuTableCellLeft">
                                {this.getSelectionSpan(1)}
                            </td>
                            <td className="MainMenuTableCellRight">
                                <div>1 Player</div>
                            </td>
                        </tr>
                        <tr>
                            <td className="MainMenuTableCellLeft">
                                {this.getSelectionSpan(2)}
                            </td>
                            <td className="MainMenuTableCellRight">
                                <div style={{display: "inline", whiteSpace: "noWrap"}}>
                                    <div style={{display: "inline-block"}}>2 Players</div>
                                    <div style={this.getComingSoonStyle()} className="MainMenuComingSoon">
                                        &nbsp;&nbsp;(coming soon)
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>);
    }
}

MainMenu.propTypes = {
    dataSource: PropTypes.instanceOf(MainMenuModel).isRequired
};

export default MainMenu;