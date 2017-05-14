import React, { Component } from 'react';
import './Square.css';

class Square extends Component {
    constructor(publicProps, publicContext, updateQueue) {
        super(publicProps, publicContext, updateQueue);

        // this.borderLeft = borderLeft || 0;
        // this.borderRight = borderRight || 0;
        // this.borderTop = borderTop || 0;
        // this.borderBottom = borderBottom || 0;
        // this.width = width || 32;
        // this.height = height || 32;
        //
        // this.width -= (this.borderLeft + this.borderRight);
        // this.height -= (this.borderTop + this.borderBottom);
    }

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