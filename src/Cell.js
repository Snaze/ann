import React, { Component } from 'react';
import './Cell.css';
import Dot from "./model/Dot";
import PropTypes from "prop-types";
import {default as CellModel} from "./model/Cell";
import {default as LocationModel} from "./model/Location";

const default_cell_width = 24;
const default_cell_height = 24;

class Cell extends Component {

    constructor(props) {
        super(props);

        this.state = {hover: false};
        this._updateCallback = null;
    }

    static _cellLocationCache = {};
    static getCellLocation(cell) {
        if (typeof(Cell._cellLocationCache[cell.id]) === 'undefined') {
            let theCellDOMElement = document.getElementById(Cell.elementId(cell));
            if (theCellDOMElement) {
                let clientRect = theCellDOMElement.getBoundingClientRect();
                Cell._cellLocationCache[cell.id] = new LocationModel(Cell._cellLocationCache[cell.id]["left"],
                                                                     Cell._cellLocationCache[cell.id]["top"]);
            } else {
                return new LocationModel(-1, -1);
            }
        }

        return Cell._cellLocationCache[cell.id];
    }

    get cellId() {
        return this.props.cell.id;
    }

    static get DEFAULT_CELL_WIDTH() { return default_cell_width; }
    static get DEFAULT_CELL_HEIGHT() { return default_cell_height; }

    shouldComponentUpdate(nextProps, nextState) {
        let stateDifferent = nextState.hover !== this.state.hover;
        let propsDifferent = nextProps.cell.equals(this.props.cell);

        return stateDifferent || propsDifferent;
    }

    componentDidMount() {
        this._updateCallback = (e) => this.cellUpdated(e);
    }

    componentWillUnmount() {
        this.props.cell.removeOnChangeCallback(this._updateCallback);
    }

    componentWillReceiveProps(nextProps) {
        if (typeof(this.props.cell) === "undefined") {
            nextProps.cell.addOnChangeCallback(this._updateCallback);
        } else if (this.props.cell !== nextProps.cell) {
            this.props.cell.removeOnChangeCallback(this._updateCallback);
            nextProps.cell.addOnChangeCallback(this._updateCallback);
        }
    }

    cellUpdated(data) {
        this.forceUpdate();
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

        let width = default_cell_width;
        if (this.props.cell.solidBorder.left || this.props.cell.partialBorder.left) {
            width -= 2;
        }
        if (this.props.cell.solidBorder.right || this.props.cell.partialBorder.right) {
            width -= 2;
        }

        let height = default_cell_height;
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

    static elementId(cell) {
        return "cell_" + cell.id;
    }

    render() {
        return (
            <td id={Cell.elementId(this.props.cell)}
                className={this.getClassName()}
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

Cell.propTypes = {
    cell: PropTypes.instanceOf(CellModel).isRequired,
    onClick: PropTypes.func
};

export default Cell;