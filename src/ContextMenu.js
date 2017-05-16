import React, { Component } from 'react';
import "./ContextMenu.css";
import Dot from "./model/Dot";


class ContextMenu extends Component {

    constructor(props) {
        super(props);


    }

    componentDidMount() {

    }

    componentWillUnmount() {

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
                                   onChange={(e) => this.props.onChange(e)} />
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
                                   onChange={(e) => this.props.onChange(e)} />
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
                                   onChange={(e) => this.props.onChange(e)} />
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
                                   onChange={(e) => this.props.onChange(e)} />
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
                                   onChange={(e) => this.props.onChange(e)} />
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
                                   onChange={(e) => this.props.onChange(e)} />
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