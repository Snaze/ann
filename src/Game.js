import React from 'react';
import "./Game.css";
import DataSourceComponent from "./DataSourceComponent";
import PropTypes from 'prop-types';
import {default as GameModel} from "./model/Game";
import MainMenu from "./menus/MainMenu";
import LevelRunner from "./LevelRunner";

class Game extends DataSourceComponent {

    // constructor(props) {
    //     super(props);
    //
    //     this.debug = true;
    // }

    get game() {
        return this.dataSource;
    }

    getGameContent() {
        if (!this.game.gameStarted) {
            return (<MainMenu dataSource={this.game.mainMenu} />)
        }

        return (<LevelRunner dataSource={this.game.levelRunner} />)
    }

    render() {
        return (<div>
            {this.getGameContent()}
        </div>);
    }

}

Game.propTypes = {
    dataSource: PropTypes.instanceOf(GameModel).isRequired
};

export default Game;