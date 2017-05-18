import React, { Component } from 'react';
import "./ContextMenu.css";
import Dot from "./model/Dot";
import KeyEventer from "./utils/KeyEventer";
import BorderType from "./model/BorderType";


class ContextMenu extends Component {

    constructor(props) {
        super(props);

        this._keyEventer = new KeyEventer();
    }

    componentDidMount() {
        this._keyEventer.bindEvents(document.body, (e) => this.onKeyDown(e), (e) => this.onKeyUp(e));
    }

    componentWillUnmount() {
        this._keyEventer.unBindEvents();
    }

    onKeyDown (key) {
        switch (key) {
            case "ArrowDown":
            case "ArrowUp":
            case "ArrowLeft":
            case "ArrowRight":
                break;
            case "w":
            case "W":
                this.props.cell.toggleBorder(BorderType.TOP);
                break;
            case "a":
            case "A":
                this.props.cell.toggleBorder(BorderType.LEFT);
                break;
            case "s":
            case "S":
                this.props.cell.toggleBorder(BorderType.BOTTOM);
                break;
            case "d":
            case "D":
                this.props.cell.toggleBorder(BorderType.RIGHT);
                break;
            case "x":
            case "X":
                this.props.cell.toggleIsActive();
                break;
            case " ":
                this.props.cell.toggleDot();
                break;
            default:
                return; // Quit when this doesn't handle the key event.
        }

        this.props.onChange(this.props.cell);
    }

    onKeyUp (key) {

    }

    onChange(e) {
        // You might be able to move some of this logic back into the ContextMenu
        let element = e.target.dataset["element"];
        let checked = e.target.checked;

        switch (element) {
            case "borderLeft":
                this.props.cell.solidBorder.left = checked;
                if (checked) {
                    this.props.cell.partialBorder.left = false;
                }
                break;
            case "borderRight":
                this.props.cell.solidBorder.right = checked;
                if (checked) {
                    this.props.cell.partialBorder.right = false;
                }
                break;
            case "borderTop":
                this.props.cell.solidBorder.top = checked;
                if (checked) {
                    this.props.cell.partialBorder.top = false;
                }
                break;
            case "borderBottom":
                this.props.cell.solidBorder.bottom = checked;
                if (checked) {
                    this.props.cell.partialBorder.bottom = false;
                }
                break;
            case "partialBorderLeft":
                this.props.cell.partialBorder.left = checked;
                if (checked) {
                    this.props.cell.solidBorder.left = false;
                }
                break;
            case "partialBorderRight":
                this.props.cell.partialBorder.right = checked;
                if (checked) {
                    this.props.cell.solidBorder.right = false;
                }
                break;
            case "partialBorderTop":
                this.props.cell.partialBorder.top = checked;
                if (checked) {
                    this.props.cell.solidBorder.top = false;
                }
                break;
            case "partialBorderBottom":
                this.props.cell.partialBorder.bottom = checked;
                if (checked) {
                    this.props.cell.solidBorder.bottom = false;
                }
                break;
            case "bigDot":
                if (checked) {
                    this.props.cell.dotType = Dot.BIG;
                } else {
                    this.props.cell.dotType = Dot.NONE;
                }
                break;
            case "littleDot":
                if (checked) {
                    this.props.cell.dotType = Dot.LITTLE;
                } else {
                    this.props.cell.dotType = Dot.NONE;
                }
                break;
            case "isActive":
                this.props.cell.isActive = checked;
                break;
            default:
                throw new Error("Unknown element name");
        }

        this.props.onChange(this.props.cell);
    }

