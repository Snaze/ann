import React from 'react';
import './MainMenu.css';
import KeyEventer from "../utils/KeyEventer";
import Entity from "../Entity";
import PropTypes from 'prop-types';
import DataSourceComponent from "../DataSourceComponent";
import {default as MainMenuModel} from "../model/menus/MainMenu";
import { assert } from "../utils/Assert";
import GameMode from "../model/GameMode";

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

    /**
     * This will change the selection
     * @param isUp {boolean} True if up arrow pushed.  False otherwise
     */
    toggleSelection(isUp) {
        let currentSelection = this.mainMenu.selectedValue;
        if (isUp) {
            currentSelection--;
        } else {
            currentSelection++;
        }
        let firstValue = GameMode.ALL[0];
        let lastValue = GameMode.ALL[GameMode.ALL.length - 1];

        assert (lastValue >= firstValue, "Last Value must be greater than or equal first value");

        if (currentSelection < firstValue) {
            currentSelection = lastValue;
        } else if (currentSelection > lastValue) {
            currentSelection = firstValue;
        } else if (lastValue === firstValue) {
            currentSelection = firstValue;
        }

        this.mainMenu.selectedValue = currentSelection;
    }

    keyDown(key) {

        switch(key) {
            case "ArrowUp":
                this.toggleSelection(true);
                break;
            case "ArrowDown":
                this.toggleSelection(false);
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
        if (this.mainMenu.selectedValue === theNum) {
            return (<span className="MainMenuBlink">»</span>)
        }

        return null;
    }

    getComingSoonStyle() {
        let toRet = {
            display: "inline-block",
            visibility: "hidden"
        };

        if (this.mainMenu.selectedValue === 2) {
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
                                {this.getSelectionSpan(0)}
                            </td>
                            <td className="MainMenuTableCellRight">
                                <div>Play!</div>
                            </td>
                        </tr>
                        <tr>
                            <td className="MainMenuTableCellLeft">
                                {this.getSelectionSpan(1)}
                            </td>
                            <td className="MainMenuTableCellRight">
                                <div>Train Player</div>
                            </td>
                        </tr>
                        <tr>
                            <td className="MainMenuTableCellLeft">
                                {this.getSelectionSpan(2)}
                            </td>
                            <td className="MainMenuTableCellRight">
                                <div>Watch Player</div>
                            </td>
                        </tr>
                        <tr>
                            <td className="MainMenuTableCellLeft">
                                {this.getSelectionSpan(3)}
                            </td>
                            <td className="MainMenuTableCellRight">
                                <div>Watch Pre-Trained Player</div>
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