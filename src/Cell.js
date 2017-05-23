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
    static getCellLocation(location) {
        let cellId = Cell.elementIdByLocation(location);

        if (typeof(Cell._cellLocationCache[cellId]) === 'undefined') {
            let theCellDOMElement = document.getElementById(cellId);
            if (theCellDOMElement) {
                let clientRect = theCellDOMElement.getBoundingClientRect();
                let screenLocation = new LocationModel(clientRect["left"],
                                                                     clientRect["top"]);

                // Using the private set so it doesn't kick off the update event
                // cell._screenLocation = screenLocation;
                Cell._cellLocationCache[cellId] = screenLocation;
            } else {
                return new LocationModel(-1, -1);
            }
        }

        return Cell._cellLocationCache[cellId];
    }

    get cell() {
        return this.dataSource;
    }

    get cellId() {
        return this.cell.id;
    }

    onMouseEnter(e) {
        if (!this.cell.editMode) {
            return;
        }

        this.setState({hover: true});
    }

    onMouseLeave(e) {
        if (!this.cell.editMode) {
            return;
        }

        this.setState({hover: false});
    }

    onClick(e) {
        if (!this.cell.editMode) {
            return;
        }

        this.cell.selected = true;
    }

    static elementId(cell) {
        return "cell_" + cell.id;
    }

    static elementIdByLocation(location) {
        return "cell_" + location.y + "_" + location.x;
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

        if (!this.cell.isActive && this.cell.editMode) {
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