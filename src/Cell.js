import React, { Component } from 'react';
import './Cell.css';
import Dot from "./model/Dot";

class Cell extends Component {

    constructor(props) {
        super(props);

        this.state = {hover: false};
    }

    get cellId() {
        return this.props.cell.id;
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    style() {
        //TODO: Pull this out into CSS
        let toRet = {
            borderLeft : this.props.cell.solidBorder.left ? "Solid 2px #1f1ff2": "none",
            borderRight : this.props.cell.solidBorder.right ? "Solid 2px #1f1ff2": "none",
            borderTop : this.props.cell.solidBorder.top ? "Solid 2px #1f1ff2": "none",
            borderBottom : this.props.cell.solidBorder.bottom ? "Solid 2px #1f1ff2": "none",
            verticalAlign : "middle",
            textAlign : "center",
            backgroundColor: this.state.hover ? "#AED6F1" : "Black"
        };

        if (this.props.cell.selected) {
            toRet.backgroundColor = "#AED6F1";
        }

        if (toRet.borderLeft === "none" && this.props.cell.partialBorder.left) {
            toRet.borderLeft = "Solid 2px White";
        }

        if (toRet.borderRight === "none" && this.props.cell.partialBorder.right) {
            toRet.borderRight = "Solid 2px White";
        }

        if (toRet.borderTop === "none" && this.props.cell.partialBorder.top) {
            toRet.borderTop = "Solid 2px White";
        }

        if (toRet.borderBottom === "none" && this.props.cell.partialBorder.bottom) {
            toRet.borderBottom = "Solid 2px White";
        }

        let width = 24;
        if (this.props.cell.solidBorder.left || this.props.cell.partialBorder.left) {
            width -= 2;
        }
        if (this.props.cell.solidBorder.right || this.props.cell.partialBorder.right) {
            width -= 2;
        }

        let height = 24;
        if (this.props.cell.solidBorder.top || this.props.cell.partialBorder.top) {
            height -= 2;
        }
        if (this.props.cell.solidBorder.bottom || this.props.cell.partialBorder.bottom) {
            height -= 2;
        }

        toRet.width = width + "px";
        toRet.height = height + "px";

        return toRet;
    }

    getClassName() {
        if (!this.props.cell.isActive) {
            return "Cell CellInActive"
        }

        if (this.props.cell.dotType === Dot.LITTLE) {
            return "Cell CellLittleDot";
        }

        if (this.props.cell.dotType === Dot.BIG) {
            return "Cell CellBigDot";
        }

        return "Cell";
    }

    onMouseEnter(e) {
        this.setState({hover: true});
    }

    onMouseLeave(e) {
        this.setState({hover: false});
    }

    render() {
        return (
            <td className={this.getClassName()}
                data-cell_id={this.cellId}
                key={this.cellId}
                style={this.style()}
                onMouseEnter={(e) => this.onMouseEnter(e)}
                onMouseLeave={(e) => this.onMouseLeave(e)}
                onClick={(e) => this.props.onClick(e)}>

            </td>
        );
    }
}

export default Cell;