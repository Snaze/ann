import React, {Component} from 'react';
import GameTimer from "../model/GameTimer";

class GameTimerTest extends Component {

    constructor(props) {
        super(props);

        this._callbackHandle = (e) => this.timerCallback(e);

        this.state = {
            timer: GameTimer.instance
        };
    }

    componentDidMount() {
        GameTimer.instance.addCallback(this._callbackHandle);
    }

    componentWillUnmount() {
        GameTimer.instance.removeCallback(this._callbackHandle);
    }

    timerCallback(steps) {
        this.setState({
            timer: GameTimer.instance
        });
    }

    render() {
        return (
            <table style={{backgroundColor: "black", color: "white"}}>
                <tbody>
                    {/*<tr>*/}
                        {/*<td>*/}
                            {/*Step Number (25ms) = {this.state.timer.getStepNumber(GameTimer.TIME_25MS)}*/}
                        {/*</td>*/}
                    {/*</tr>*/}
                    {/*<tr>*/}
                        {/*<td>*/}
                            {/*Step Number (50ms) = {this.state.timer.getStepNumber(GameTimer.TIME_50MS)}*/}
                        {/*</td>*/}
                    {/*</tr>*/}
                    {/*<tr>*/}
                        {/*<td>*/}
                            {/*Step Number (100ms) = {this.state.timer.getStepNumber(GameTimer.TIME_100MS)}*/}
                        {/*</td>*/}
                    {/*</tr>*/}
                    <tr>
                        <td>
                            Step Number (250ms) = {this.state.timer.getStepNumber(GameTimer.TIME_250MS)}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            Step Number (500ms) = {this.state.timer.getStepNumber(GameTimer.TIME_500MS)}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            Step Number (1000ms) = {this.state.timer.getStepNumber(GameTimer.TIME_1000MS)}
                        </td>
                    </tr>
                </tbody>
            </table>
        );
    }
}

export default GameTimerTest;
