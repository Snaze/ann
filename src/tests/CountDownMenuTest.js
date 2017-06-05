import React, {Component} from 'react';
import CountDownMenu from "../menus/CountDownMenu";
import {default as CountDownMenuModel} from "../model/menus/CountDownMenu";

class CountDownMenuTest extends Component {

    constructor(props) {
        super(props);

        this._contentMenu = new CountDownMenuModel();
    }

    start() {
        this._contentMenu.count = 3;
        this._contentMenu.stop();
        this._contentMenu.start();
    }

    stop() {
        this._contentMenu.stop();
    }

    render() {
        return (<div style={{backgroundColor: "red"}}>
            <button onClick={(e) => this.start(e)}>Start</button>
            <button onClick={(e) => this.stop(e)}>Stop</button>
            <CountDownMenu dataSource={this._contentMenu} />
        </div>);
    }

}

export default CountDownMenuTest;

