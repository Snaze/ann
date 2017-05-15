import React, { Component } from 'react';
import './Square.css';

class Square extends Component {


    componentDidMount() {

    }

    componentWillUnmount() {

    }

    render() {
        return (
            <div className="Square"
                 style={
                     {
                        borderLeft: "Solid " + this.props.borderLeft + "px Blue",
                        borderRight: "Solid " + this.props.borderRight + "px Blue",
                        borderTop: "Solid " + this.props.borderTop + "px Blue",
                        borderBottom: "Solid " + this.props.borderBottom + "px Blue",
                        width: this.props.width + "px",
                        height: this.props.height + "px"}
                 }>
                <div style={{position: "relative",
                    top: "50%",
                    transform: "translateY(-50%)",
                    display: this.props.littleDotDisplay}}>.</div>
                <div style={{position: "relative",
                    top: "50%",
                    transform: "translateY(-50%)",
                    display: this.props.bigDotDisplay}}>O</div>
            </div>
        );
    }
}

export default Square;