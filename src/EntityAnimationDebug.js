import React, { Component } from 'react';
import "./Entity.css";
import "./images/PacManSprites.png";
import Entity from "./Entity";

class EntityAnimationDebug extends Component {

    constructor(props) {
        super(props);

        this._interval = null;
        this.state = {
            stepNumber: 0
        };
    }

    intervalTick(e) {
        let stepNumber = this.state.stepNumber + 1;
        this.setState({
            stepNumber: stepNumber
        });
    }

    componentDidMount() {
        this._interval = setInterval((e) => this.intervalTick(e), 250);
    }

    componentWillUnmount() {
        if (this._interval !== null) {
            clearInterval(this._interval);
            this._interval = null;
        }
    }

    render() {
        return (
            <div style={{backgroundColor: "Gray"}}>
                <Entity designator={Entity.DESIGNATOR_MRS_PAC_MAN}
                        modifier={Entity.MODIFIER_DIRECTION_UP}
                        stepNumber={this.state.stepNumber} />
                <Entity designator={Entity.DESIGNATOR_MRS_PAC_MAN}
                        modifier={Entity.MODIFIER_DIRECTION_RIGHT}
                        stepNumber={this.state.stepNumber} />
                <Entity designator={Entity.DESIGNATOR_MRS_PAC_MAN}
                        modifier={Entity.MODIFIER_DIRECTION_DOWN}
                        stepNumber={this.state.stepNumber} />
                <Entity designator={Entity.DESIGNATOR_MRS_PAC_MAN}
                        modifier={Entity.MODIFIER_DIRECTION_LEFT}
                        stepNumber={this.state.stepNumber} />

                <Entity designator={Entity.DESIGNATOR_PAC_MAN}
                        modifier={Entity.MODIFIER_DIRECTION_UP}
                        stepNumber={this.state.stepNumber} />
                <Entity designator={Entity.DESIGNATOR_PAC_MAN}
                        modifier={Entity.MODIFIER_DIRECTION_RIGHT}
                        stepNumber={this.state.stepNumber} />
                <Entity designator={Entity.DESIGNATOR_PAC_MAN}
                        modifier={Entity.MODIFIER_DIRECTION_DOWN}
                        stepNumber={this.state.stepNumber} />
                <Entity designator={Entity.DESIGNATOR_PAC_MAN}
                        modifier={Entity.MODIFIER_DIRECTION_LEFT}
                        stepNumber={this.state.stepNumber} />

                <Entity designator={Entity.DESIGNATOR_RED_GHOST}
                        modifier={Entity.MODIFIER_DIRECTION_UP}
                        stepNumber={this.state.stepNumber} />
                <Entity designator={Entity.DESIGNATOR_RED_GHOST}
                        modifier={Entity.MODIFIER_DIRECTION_RIGHT}
                        stepNumber={this.state.stepNumber} />
                <Entity designator={Entity.DESIGNATOR_RED_GHOST}
                        modifier={Entity.MODIFIER_DIRECTION_DOWN}
                        stepNumber={this.state.stepNumber} />
                <Entity designator={Entity.DESIGNATOR_RED_GHOST}
                        modifier={Entity.MODIFIER_DIRECTION_LEFT}
                        stepNumber={this.state.stepNumber} />

                <Entity designator={Entity.DESIGNATOR_BLUE_GHOST}
                        modifier={Entity.MODIFIER_DIRECTION_UP}
                        stepNumber={this.state.stepNumber} />
                <Entity designator={Entity.DESIGNATOR_BLUE_GHOST}
                        modifier={Entity.MODIFIER_DIRECTION_RIGHT}
                        stepNumber={this.state.stepNumber} />
                <Entity designator={Entity.DESIGNATOR_BLUE_GHOST}
                        modifier={Entity.MODIFIER_DIRECTION_DOWN}
                        stepNumber={this.state.stepNumber} />
                <Entity designator={Entity.DESIGNATOR_BLUE_GHOST}
                        modifier={Entity.MODIFIER_DIRECTION_LEFT}
                        stepNumber={this.state.stepNumber} />

                <Entity designator={Entity.DESIGNATOR_ORANGE_GHOST}
                        modifier={Entity.MODIFIER_DIRECTION_UP}
                        stepNumber={this.state.stepNumber} />
                <Entity designator={Entity.DESIGNATOR_ORANGE_GHOST}
                        modifier={Entity.MODIFIER_DIRECTION_RIGHT}
                        stepNumber={this.state.stepNumber} />
                <Entity designator={Entity.DESIGNATOR_ORANGE_GHOST}
                        modifier={Entity.MODIFIER_DIRECTION_DOWN}
                        stepNumber={this.state.stepNumber} />
                <Entity designator={Entity.DESIGNATOR_ORANGE_GHOST}
                        modifier={Entity.MODIFIER_DIRECTION_LEFT}
                        stepNumber={this.state.stepNumber} />

                <Entity designator={Entity.DESIGNATOR_PINK_GHOST}
                        modifier={Entity.MODIFIER_DIRECTION_UP}
                        stepNumber={this.state.stepNumber} />
                <Entity designator={Entity.DESIGNATOR_PINK_GHOST}
                        modifier={Entity.MODIFIER_DIRECTION_RIGHT}
                        stepNumber={this.state.stepNumber} />
                <Entity designator={Entity.DESIGNATOR_PINK_GHOST}
                        modifier={Entity.MODIFIER_DIRECTION_DOWN}
                        stepNumber={this.state.stepNumber} />
                <Entity designator={Entity.DESIGNATOR_PINK_GHOST}
                        modifier={Entity.MODIFIER_DIRECTION_LEFT}
                        stepNumber={this.state.stepNumber} />

                <Entity designator={Entity.DESIGNATOR_SCARED_GHOST}
                        modifier={Entity.MODIFIER_DIRECTION_UP}
                        stepNumber={this.state.stepNumber} />
                <Entity designator={Entity.DESIGNATOR_SCARED_GHOST}
                        modifier={Entity.MODIFIER_DIRECTION_RIGHT}
                        stepNumber={this.state.stepNumber} />
                <Entity designator={Entity.DESIGNATOR_SCARED_GHOST}
                        modifier={Entity.MODIFIER_DIRECTION_DOWN}
                        stepNumber={this.state.stepNumber} />
                <Entity designator={Entity.DESIGNATOR_SCARED_GHOST}
                        modifier={Entity.MODIFIER_DIRECTION_LEFT}
                        stepNumber={this.state.stepNumber} />

                <Entity designator={Entity.DESIGNATOR_DEAD_GHOST}
                        modifier={Entity.MODIFIER_DIRECTION_UP}
                        stepNumber={this.state.stepNumber} />
                <Entity designator={Entity.DESIGNATOR_DEAD_GHOST}
                        modifier={Entity.MODIFIER_DIRECTION_RIGHT}
                        stepNumber={this.state.stepNumber} />
                <Entity designator={Entity.DESIGNATOR_DEAD_GHOST}
                        modifier={Entity.MODIFIER_DIRECTION_DOWN}
                        stepNumber={this.state.stepNumber} />
                <Entity designator={Entity.DESIGNATOR_DEAD_GHOST}
                        modifier={Entity.MODIFIER_DIRECTION_LEFT}
                        stepNumber={this.state.stepNumber} />

                <Entity designator={Entity.DESIGNATOR_POWER_UP}
                        modifier={Entity.MODIFIER_POWER_UP_APPLE}
                        stepNumber={this.state.stepNumber} />
                <Entity designator={Entity.DESIGNATOR_POWER_UP}
                        modifier={Entity.MODIFIER_POWER_UP_BANANA}
                        stepNumber={this.state.stepNumber} />
                <Entity designator={Entity.DESIGNATOR_POWER_UP}
                        modifier={Entity.MODIFIER_POWER_UP_CHERRY}
                        stepNumber={this.state.stepNumber} />
                <Entity designator={Entity.DESIGNATOR_POWER_UP}
                        modifier={Entity.MODIFIER_POWER_UP_KEY}
                        stepNumber={this.state.stepNumber} />
                <Entity designator={Entity.DESIGNATOR_POWER_UP}
                        modifier={Entity.MODIFIER_POWER_UP_PEACH}
                        stepNumber={this.state.stepNumber} />
                <Entity designator={Entity.DESIGNATOR_POWER_UP}
                        modifier={Entity.MODIFIER_POWER_UP_PEAR}
                        stepNumber={this.state.stepNumber} />
                <Entity designator={Entity.DESIGNATOR_POWER_UP}
                        modifier={Entity.MODIFIER_POWER_UP_PRETZEL}
                        stepNumber={this.state.stepNumber} />
                <Entity designator={Entity.DESIGNATOR_POWER_UP}
                        modifier={Entity.MODIFIER_POWER_UP_STRAWBERRY}
                        stepNumber={this.state.stepNumber} />

                <Entity designator={Entity.DESIGNATOR_ACT}
                        modifier={Entity.MODIFIER_NO_MODIFIER}
                        stepNumber={this.state.stepNumber} />

                <Entity designator={Entity.DESIGNATOR_EYES}
                        modifier={Entity.MODIFIER_DIRECTION_UP}
                        stepNumber={this.state.stepNumber} />
                <Entity designator={Entity.DESIGNATOR_EYES}
                        modifier={Entity.MODIFIER_DIRECTION_RIGHT}
                        stepNumber={this.state.stepNumber} />
                <Entity designator={Entity.DESIGNATOR_EYES}
                        modifier={Entity.MODIFIER_DIRECTION_DOWN}
                        stepNumber={this.state.stepNumber} />
                <Entity designator={Entity.DESIGNATOR_EYES}
                        modifier={Entity.MODIFIER_DIRECTION_LEFT}
                        stepNumber={this.state.stepNumber} />

                <Entity designator={Entity.DESIGNATOR_HEART}
                        modifier={Entity.MODIFIER_NO_MODIFIER}
                        stepNumber={this.state.stepNumber} />

                <Entity designator={Entity.DESIGNATOR_TINY_ICON}
                        modifier={Entity.MODIFIER_TINY_ICON_POTION}
                        stepNumber={this.state.stepNumber} />
                <Entity designator={Entity.DESIGNATOR_TINY_ICON}
                        modifier={Entity.MODIFIER_TINY_ICON_LIFE}
                        stepNumber={this.state.stepNumber} />

                <Entity designator={Entity.DESIGNATOR_SWAN}
                        modifier={Entity.MODIFIER_NO_MODIFIER}
                        stepNumber={this.state.stepNumber} />

                <Entity designator={Entity.DESIGNATOR_BIG_SCORE}
                        modifier={Entity.MODIFIER_BIG_SCORE_200}
                        stepNumber={this.state.stepNumber} />
                <Entity designator={Entity.DESIGNATOR_BIG_SCORE}
                        modifier={Entity.MODIFIER_BIG_SCORE_400}
                        stepNumber={this.state.stepNumber} />
                <Entity designator={Entity.DESIGNATOR_BIG_SCORE}
                        modifier={Entity.MODIFIER_BIG_SCORE_800}
                        stepNumber={this.state.stepNumber} />
                <Entity designator={Entity.DESIGNATOR_BIG_SCORE}
                        modifier={Entity.MODIFIER_BIG_SCORE_1600}
                        stepNumber={this.state.stepNumber} />

                <Entity designator={Entity.DESIGNATOR_ROW_SCORE}
                        modifier={Entity.MODIFIER_ROW_SCORE_100}
                        stepNumber={this.state.stepNumber} />
                <Entity designator={Entity.DESIGNATOR_ROW_SCORE}
                        modifier={Entity.MODIFIER_ROW_SCORE_200}
                        stepNumber={this.state.stepNumber} />
                <Entity designator={Entity.DESIGNATOR_ROW_SCORE}
                        modifier={Entity.MODIFIER_ROW_SCORE_500}
                        stepNumber={this.state.stepNumber} />
                <Entity designator={Entity.DESIGNATOR_ROW_SCORE}
                        modifier={Entity.MODIFIER_ROW_SCORE_700}
                        stepNumber={this.state.stepNumber} />
                <Entity designator={Entity.DESIGNATOR_ROW_SCORE}
                        modifier={Entity.MODIFIER_ROW_SCORE_1000}
                        stepNumber={this.state.stepNumber} />
                <Entity designator={Entity.DESIGNATOR_ROW_SCORE}
                        modifier={Entity.MODIFIER_ROW_SCORE_2000}
                        stepNumber={this.state.stepNumber} />
                <Entity designator={Entity.DESIGNATOR_ROW_SCORE}
                        modifier={Entity.MODIFIER_ROW_SCORE_5000}
                        stepNumber={this.state.stepNumber} />
            </div>
        );
    }
}

export default EntityAnimationDebug;