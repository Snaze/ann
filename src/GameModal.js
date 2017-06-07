import React from 'react';
import DataSourceComponent from "./DataSourceComponent";
import "./GameModal.css";
import PropTypes from 'prop-types';
import {default as GameModalModel} from "./model/GameModal";
import Modal from "./Modal";
import CountDownMenu from "./menus/CountDownMenu";

class GameModal extends DataSourceComponent {

    get gameModal() {
        return this.dataSource;
    }

    getModalContent() {

        switch (this.gameModal.mode) {
            case GameModalModel.MODAL_MODE_GAME_OVER:
                return (<div className="GameModalTextContent">{this.gameModal.gameOverText}</div>);
            case GameModalModel.MODAL_MODE_COUNTDOWN:
                return (<CountDownMenu dataSource={this.gameModal.countDownMenu} />);
            case GameModalModel.MODAL_MODE_GAME_PAUSED:
                return (<div className="GameModalTextContent">{this.gameModal.pausedText}</div>);
            default:
                throw new Error("Unknown gameModel.mode entered");
        }
    }

    render() {
        return (<Modal dataSource={this.gameModal.modal}>
            <div style={{paddingTop: "50px"}}>
                {this.getModalContent()}
            </div>
        </Modal>);
    }

}

GameModal.propTypes = {
    dataSource: PropTypes.instanceOf(GameModalModel).isRequired
};

export default GameModal;