import React from 'react';
import './Cell.css';
import Dot from "./model/Dot";
import PropTypes from "prop-types";
import {default as LocationModel} from "./model/Location";
import DataSourceComponent from "./DataSourceComponent";
import BorderType from "./model/BorderType";
// import {default as CellModel} from "./model/Cell";
import Border from "./model/Border";

const default_cell_width = 24;
const default_cell_height = 24;

class Cell extends DataSourceComponent {

    static get DEFAULT_CELL_WIDTH() { return default_cell_width; }
    static get DEFAULT_CELL_HEIGHT() { return default_cell_height; }
    static _colorNameMap = null;
    static get colorNameMap() {
        if (Cell._colorNameMap === null) {
            Cell._colorNameMap = {};
            Cell._colorNameMap[Border.COLOR_CLASSIC] = "";
            Cell._colorNameMap[Border.COLOR_PINK] = "Pink";
            Cell._colorNameMap[Border.COLOR_AQUA] = "Aqua";
            Cell._colorNameMap[Border.COLOR_ORANGE] = "Orange";
            Cell._colorNameMap[Border.COLOR_PURPLE] = "Purple";
        }

        return Cell._colorNameMap;
    }

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
                let parents = document.getElementsByClassName("LevelRunnerAreaCenter");
                if (parents.length <= 0) {
                    parents = document.getElementsByClassName("LevelRunnerArea");
                }
                let parent = parents[0];
                let parentRect = parent.getBoundingClientRect();

                let left = Math.abs(clientRect["left"] - parentRect["left"]) - 2;
                let top = Math.abs(clientRect["top"] - parentRect["top"]) - 2;

                Cell._cellLocationCache[cellId] = new LocationModel(left, top);
            } else {
                return new LocationModel(-1, -1);
            }
        }

        return Cell._cellLocationCache[cellId];

        // let cellId = Cell.elementIdByLocation(location);
        // let theCellDOMElement = document.getElementById(cellId);
        // if (theCellDOMElement) {
        //     let clientRect = theCellDOMElement.getBoundingClientRect();
        //     return new LocationModel(clientRect["left"],
        //         clientRect["top"]);
        // }
        //
        // return new LocationModel(-1, -1);
    }

    static resetCellLocationCache() {
        Cell._cellLocationCache = {};
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
                toRet += solidClassName + Cell.colorNameMap[self.cell.solidBorder.color] + " ";
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
            if (this.cell.editMode) {
                toRet += "CellInActive ";
            } else {
                toRet += "CellBackground" + Cell.colorNameMap[this.cell.solidBorder.color] + " ";
            }
        }

        if (this.state.hover || this.cell.selected || this.cell.highlighted) {
            toRet += "CellSelected ";
        } else {
            toRet += "CellNotSelected ";
        }

        return toRet;
    }

    get style() {
        let toRet = {};

        if (!this.cell.blinkBorder) {
            return toRet;
        }

        let animation = "";

        if (this.cell.solidBorder.top) {
            animation += "CellSolidTopBorderBlinkAnimation 500ms linear infinite, "
        }

        if (this.cell.solidBorder.left) {
            animation += "CellSolidLeftBorderBlinkAnimation 500ms linear infinite, "
        }

        if (this.cell.solidBorder.right) {
            animation += "CellSolidRightBorderBlinkAnimation 500ms linear infinite, "
        }

        if (this.cell.solidBorder.bottom) {
            animation += "CellSolidBottomBorderBlinkAnimation 500ms linear infinite, "
        }

        if (animation !== "") {
            toRet["animation"] = animation.substr(0, animation.length - 2);
        }

        return toRet;
    }

    render() {
        return (
            <td id={Cell.elementId(this.cell)}
                style={this.style}
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
    dataSource: PropTypes.object.isRequired
};

export default Cell;