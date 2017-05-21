import React, {Component} from 'react';
import {default as CellModel} from "../model/Cell";
import Cell from "../Cell";
import BorderType from "../model/BorderType";

class CellTest extends Component {

    constructor(props) {
        super(props);

        this.state = {
            cell: new CellModel("1_1")
        };
    }

    render() {
        return (
            <table style={{backgroundColor: "black"}}>
                <tbody>
                    <tr>
                        <td>
                            <table>
                                <tbody>
                                    <tr>
                                        <Cell dataSource={this.state.cell} />
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td >
                            <button onClick={(e) => this.state.cell.toggleBorder(BorderType.LEFT)}>Toggle Left Border</button>
                        </td>
                    </tr>
                    <tr>
                        <td >
                            <button onClick={(e) => this.state.cell.toggleBorder(BorderType.TOP)}>Toggle Top Border</button>
                        </td>
                    </tr>
                    <tr>
                        <td >
                            <button onClick={(e) => this.state.cell.toggleBorder(BorderType.RIGHT)}>Toggle Right Border</button>
                        </td>
                    </tr>
                    <tr>
                        <td >
                            <button onClick={(e) => this.state.cell.toggleBorder(BorderType.BOTTOM)}>Toggle Bottom Border</button>
                        </td>
                    </tr>
                    <tr>
                        <td >
                            <button onClick={(e) => this.state.cell.toggleDot()}>Toggle Dot</button>
                        </td>
                    </tr>
                    <tr>
                        <td >
                            <button onClick={(e) => this.state.cell.toggleIsActive()}>Toggle IsActive</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        );
    }
}

export default CellTest;
