import React, {Component} from 'react';
import PropTypes from "prop-types";

class Popover extends Component {

    constructor(props) {
        super(props);

        this._onMouseMoveRef = (e) => this._onMouseMove(e);
    }

    componentDidMount() {
        if (!!document) {
            document.addEventListener("mousemove", this._onMouseMoveRef);
        }
    }

    componentWillUnmount() {
        if (!!document) {
            document.removeEventListener("mousemove", this._onMouseMoveRef);
        }
    }

    _onMouseMove(e) {
        e.target.style.x = e.screenX;
        e.target.style.y = e.screenY;
    }

    render() {
        if (this.props.roundedCorners > 0) {
            return (
                <svg visibility={this.props.visibility} x={this.props.x} y={this.props.y}>
                    <rect
                        rx={this.props.roundedCorners}
                        ry={this.props.roundedCorners}
                        width={this.props.width}
                        height={this.props.height}
                        fill={this.props.fill}
                        strokeWidth={this.props.strokeWidth}
                        stroke={this.props.stroke} />
                    <svg>
                        {this.props.children}
                    </svg>
                </svg>
            );
        }

        return (
            <svg visibility={this.props.visibility} x={this.props.x} y={this.props.y}>
                <rect
                    width={this.props.width}
                    height={this.props.height}
                    fill={this.props.fill}
                    strokeWidth={this.props.strokeWidth}
                    stroke={this.props.stroke} />
                <svg>
                    {this.props.children}
                </svg>
            </svg>
        );

    }

}

Popover.propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    stroke: PropTypes.string,
    stokeWidth: PropTypes.number,
    fill: PropTypes.string,
    roundedCorners: PropTypes.number,
    visibility: PropTypes.string,
    x: PropTypes.number,
    y: PropTypes.number
};

Popover.defaultProps = {
    strokeWidth: 4,
    stroke: "DarkGreen",
    fill: "Green",
    roundedCorners: 20,
    visibility: "hidden",
    x: 0,
    y: 0
};

export default Popover;