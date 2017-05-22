import React from 'react';
import "./ContextMenu.css";
import Dot from "./model/Dot";
import KeyEventer from "./utils/KeyEventer";
import BorderType from "./model/BorderType";
import DataSourceComponent from "./DataSourceComponent";
import Player from "./actors/Player";
import Ghost from "./actors/Ghost";
import {default as LevelModel} from "./model/Level";
import PropTypes from 'prop-types';


class ContextMenu extends DataSourceComponent {

    constructor(props) {
        super(props);

        this._keyEventer = new KeyEventer();
        // this.debug = true;
    }

    componentDidMount() {
        super.componentDidMount();

        this._keyEventer.bindEvents(document.body, (e) => this.onKeyDown(e), (e) => this.onKeyUp(e));
    }

    componentWillUnmount() {
        super.componentWillUnmount();

        this._keyEventer.unBindEvents();
    }

    get level() {
        return this.dataSource;
    }

    get cell() {
        return this.level.selectedCell;
    }

    onKeyDown (key) {
        if (!this.level.editMode) {
            return;
        }

        switch (key) {
            case "ArrowDown":
            case "ArrowUp":
            case "ArrowLeft":
            case "ArrowRight":
                break;
            case "w":
            case "W":
                this.cell.toggleBorder(BorderType.TOP);
                break;
            case "a":
            case "A":
                this.cell.toggleBorder(BorderType.LEFT);
                break;
            case "s":
            case "S":
                this.cell.toggleBorder(BorderType.BOTTOM);
                break;
            case "d":
            case "D":
                this.cell.toggleBorder(BorderType.RIGHT);
                break;
            case "x":
            case "X":
                this.cell.toggleIsActive();
                break;
            case "Q":
            case "q":
                this.cell.toggleDot();
                break;
            default:
                return; // Quit when this doesn't handle the key event.
        }
    }

    onKeyUp (key) {

    }

    onChange(e) {
        // You might be able to move some of this logic back into the ContextMenu
        let element = e.target.dataset["element"];
        let checked = e.target.checked;

        switch (element) {
            case "borderLeft":
                this.cell.solidBorder.left = checked;
                if (checked) {
                    this.cell.partialBorder.left = false;
                }
                break;
            case "borderRight":
                this.cell.solidBorder.right = checked;
                if (checked) {
                    this.cell.partialBorder.right = false;
                }
                break;
            case "borderTop":
                this.cell.solidBorder.top = checked;
                if (checked) {
                    this.cell.partialBorder.top = false;
                }
                break;
            case "borderBottom":
                this.cell.solidBorder.bottom = checked;
                if (checked) {
                    this.cell.partialBorder.bottom = false;
                }
                break;
            case "partialBorderLeft":
                this.cell.partialBorder.left = checked;
                if (checked) {
                    this.cell.solidBorder.left = false;
                }
                break;
            case "partialBorderRight":
                this.cell.partialBorder.right = checked;
                if (checked) {
                    this.cell.solidBorder.right = false;
                }
                break;
            case "partialBorderTop":
                this.cell.partialBorder.top = checked;
                if (checked) {
                    this.cell.solidBorder.top = false;
                }
                break;
            case "partialBorderBottom":
                this.cell.partialBorder.bottom = checked;
                if (checked) {
                    this.cell.solidBorder.bottom = false;
                }
                break;
            case "bigDot":
                if (checked) {
                    this.cell.dotType = Dot.BIG;
                } else {
                    this.cell.dotType = Dot.NONE;
                }
                break;
            case "littleDot":
                if (checked) {
                    this.cell.dotType = Dot.LITTLE;
                } else {
                    this.cell.dotType = Dot.NONE;
                }
                break;
            case "isActive":
                this.cell.isActive = checked;
                break;
            case "isPlayerSpawn":
                this.cell.isPlayerSpawn = checked;
                break;
            case "isGhostRedSpawn":
                this.cell.isGhostRedSpawn = checked;
                break;
            case "isGhostPinkSpawn":
                this.cell.isGhostPinkSpawn = checked;
                break;
            case "isGhostBlueSpawn":
                this.cell.isGhostBlueSpawn = checked;
                break;
            case "isGhostOrangeSpawn":
                this.cell.isGhostOrangeSpawn = checked;
                break;
            default:
                throw new Error("Unknown element name");
        }
    }

