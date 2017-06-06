import React from 'react';
import PropTypes from 'prop-types';
import {default as LevelRunnerModel} from "./model/LevelRunner";
import Level from "./Level";
import LevelEditPanel from "./LevelEditPanel";
import DataSourceComponent from "./DataSourceComponent";
import "./LevelRunner.css";
import ContextMenu from "./ContextMenu";
import GameHeader from "./GameHeader";
import GameFooter from "./GameFooter";
import GameEntities from "./GameEntities";

class LevelRunner extends DataSourceComponent {

    get level() {
        return this.levelRunner.level;
    }

    get gameObjectContainer() {
        return this.levelRunner.gameObjectContainer;
    }

    get gameFooter() {
        return this.levelRunner.gameFooter;
    }

    get gameHeader() {
        return this.levelRunner.gameHeader;
    }

    get levelRunner() {
        return this.dataSource;
    }

    levelEditPanel_onLoadComplete(theLevel) {
        this.levelRunner.level = theLevel;
    }

    buttonToggleEdit_Click(e) {
        this.levelRunner.editMode = !this.levelRunner.editMode;
    }

    editPanelStyle() {
        if (this.levelRunner.editPanelEnabled) {
            return {
                display: "inline"
            };
        }

        return {
            display: "none"
        };
    }

    get levelRunnerLevelClass() {
        if (this.levelRunner.editPanelEnabled) {
            return "LevelRunnerArea";
        }

        return "LevelRunnerAreaCenter";
    }

    static getLevelStyle(level) {
        return {
            width: level.screenWidth,
            height: level.screenHeight
        };
    }


    render() {
        return (<div className="LevelRunner">
            <div className="LevelRunnerLevel">
                <table id="tblLevelRunner" className={this.levelRunnerLevelClass}>
                    <tbody>
                        <tr>
                            <td>
                                <GameHeader dataSource={this.gameHeader} />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <Level dataSource={this.level} gameObjectContainer={this.gameObjectContainer} />
                                <GameEntities dataSource={this.gameObjectContainer} />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <GameFooter dataSource={this.gameFooter} />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div style={this.editPanelStyle()}>
                <div className={this.levelRunner.editMode ? "LevelRunnerLevelEditorPanel" : "LevelRunnerLevelEditorPanelHide"}>
                    <div className="ButtonToggleEdit"
                         onClick={(e) => this.buttonToggleEdit_Click(e)}>
                        <div className="ButtonToggleEditText">
                            {this.levelRunner.editMode ? "Play!" : "Edit!"}
                        </div>
                    </div>
                    <div className="LevelRunnerPanel">
                        <LevelEditPanel dataSource={this.level}
                                        onLoadComplete={(e) => this.levelEditPanel_onLoadComplete(e)}/>
                    </div>
                    <div className="LevelRunnerPanel">
                        <ContextMenu dataSource={this.level.selectedCell} editMode={this.level.editMode}/>
                    </div>
                </div>
            </div>
        </div>);
    }
}

LevelRunner.propTypes = {
    dataSource: PropTypes.instanceOf(LevelRunnerModel).isRequired
};

export default LevelRunner;