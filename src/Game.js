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

    get gameObjectContainer() {
        return this.game.gameObjectContainer;
    }

    get game() {
        return this.dataSource;
    }

    levelEditPanel_onLoadComplete(theLevel) {
        this.game.level = theLevel;
        this.game.editMode = true;
    }

    buttonToggleEdit_Click(e) {
        this.game.editMode = !this.game.editMode;
    }

    render() {
        return (<div className="Game">
            <div className="GameLevel">
                <Level dataSource={this.level} gameObjectContainer={this.gameObjectContainer} />
            </div>
            <div className={this.game.editMode ? "GameLevelEditorPanel" : "GameLevelEditorPanelHide"}>
                <div className="ButtonToggleEdit"
                     onClick={(e) => this.buttonToggleEdit_Click(e)}>
                    <div className="ButtonToggleEditText">
                        {this.game.editMode ? "Play!" : "Edit!"}
                    </div>
                </div>
                <div className="GamePanel">
                    <LevelEditPanel dataSource={this.level}
                                    onLoadComplete={(e) => this.levelEditPanel_onLoadComplete(e)}/>
                </div>
                <div className="GamePanel">
                    <ContextMenu dataSource={this.level.selectedCell} editMode={this.level.editMode}/>
                </div>

            </div>
        </div>);
    }
}

Game.propTypes = {
    dataSource: PropTypes.instanceOf(GameModel).isRequired
};

export default Game;