    render() {
        return (
            <table className="ContextMenu">
                <thead>
                    <tr>
                        <th colSpan={2} className="ContextMenuHeader">
                            Cell {this.cell.id}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="ContextMenuRow">
                        <td className="ContextMenuCellLeft">
                            <input type="checkbox"
                                   data-element="borderLeft"
                                   checked={this.cell.solidBorder.left}
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
                                   checked={this.cell.solidBorder.right}
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
                                   checked={this.cell.solidBorder.top}
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
                                   checked={this.cell.solidBorder.bottom}
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
                                   checked={this.cell.partialBorder.left}
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
                                   checked={this.cell.partialBorder.right}
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
                                   checked={this.cell.partialBorder.top}
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
                                   checked={this.cell.partialBorder.bottom}
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
                                   checked={this.cell.dotType === Dot.BIG}
                                   onChange={(e) => this.onChange(e)} />
                        </td>
                        <td className="ContextMenuCellRight">
                            Dot Big (q)
                        </td>
                    </tr>
                    <tr className="ContextMenuRow">
                        <td className="ContextMenuCellLeft">
                            <input type="checkbox"
                                   data-element="littleDot"
                                   checked={this.cell.dotType === Dot.LITTLE}
                                   onChange={(e) => this.onChange(e)} />
                        </td>
                        <td className="ContextMenuCellRight">
                            Dot Little (q)
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
                                   checked={this.cell.isActive}
                                   onChange={(e) => this.onChange(e)} />
                        </td>
                        <td className="ContextMenuCellRight">
                            Active (x)
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
                                   data-element="isPlayerSpawn"
                                   checked={this.cell.isPlayerSpawn}
                                   onChange={(e) => this.onChange(e)} />
                        </td>
                        <td className="ContextMenuCellRight">
                            <table>
                                <tbody>
                                <tr>
                                    <td>
                                        Player Spawn
                                    </td>
                                    <td>
                                        <Player gender={Player.MR_PAC_MAN} />
                                    </td>
                                </tr>
                                </tbody>
                            </table>
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
                                   data-element="isGhostRedSpawn"
                                   checked={this.cell.isGhostRedSpawn}
                                   onChange={(e) => this.onChange(e)} />
                        </td>
                        <td className="ContextMenuCellRight">
                            <table>
                                <tbody>
                                <tr>
                                    <td>
                                        Red Ghost Spawn
                                    </td>
                                    <td>
                                        <Ghost color={Ghost.RED} />
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                    <tr className="ContextMenuRow">
                        <td className="ContextMenuCellLeft">
                            <input type="checkbox"
                                   data-element="isGhostPinkSpawn"
                                   checked={this.cell.isGhostPinkSpawn}
                                   onChange={(e) => this.onChange(e)} />
                        </td>
                        <td className="ContextMenuCellRight">
                            <table>
                                <tbody>
                                <tr>
                                    <td>
                                        Pink Ghost Spawn
                                    </td>
                                    <td>
                                        <Ghost color={Ghost.PINK} />
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                    <tr className="ContextMenuRow">
                        <td className="ContextMenuCellLeft">
                            <input type="checkbox"
                                   data-element="isGhostBlueSpawn"
                                   checked={this.cell.isGhostBlueSpawn}
                                   onChange={(e) => this.onChange(e)} />
                        </td>
                        <td className="ContextMenuCellRight">
                            <table>
                                <tbody>
                                <tr>
                                    <td>
                                        Blue Ghost Spawn
                                    </td>
                                    <td>
                                        <Ghost color={Ghost.BLUE} />
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                    <tr className="ContextMenuRow">
                        <td className="ContextMenuCellLeft">
                            <input type="checkbox"
                                   data-element="isGhostOrangeSpawn"
                                   checked={this.cell.isGhostOrangeSpawn}
                                   onChange={(e) => this.onChange(e)} />
                        </td>
                        <td className="ContextMenuCellRight">
                            <table>
                                <tbody>
                                <tr>
                                    <td>
                                        Orange Ghost Spawn
                                    </td>
                                    <td>
                                        <Ghost color={Ghost.ORANGE} />
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </tbody>
            </table>
        );
    }
}

ContextMenu.propTypes = {
    dataSource: PropTypes.instanceOf(LevelModel).isRequired,
};

export default ContextMenu;