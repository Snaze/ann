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
        if (this.gameModal.mode === GameModalModel.MODAL_MODE_GAME_OVER) {
            return (<div className="GameModalGameOver">{this.gameModal.gameOverText}</div>);
        }

        return (<CountDownMenu dataSource={this.gameModal.countDownMenu} />);
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