import React from 'react';
import DataSourceComponent from "./DataSourceComponent";
import PropTypes from 'prop-types';
import "../node_modules/animate.css/animate.css";
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import "./Modal.css";
import {default as ModalModel} from "./model/Modal";

class Modal extends DataSourceComponent {

    get modal() {
        return this.dataSource;
    }

    get style() {
        let self = this;

        return {
            width: self.modal.width,
            height: self.modal.height,
            fontSize: self.modal.fontSize
        };
    }

    get noButton() {
        if (this.modal.noButtonText !== "") {
            return (<button id="modalNoButton" className="ModalButton" onClick={(e) => this.buttonClick(e)}>{this.modal.noButtonText}</button>);
        }

        return null;
    }

    get yesButton() {
        if (this.modal.yesButtonText !== "") {
            return (<button id="modalYesButton" className="ModalButton" onClick={(e) => this.buttonClick(e)}>{this.modal.yesButtonText}</button>);
        }

        return null;
    }

    get header() {
        if (this.modal.title !== "") {
            return (<div className="ModalHeader">{this.modal.title}</div>);
        }

        return null;
    }

    buttonClick(e) {
        if (this.modal.buttonClick) {
            let buttonType = ModalModel.BUTTON_YES;

            if (e.target.id === "modalNoButton") {
                buttonType = ModalModel.BUTTON_NO;
            }

            this.modal.buttonClick({
                buttonType: buttonType,
                event: e
            });
        }
    }

    elements() {
        if (this.modal.show) {
            return (<div key="TEST" className="ModalContent" style={this.style}>
                {this.header}
                <div className="ModalText">{this.props.children}</div>
                <div className="ModalButtons">
                    <div style={{position: "relative", width: "100%"}}>
                        {this.yesButton}
                        {this.noButton}
                    </div>
                </div>
            </div>);
        }

        return null;
    }

    render() {

        return (
            <div className="Modal">
                <ReactCSSTransitionGroup
                    transitionName="Modal"
                    transitionEnterTimeout={500}
                    transitionLeaveTimeout={500}>
                    {this.elements()}
                </ReactCSSTransitionGroup>
            </div>
        );
    }
}

Modal.propTypes = {
    dataSource: PropTypes.instanceOf(ModalModel).isRequired
};

export default Modal;