    render() {
        return (
            <table className="ContextMenu">
                <thead>
                    <tr>
                        <th colSpan={2} className="ContextMenuHeader">
                            Cell {this.props.cell.id}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="ContextMenuRow">
                        <td className="ContextMenuCellLeft">
                            <input type="checkbox"
                                   data-element="borderLeft"
                                   checked={this.props.cell.solidBorder.left}
                                   onChange={(e) => this.onChange(e)} />
                        </td>
                        <td className="ContextMenuCellRight">
                            Border Left (a)
                        </td>
                    </tr>
                    <tr className="ContextMenuRow">
                        <td className="ContextMenuCellLeft">
                            <input type="checkbox"
                                   data-element="borderRight"
                                   checked={this.props.cell.solidBorder.right}
                                   onChange={(e) => this.onChange(e)} />
                        </td>
                        <td className="ContextMenuCellRight">
                            Border Right (d)
                        </td>
                    </tr>
                    <tr className="ContextMenuRow">
                        <td className="ContextMenuCellLeft">
                            <input type="checkbox"
                                   data-element="borderTop"
                                   checked={this.props.cell.solidBorder.top}
                                   onChange={(e) => this.onChange(e)} />
                        </td>
                        <td className="ContextMenuCellRight">
                            Border Top (w)
                        </td>
                    </tr>
                    <tr className="ContextMenuRow">
                        <td className="ContextMenuCellLeft">
                            <input type="checkbox"
                                   data-element="borderBottom"
                                   checked={this.props.cell.solidBorder.bottom}
                                   onChange={(e) => this.onChange(e)} />
                        </td>
                        <td className="ContextMenuCellRight">
                            Border Bottom (s)
                        </td>
                    </tr>
                    <tr className="ContextMenuRow">
                        <td className="ContextMenuCellLeft" colSpan={2}>
                            <hr/>
                        </td>
                    </tr>
                    <tr className="ContextMenuRow">
                        <td className="ContextMenuCellLeft">
                            <input type="checkbox"
                                   data-element="partialBorderLeft"
                                   checked={this.props.cell.partialBorder.left}
                                   onChange={(e) => this.onChange(e)} />
                        </td>
                        <td className="ContextMenuCellRight">
                            Partial Border Left (a)
                        </td>
                    </tr>
                    <tr className="ContextMenuRow">
                        <td className="ContextMenuCellLeft">
                            <input type="checkbox"
                                   data-element="partialBorderRight"
                                   checked={this.props.cell.partialBorder.right}
                                   onChange={(e) => this.onChange(e)} />
                        </td>
                        <td className="ContextMenuCellRight">
                            Partial Border Right (d)
                        </td>
                    </tr>
                    <tr className="ContextMenuRow">
                        <td className="ContextMenuCellLeft">
                            <input type="checkbox"
                                   data-element="partialBorderTop"
                                   checked={this.props.cell.partialBorder.top}
                                   onChange={(e) => this.onChange(e)} />
                        </td>
                        <td className="ContextMenuCellRight">
                            Partial Border Top (w)
                        </td>
                    </tr>
                    <tr className="ContextMenuRow">
                        <td className="ContextMenuCellLeft">
                            <input type="checkbox"
                                   data-element="partialBorderBottom"
                                   checked={this.props.cell.partialBorder.bottom}
                                   onChange={(e) => this.onChange(e)} />
                        </td>
                        <td className="ContextMenuCellRight">
                            Partial Border Bottom (s)
                        </td>
                    </tr>
                    <tr className="ContextMenuRow">
                        <td className="ContextMenuCellLeft" colSpan={2}>
                            <hr/>
                        </td>
                    </tr>
                    <tr className="ContextMenuRow">
                        <td className="ContextMenuCellLeft">
                            <input type="checkbox"
                                   data-element="bigDot"
                                   checked={this.props.cell.dotType === Dot.BIG}
                                   onChange={(e) => this.onChange(e)} />
                        </td>
                        <td className="ContextMenuCellRight">
                            Dot Big (space)
                        </td>
                    </tr>
                    <tr className="ContextMenuRow">
                        <td className="ContextMenuCellLeft">
                            <input type="checkbox"
                                   data-element="littleDot"
                                   checked={this.props.cell.dotType === Dot.LITTLE}
                                   onChange={(e) => this.onChange(e)} />
                        </td>
                        <td className="ContextMenuCellRight">
                            Dot Little (space)
                        </td>
                    </tr>
                    <tr className="ContextMenuRow">
                        <td className="ContextMenuCellLeft" colSpan={2}>
                            <hr/>
                        </td>
                    </tr>
                    <tr className="ContextMenuRow">
                        <td className="ContextMenuCellLeft">
                            <input type="checkbox"
                                   data-element="isActive"
                                   checked={this.props.cell.isActive}
                                   onChange={(e) => this.onChange(e)} />
                        </td>
                        <td className="ContextMenuCellRight">
                            Active (x)
                        </td>
                    </tr>
                    <tr className="ContextMenuRow">
                        <td className="ContextMenuCellLeft" colSpan={2}>
                            <input type="button" value="OK" className="ContextMenuButton"
                                   onClick={(e) => this.props.onDismiss(e)}
                                    style={{display: this.props.isContextMode ? "inline" : "none"}} />
                        </td>
                    </tr>
                </tbody>
            </table>
        );
    }
}

export default ContextMenu;