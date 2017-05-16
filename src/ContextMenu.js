import React, { Component } from 'react';
import "./ContextMenu.css";
import Dot from "./model/Dot";


class ContextMenu extends Component {

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    onChange(e) {
        // You might be able to move some of this logic back into the ContextMenu
        let element = e.target.dataset["element"];
        let checked = e.target.checked;

        switch (element) {
            case "borderLeft":
                this.props.cell.solidBorder.left = checked;
                break;
            case "borderRight":
                this.props.cell.solidBorder.right = checked;
                break;
            case "borderTop":
                this.props.cell.solidBorder.top = checked;
                break;
            case "borderBottom":
                this.props.cell.solidBorder.bottom = checked;
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
                            Border Left
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
                            Border Right
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
                            Border Top
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
                            Border Bottom
                        </td>
                    </tr>
                    <tr className="ContextMenuRow">
                        <td className="ContextMenuCellLeft">

                        </td>
                        <td className="ContextMenuCellRight">

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
                            Dot Big
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
                            Dot Little
                        </td>
                    </tr>
                    <tr className="ContextMenuRow">
                        <td className="ContextMenuCellLeft" colSpan={2}>
                            <input type="button" value="OK" className="ContextMenuButton"
                                   onClick={(e) => this.props.onDismiss(e)} />
                        </td>
                    </tr>
                </tbody>
            </table>
        );
    }
}

export default ContextMenu;