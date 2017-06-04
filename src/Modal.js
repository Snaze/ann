import React from 'react';
import PropTypes from 'prop-types';
import "../node_modules/animate.css/animate.css";
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import "./Modal.css";

const buttonTypeYes = 0;
const buttonTypeNo = 1;

class Modal extends React.Component {

    static get BUTTON_YES() { return buttonTypeYes; }
    static get BUTTON_NO() { return buttonTypeNo; }

    constructor(props) {
        super(props);

    }


    get style() {
        let self = this;

        return {
            width: self.props.width,
            height: self.props.height,
            fontSize: self.props.fontSize
        };
    }

    get noButton() {
        if (this.props.noButtonText !== "") {
            return (<button id="modalNoButton" className="ModalButton" onClick={(e) => this.buttonClick(e)}>{this.props.noButtonText.toUpperCase()}</button>);
        }

        return null;
    }

    get header() {
        if (this.props.title !== "") {
            return (<div className="ModalHeader">{this.props.title.toUpperCase()}</div>);
        }

        return null;
    }

    buttonClick(e) {
        if (this.props.buttonClick) {
            let buttonType = Modal.BUTTON_YES;

            if (e.target.id === "modalNoButton") {
                buttonType = Modal.BUTTON_NO;
            }

            this.props.buttonClick({
                buttonType: buttonType,
                event: e
            });
        }
    }

    elements() {
        if (this.props.show) {
            return (<div key="TEST" className="ModalContent" style={this.style}>
                {this.header}
                <div className="ModalText">{this.props.message.toUpperCase()}</div>
                <div className="ModalButtons">
                    <div style={{position: "relative", width: "100%"}}>
                        <button id="modalYesButton" className="ModalButton" onClick={(e) => this.buttonClick(e)}>{this.props.yesButtonText.toUpperCase()}</button>
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
    width: PropTypes.number,
    height: PropTypes.number,
    yesButtonText: PropTypes.string,
    noButtonText: PropTypes.string,
    fontSize: PropTypes.number,
    title: PropTypes.string,
    message: PropTypes.string,
    show: PropTypes.bool,
    buttonClick: PropTypes.func
};

Modal.defaultProps = {
    width: 400,
    height: 400,
    yesButtonText: "OK",
    noButtonText: "CANCEL",
    fontSize: 24,
    title: "TITLE",
    message: "MESSAGE",
    show: true,
    buttonClick: null
};

export default Modal;