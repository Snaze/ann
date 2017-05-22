import React from 'react';
import './Cell.css';
import Dot from "./model/Dot";
import PropTypes from "prop-types";
import {default as LocationModel} from "./model/Location";
import DataSourceComponent from "./DataSourceComponent";
import BorderType from "./model/BorderType";

// const default_cell_width = 16;
// const default_cell_height = 16;

class Cell extends DataSourceComponent {

    constructor(props) {
        super(props);

        this.state.hover = false;
    }

    static _cellLocationCache = {};
    static getCellLocation(cell) {
        if (typeof(Cell._cellLocationCache[cell.id]) === 'undefined') {
            let theCellDOMElement = document.getElementById(Cell.elementId(cell));
            if (theCellDOMElement) {
                let clientRect = theCellDOMElement.getBoundingClientRect();
                Cell._cellLocationCache[cell.id] = new LocationModel(clientRect["left"],
                                                                     clientRect["top"]);
            } else {
                return new LocationModel(-1, -1);
            }
        }

        return Cell._cellLocationCache[cell.id];
    }

    get cell() {
        return this.dataSource;
    }

    get cellId() {
        return this.cell.id;
    }

    onMouseEnter(e) {
        this.setState({hover: true});
    }

    onMouseLeave(e) {
        this.setState({hover: false});
    }

    onClick(e) {

        this.cell.selected = true;
    }

    static elementId(cell) {
        return "cell_" + cell.id;
    }

    get className() {
        let toRet = "Cell ";

        let self = this;
        let assignBorders = function (propName, solidClassName, partialClassName) {
            if (self.cell.solidBorder[propName]) {
                toRet += solidClassName + " ";
            } else if (self.cell.partialBorder[propName]) {
                toRet += partialClassName + " ";
            }
        };

        assignBorders(BorderType.LEFT, "CellSolidLeftBorder", "CellPartialLeftBorder");
        assignBorders(BorderType.TOP, "CellSolidTopBorder", "CellPartialTopBorder");
        assignBorders(BorderType.RIGHT, "CellSolidRightBorder", "CellPartialRightBorder");
        assignBorders(BorderType.BOTTOM, "CellSolidBottomBorder", "CellPartialBottomBorder");

        if (this.cell.dotType === Dot.BIG) {
            toRet += "CellBigDot ";
        } else if (this.cell.dotType === Dot.LITTLE) {
            toRet += "CellLittleDot ";
        }

        if (!this.cell.isActive) {
            toRet += "CellInActive ";
        }

        if (this.state.hover || this.cell.selected) {
            toRet += "CellSelected ";
        } else {
            toRet += "CellNotSelected ";
        }

        return toRet;
    }

    render() {
        return (
            <td id={Cell.elementId(this.cell)}
                className={this.className}
                data-cell_id={this.cellId}
                key={this.cellId}
                onMouseEnter={(e) => this.onMouseEnter(e)}
                onMouseLeave={(e) => this.onMouseLeave(e)}
                onClick={(e) => this.onClick(e)}>

            </td>
        );
    }
}


Cell.propTypes = {
    dataSource: PropTypes.object.isRequired,
    onClick: PropTypes.func
};

export default Cell;