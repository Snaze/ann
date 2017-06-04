import React, {Component} from 'react';
import Modal from "../Modal";

class ModalTest extends Component {

    constructor(props) {
        super(props);

        this.state = {
            show: false,
            lastButtonClicked: ""
        };
    }

    get buttonText() {
        if (!this.state.show) {
            return "Show";
        }

        return "Hide";
    }

    onClick(e) {
        this.setState({
            show: !this.state.show
        });
    }

    modalButtonClick(e) {
        if (e.buttonType === Modal.BUTTON_YES) {
            this.setState({
                lastButtonClicked: "YES",
                show: false
            });
        } else {
            this.setState({
                lastButtonClicked: "NO",
                show: false
            });
        }
    }

    render() {
        return (<div>
            <div>Last Button Clicked: {this.state.lastButtonClicked}</div>
            <button onClick={(e) => this.onClick(e)} >{this.buttonText}</button>
            <Modal title={"GAME OVER"}
                    yesButtonText={"YES"}
                    noButtonText={"NO"}
                    show={this.state.show}
                    height={256}
                    buttonClick={(e) => this.modalButtonClick(e)}>
                <div>
                    WOULD YOU LIKE TO PLAY AGAIN
                </div>
            </Modal>
        </div>);
    }

}

export default ModalTest;