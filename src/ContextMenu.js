import React, { Component } from 'react';
import "./ContextMenu.css";


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
                <tbody>
                    <tr className="ContextMenuRow">
                        <td className="ContextMenuCellLeft">
                            <input type="checkbox" checked={this.props.borderLeft} />
                        </td>
                        <td className="ContextMenuCellRight">
                            Border Left
                        </td>
                    </tr>
                    <tr className="ContextMenuRow">
                        <td className="ContextMenuCellLeft">
                            <input type="checkbox" checked={this.props.borderRight} />
                        </td>
                        <td className="ContextMenuCellRight">
                            Border Right
                        </td>
                    </tr>
                    <tr className="ContextMenuRow">
                        <td className="ContextMenuCellLeft">
                            <input type="checkbox" checked={this.props.borderTop} />
                        </td>
                        <td className="ContextMenuCellRight">
                            Border Top
                        </td>
                    </tr>
                    <tr className="ContextMenuRow">
                        <td className="ContextMenuCellLeft">
                            <input type="checkbox" checked={this.props.borderBottom} />
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
                            <input type="checkbox" checked={this.props.bigDot} />
                        </td>
                        <td className="ContextMenuCellRight">
                            Dot Big
                        </td>
                    </tr>
                    <tr className="ContextMenuRow">
                        <td className="ContextMenuCellLeft">
                            <input type="checkbox" checked={this.props.littleDot} />
                        </td>
                        <td className="ContextMenuCellRight">
                            Dot Little
                        </td>
                    </tr>
                </tbody>
            </table>
        );
    }
}

export default ContextMenu;