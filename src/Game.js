import React from 'react';
import PropTypes from 'prop-types';
import {default as GameModel} from "./model/Game";
import Level from "./Level";
import LevelEditPanel from "./LevelEditPanel";
import DataSourceComponent from "./DataSourceComponent";
import "./Game.css";
import ContextMenu from "./ContextMenu";

class Game extends DataSourceComponent {

    get level() {
        return this.game.level;
    }

    get game() {
        return this.dataSource;
    }

    levelEditPanel_onLoadComplete(theLevel) {
        this.game.level = theLevel;
    }

    buttonToggleEdit_Click(e) {
        this.game.editMode = !this.game.editMode;
    }

    render() {
        return (<div className="Game">
            <div className="GameLevel">
                <Level dataSource={this.level} />
            </div>
            <div className={this.game.editMode ? "GameLevelEditorPanel" : "GameLevelEditorPanelHide"}>
                <table>
                    <tbody>
                        <tr style={{verticalAlign: "top"}}>
                            <td>
                                <div className="ButtonToggleEdit"
                                     onClick={(e) => this.buttonToggleEdit_Click(e)}>
                                    <div className="ButtonToggleEditText">
                                        {this.game.editMode ? "Play!" : "Edit!"}
                                    </div>
                                </div>
                            </td>
                            <td>
                                <LevelEditPanel dataSource={this.level}
                                                onLoadComplete={(e) => this.levelEditPanel_onLoadComplete(e)} />
                            </td>
                            <td>
                                <ContextMenu dataSource={this.level} />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>);
    }
}

Game.propTypes = {
    dataSource: PropTypes.instanceOf(GameModel).isRequired
};

export default Game;