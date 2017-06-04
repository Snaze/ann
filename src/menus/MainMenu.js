import React, {Component} from 'react';
import './MainMenu.css';
import KeyEventer from "../utils/KeyEventer";
import Entity from "../Entity";
import PropTypes from 'prop-types';

class MainMenu extends Component {

    constructor(props) {
        super(props);

        this.state = {
            selectedPlayer: 1
        };
        this.keyDownRef = (e) => this.keyDown(e);
    }

    componentDidMount() {
        KeyEventer.instance.addCallback(this.keyDownRef, KeyEventer.CALLBACK_KEYDOWN);
    }

    componentWillUnmount() {
        KeyEventer.instance.removeCallback(this.keyDownRef, KeyEventer.CALLBACK_KEYDOWN);
    }

    togglePlayer() {
        let currentSelectedPlayer = this.state.selectedPlayer;
        let otherPlayer = 2;
        if (currentSelectedPlayer === 2) {
            otherPlayer = 1;
        }

        this.setState({
            selectedPlayer: otherPlayer
        });
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
                if (this.props.onSelectionCallback) {
                    this.props.onSelectionCallback({
                        selectedPlayer: this.state.selectedPlayer
                    });
                }
                break;
            default:
                break;
        }

    }

    getSelectionSpan(theNum) {
        if (this.state.selectedPlayer === theNum) {
            return (<span className="MainMenuBlink">»</span>)
        }

        return null;
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
                            <td>
                                {this.getSelectionSpan(1)}
                            </td>
                            <td>
                                <div>1 Player</div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                {this.getSelectionSpan(2)}
                            </td>
                            <td>
                                <div>2 Players</div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>);
    }
}

MainMenu.propTypes = {
    onSelectionCallback: PropTypes.func.isRequired
};

export default MainMenu;