import React, { Component } from 'react';
import {default as DummyModel} from "../model/Dummy";
import Dummy from "./Dummy";

class PropChangeTest extends Component {

    constructor(props) {
        super(props);

        this.state = {
            dummy: new DummyModel()
        };
    }

    buttonClick(e) {
        this.setState({
            dummy: new DummyModel()
        });
    }

    render() {
        return (<table>
            <tbody>
                <tr>
                    <td>
                        <Dummy dataSource={this.state.dummy} />
                    </td>
                </tr>
                <tr>
                    <td>
                        <button onClick={(e) => this.buttonClick(e)}>Swap Prop</button>
                    </td>
                </tr>
            </tbody>
        </table>);
    }
}

export default PropChangeTest;