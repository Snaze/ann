import React, { Component } from 'react';
import "./LevelEditPanel.css";
import Level from "./model/Level";

class LevelEditPanel extends Component {

    constructor(props) {
        super(props);

        this.state = {
            textAreaValue: ''
        };
    }

    onButtonClick(e) {
        let theLevel = this.props.level;

        switch(e.target.id) {
            case "btnSubRow":
                theLevel.removeRow();
                this.props.onUpdate(theLevel);
                break;
            case "btnAddRow":
                theLevel.addRow();
                this.props.onUpdate(theLevel);
                break;
            case "btnSubCol":
                theLevel.removeColumn();
                this.props.onUpdate(theLevel);
                break;
            case "btnAddCol":
                theLevel.addColumn();
                this.props.onUpdate(theLevel);
                break;
            case "btnLoad":
                theLevel = Level.fromJSON(JSON.parse(this.state.textAreaValue));

                this.props.onUpdate(theLevel);
                break;
            case "btnSave":
                let newTextAreaValue = JSON.stringify(theLevel);
                let newState = {
                    textAreaValue: newTextAreaValue
                };
                this.setState(newState);
                break;
            case "txtData":
                break;
            case "btnMirrorHorizontal":
                theLevel.mirrorHorizontally();
                this.props.onUpdate(theLevel);
                break;
            case "btnMirrorVertical":
                theLevel.mirrorVertically();
                this.props.onUpdate(theLevel);
                break;
            default:
                throw new Error("Unknown ID");
        }

    }

    onTextAreaChange(e) {
        this.setState({
            textAreaValue: e.target.value
        });
    }

    render() {
        return (
            <table className="LevelEditPanel" onClick={(e) => this.onButtonClick(e)}>
            <tbody>
                <tr>
                    <td>
                        <button id="btnSubRow" className="LevelEditButton">-</button>
                    </td>
                    <td>
                        {this.props.height} Row{this.props.height !== 1 ? "s" : "" }
                    </td>
                    <td>
                        <button id="btnAddRow" className="LevelEditButton">+</button>
                    </td>
                </tr>
                <tr>
                    <td>
                        <button id="btnSubCol" className="LevelEditButton">-</button>
                    </td>
                    <td>
                        {this.props.width} Col{this.props.width !== 1 ? "s" : "" }
                    </td>
                    <td>
                        <button id="btnAddCol" className="LevelEditButton">+</button>
                    </td>
                </tr>
                <tr>
                    <td colSpan={3}>
                        <button id="btnLoad" className="LevelEditButton">Load</button>
                        <button id="btnSave" className="LevelEditButton">Save</button>
                    </td>
                </tr>
                <tr>
                    <td colSpan={3}>
                        <button id="btnMirrorHorizontal" className="LevelEditButton">Mirror Horizontal</button>
                        <button id="btnMirrorVertical" className="LevelEditButton">Mirror Vertical</button>
                    </td>
                </tr>
                <tr>
                    <td colSpan={3}>
                        <textarea id="txtData"
                                  rows="16"
                                  cols="30"
                                  value={this.state.textAreaValue}
                                  onChange={(e) => this.onTextAreaChange(e)} />
                    </td>
                </tr>
            </tbody>
        </table>);
    };
}

export default LevelEditPanel;