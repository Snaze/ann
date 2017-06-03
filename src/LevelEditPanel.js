import React from 'react';
import "./LevelEditPanel.css";
import LevelModel from "./model/Level";
import DataSourceComponent from "./DataSourceComponent";
import PropTypes from 'prop-types';

class LevelEditPanel extends DataSourceComponent {

    constructor(props) {
        super(props);

        this.state.textAreaValue = '';
    }

    get level() {
        return this.dataSource;
    }

    onFormEvent(e) {
        let theLevel = this.level;

        switch (e.target.id) {
            case "btnSubRow":
                theLevel.removeRow();
                break;
            case "btnAddRow":
                theLevel.addRow();
                break;
            case "btnSubCol":
                theLevel.removeColumn();
                break;
            case "btnAddCol":
                theLevel.addColumn();
                break;
            case "btnLoad":
                theLevel = LevelModel.fromJSON(JSON.parse(this.state.textAreaValue));

                this.props.onLoadComplete(theLevel);
                break;
            case "btnSave":
                theLevel.regeneratePaths();
                let newTextAreaValue = JSON.stringify(theLevel.toJSON());
                let newState = {
                    textAreaValue: newTextAreaValue
                };
                this.setState(newState);
                break;
            case "txtData":
                break;
            case "btnMirrorHorizontal":
                theLevel.mirrorHorizontally();
                break;
            case "btnMirrorVertical":
                theLevel.mirrorVertically();
                break;
            case "ddlColor":
                theLevel.color = parseInt(e.target.value, 10);
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
            <table className="LevelEditPanel" onClick={(e) => this.onFormEvent(e)}>
                <tbody>
                <tr>
                    <td>
                        <button id="btnSubRow" className="LevelEditButton">-</button>
                    </td>
                    <td>
                        {this.level.height} Row{this.level.height !== 1 ? "s" : "" }
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
                        {this.level.width} Col{this.level.width !== 1 ? "s" : "" }
                    </td>
                    <td>
                        <button id="btnAddCol" className="LevelEditButton">+</button>
                    </td>
                </tr>
                <tr>
                    <td colSpan={3}>
                        <hr />
                    </td>
                </tr>
                <tr>
                    <td colSpan={1} style={{textAlign: "right"}}>
                        Color:
                    </td>
                    <td colSpan={2}>
                        <select id="ddlColor" value={this.level.color} onChange={(e) => this.onFormEvent(e)}>
                            <option value="0">Classic Blue</option>
                            <option value="1">Pink</option>
                            <option value="2">Aqua</option>
                            <option value="3">Orange</option>
                            <option value="4">Purple</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <td colSpan={3}>
                        <hr />
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
                        <button id="btnMirrorHorizontal" className="LevelEditButton">Mirror Horizontal
                        </button>
                        <button id="btnMirrorVertical" className="LevelEditButton">Mirror Vertical</button>
                    </td>
                </tr>
                <tr>
                    <td colSpan={3}>
                        <textarea id="txtData"
                                  rows="16"
                                  cols="30"
                                  value={this.state.textAreaValue}
                                  onChange={(e) => this.onTextAreaChange(e)}/>
                    </td>
                </tr>
                </tbody>
            </table>
        );
    };
}

LevelEditPanel.propTypes = {
    dataSource: PropTypes.instanceOf(LevelModel).isRequired,
    onLoadComplete: PropTypes.func.isRequired
};

export default LevelEditPanel;