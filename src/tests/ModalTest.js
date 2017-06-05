import React, {Component} from 'react';
import Modal from "../Modal";
import {default as ModalModel} from "../model/Modal";

class ModalTest extends Component {

    constructor(props) {
        super(props);

        this.state = {
            lastButtonClicked: ""
        };

        this._modal = new ModalModel();
        this._modal.buttonClick = (e) => this.modalButtonClick(e);
    }

    get buttonText() {
        if (!this._modal.show) {
            return "Show";
        }

        return "Hide";
    }

    onClick(e) {
        this._modal.show = !this._modal.show;
    }

    modalButtonClick(e) {
        if (e.buttonType === Modal.BUTTON_YES) {
            this.setState({
                lastButtonClicked: "YES"
            });
            this._modal.show = false;
        } else {
            this.setState({
                lastButtonClicked: "NO"
            });
            this._modal.show = false;
        }
    }

    render() {
        return (<div>
            <div>Last Button Clicked: {this.state.lastButtonClicked}</div>
            <button onClick={(e) => this.onClick(e)} >{this.buttonText}</button>
            <Modal dataSource={this._modal}>
                <div>
                    WOULD YOU LIKE TO PLAY AGAIN
                </div>
            </Modal>
        </div>);
    }

}

export default ModalTest;