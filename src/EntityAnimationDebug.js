import React, { Component } from 'react';
import "./Entity.css";
import "./images/PacManSprites.png";
import Entity from "./Entity";
import PropTypes from 'prop-types';

class EntityAnimationDebug extends Component {

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    render() {
        return (
            <div style={{backgroundColor: "Gray"}}>
                <Entity designator={Entity.DESIGNATOR_MRS_PAC_MAN}
                        modifier={Entity.MODIFIER_DIRECTION_UP}
                        animating={this.props.animating} />
                <Entity designator={Entity.DESIGNATOR_MRS_PAC_MAN}
                        modifier={Entity.MODIFIER_DIRECTION_RIGHT}
                        animating={this.props.animating} />
                <Entity designator={Entity.DESIGNATOR_MRS_PAC_MAN}
                        modifier={Entity.MODIFIER_DIRECTION_DOWN}
                        animating={this.props.animating} />
                <Entity designator={Entity.DESIGNATOR_MRS_PAC_MAN}
                        modifier={Entity.MODIFIER_DIRECTION_LEFT}
                        animating={this.props.animating} />
                    <Entity designator={Entity.DESIGNATOR_MRS_PAC_MAN}
                            modifier={Entity.MODIFIER_DEAD}
                            animating={this.props.animating} />

                <Entity designator={Entity.DESIGNATOR_PAC_MAN}
                        modifier={Entity.MODIFIER_DIRECTION_UP}
                        animating={this.props.animating} />
                <Entity designator={Entity.DESIGNATOR_PAC_MAN}
                        modifier={Entity.MODIFIER_DIRECTION_RIGHT}
                        animating={this.props.animating} />
                <Entity designator={Entity.DESIGNATOR_PAC_MAN}
                        modifier={Entity.MODIFIER_DIRECTION_DOWN}
                        animating={this.props.animating} />
                <Entity designator={Entity.DESIGNATOR_PAC_MAN}
                        modifier={Entity.MODIFIER_DIRECTION_LEFT}
                        animating={this.props.animating} />
            <Entity designator={Entity.DESIGNATOR_PAC_MAN}
                    modifier={Entity.MODIFIER_DEAD}
                    animating={this.props.animating} />

                <Entity designator={Entity.DESIGNATOR_RED_GHOST}
                        modifier={Entity.MODIFIER_DIRECTION_UP}
                        animating={this.props.animating} />
                <Entity designator={Entity.DESIGNATOR_RED_GHOST}
                        modifier={Entity.MODIFIER_DIRECTION_RIGHT}
                        animating={this.props.animating} />
                <Entity designator={Entity.DESIGNATOR_RED_GHOST}
                        modifier={Entity.MODIFIER_DIRECTION_DOWN}
                        animating={this.props.animating} />
                <Entity designator={Entity.DESIGNATOR_RED_GHOST}
                        modifier={Entity.MODIFIER_DIRECTION_LEFT}
                        animating={this.props.animating} />

                <Entity designator={Entity.DESIGNATOR_BLUE_GHOST}
                        modifier={Entity.MODIFIER_DIRECTION_UP}
                        animating={this.props.animating} />
                <Entity designator={Entity.DESIGNATOR_BLUE_GHOST}
                        modifier={Entity.MODIFIER_DIRECTION_RIGHT}
                        animating={this.props.animating} />
                <Entity designator={Entity.DESIGNATOR_BLUE_GHOST}
                        modifier={Entity.MODIFIER_DIRECTION_DOWN}
                        animating={this.props.animating} />
                <Entity designator={Entity.DESIGNATOR_BLUE_GHOST}
                        modifier={Entity.MODIFIER_DIRECTION_LEFT}
                        animating={this.props.animating} />

                <Entity designator={Entity.DESIGNATOR_ORANGE_GHOST}
                        modifier={Entity.MODIFIER_DIRECTION_UP}
                        animating={this.props.animating} />
                <Entity designator={Entity.DESIGNATOR_ORANGE_GHOST}
                        modifier={Entity.MODIFIER_DIRECTION_RIGHT}
                        animating={this.props.animating} />
                <Entity designator={Entity.DESIGNATOR_ORANGE_GHOST}
                        modifier={Entity.MODIFIER_DIRECTION_DOWN}
                        animating={this.props.animating} />
                <Entity designator={Entity.DESIGNATOR_ORANGE_GHOST}
                        modifier={Entity.MODIFIER_DIRECTION_LEFT}
                        animating={this.props.animating} />

                <Entity designator={Entity.DESIGNATOR_PINK_GHOST}
                        modifier={Entity.MODIFIER_DIRECTION_UP}
                        animating={this.props.animating} />
                <Entity designator={Entity.DESIGNATOR_PINK_GHOST}
                        modifier={Entity.MODIFIER_DIRECTION_RIGHT}
                        animating={this.props.animating} />
                <Entity designator={Entity.DESIGNATOR_PINK_GHOST}
                        modifier={Entity.MODIFIER_DIRECTION_DOWN}
                        animating={this.props.animating} />
                <Entity designator={Entity.DESIGNATOR_PINK_GHOST}
                        modifier={Entity.MODIFIER_DIRECTION_LEFT}
                        animating={this.props.animating} />

                <Entity designator={Entity.DESIGNATOR_SCARED_GHOST}
                        modifier={Entity.MODIFIER_DIRECTION_UP}
                        animating={this.props.animating} />
                <Entity designator={Entity.DESIGNATOR_SCARED_GHOST}
                        modifier={Entity.MODIFIER_DIRECTION_RIGHT}
                        animating={this.props.animating} />
                <Entity designator={Entity.DESIGNATOR_SCARED_GHOST}
                        modifier={Entity.MODIFIER_DIRECTION_DOWN}
                        animating={this.props.animating} />
                <Entity designator={Entity.DESIGNATOR_SCARED_GHOST}
                        modifier={Entity.MODIFIER_DIRECTION_LEFT}
                        animating={this.props.animating} />

                <Entity designator={Entity.DESIGNATOR_DEAD_GHOST}
                        modifier={Entity.MODIFIER_DIRECTION_UP}
                        animating={this.props.animating} />
                <Entity designator={Entity.DESIGNATOR_DEAD_GHOST}
                        modifier={Entity.MODIFIER_DIRECTION_RIGHT}
                        animating={this.props.animating} />
                <Entity designator={Entity.DESIGNATOR_DEAD_GHOST}
                        modifier={Entity.MODIFIER_DIRECTION_DOWN}
                        animating={this.props.animating} />
                <Entity designator={Entity.DESIGNATOR_DEAD_GHOST}
                        modifier={Entity.MODIFIER_DIRECTION_LEFT}
                        animating={this.props.animating} />

                <Entity designator={Entity.DESIGNATOR_FLASH_GHOST}
                        modifier={Entity.MODIFIER_DIRECTION_UP}
                        animating={this.props.animating} />
                <Entity designator={Entity.DESIGNATOR_FLASH_GHOST}
                        modifier={Entity.MODIFIER_DIRECTION_RIGHT}
                        animating={this.props.animating} />
                <Entity designator={Entity.DESIGNATOR_FLASH_GHOST}
                        modifier={Entity.MODIFIER_DIRECTION_DOWN}
                        animating={this.props.animating} />
                <Entity designator={Entity.DESIGNATOR_FLASH_GHOST}
                        modifier={Entity.MODIFIER_DIRECTION_LEFT}
                        animating={this.props.animating} />

                <Entity designator={Entity.DESIGNATOR_POWER_UP}
                        modifier={Entity.MODIFIER_POWER_UP_APPLE}
                        animating={this.props.animating} />
                <Entity designator={Entity.DESIGNATOR_POWER_UP}
                        modifier={Entity.MODIFIER_POWER_UP_BANANA}
                        animating={this.props.animating} />
                <Entity designator={Entity.DESIGNATOR_POWER_UP}
                        modifier={Entity.MODIFIER_POWER_UP_CHERRY}
                        animating={this.props.animating} />
                <Entity designator={Entity.DESIGNATOR_POWER_UP}
                        modifier={Entity.MODIFIER_POWER_UP_KEY}
                        animating={this.props.animating} />
                <Entity designator={Entity.DESIGNATOR_POWER_UP}
                        modifier={Entity.MODIFIER_POWER_UP_PEACH}
                        animating={this.props.animating} />
                <Entity designator={Entity.DESIGNATOR_POWER_UP}
                        modifier={Entity.MODIFIER_POWER_UP_PEAR}
                        animating={this.props.animating} />
                <Entity designator={Entity.DESIGNATOR_POWER_UP}
                        modifier={Entity.MODIFIER_POWER_UP_PRETZEL}
                        animating={this.props.animating} />
                <Entity designator={Entity.DESIGNATOR_POWER_UP}
                        modifier={Entity.MODIFIER_POWER_UP_STRAWBERRY}
                        animating={this.props.animating} />

                <Entity designator={Entity.DESIGNATOR_ACT}
                        modifier={Entity.MODIFIER_NO_MODIFIER}
                        animating={this.props.animating} />

                <Entity designator={Entity.DESIGNATOR_EYES}
                        modifier={Entity.MODIFIER_DIRECTION_UP}
                        animating={this.props.animating} />
                <Entity designator={Entity.DESIGNATOR_EYES}
                        modifier={Entity.MODIFIER_DIRECTION_RIGHT}
                        animating={this.props.animating} />
                <Entity designator={Entity.DESIGNATOR_EYES}
                        modifier={Entity.MODIFIER_DIRECTION_DOWN}
                        animating={this.props.animating} />
                <Entity designator={Entity.DESIGNATOR_EYES}
                        modifier={Entity.MODIFIER_DIRECTION_LEFT}
                        animating={this.props.animating} />

                <Entity designator={Entity.DESIGNATOR_HEART}
                        modifier={Entity.MODIFIER_NO_MODIFIER}
                        animating={this.props.animating} />

                <Entity designator={Entity.DESIGNATOR_TINY_ICON}
                        modifier={Entity.MODIFIER_TINY_ICON_POTION}
                        animating={this.props.animating} />
                <Entity designator={Entity.DESIGNATOR_TINY_ICON}
                        modifier={Entity.MODIFIER_TINY_ICON_LIFE}
                        animating={this.props.animating} />

                <Entity designator={Entity.DESIGNATOR_SWAN}
                        modifier={Entity.MODIFIER_NO_MODIFIER}
                        animating={this.props.animating} />

                <Entity designator={Entity.DESIGNATOR_BIG_SCORE}
                        modifier={Entity.MODIFIER_BIG_SCORE_200}
                        animating={this.props.animating} />
                <Entity designator={Entity.DESIGNATOR_BIG_SCORE}
                        modifier={Entity.MODIFIER_BIG_SCORE_400}
                        animating={this.props.animating} />
                <Entity designator={Entity.DESIGNATOR_BIG_SCORE}
                        modifier={Entity.MODIFIER_BIG_SCORE_800}
                        animating={this.props.animating} />
                <Entity designator={Entity.DESIGNATOR_BIG_SCORE}
                        modifier={Entity.MODIFIER_BIG_SCORE_1600}
                        animating={this.props.animating} />

                <Entity designator={Entity.DESIGNATOR_ROW_SCORE}
                        modifier={Entity.MODIFIER_ROW_SCORE_100}
                        animating={this.props.animating} />
                <Entity designator={Entity.DESIGNATOR_ROW_SCORE}
                        modifier={Entity.MODIFIER_ROW_SCORE_200}
                        animating={this.props.animating} />
                <Entity designator={Entity.DESIGNATOR_ROW_SCORE}
                        modifier={Entity.MODIFIER_ROW_SCORE_500}
                        animating={this.props.animating} />
                <Entity designator={Entity.DESIGNATOR_ROW_SCORE}
                        modifier={Entity.MODIFIER_ROW_SCORE_700}
                        animating={this.props.animating} />
                <Entity designator={Entity.DESIGNATOR_ROW_SCORE}
                        modifier={Entity.MODIFIER_ROW_SCORE_1000}
                        animating={this.props.animating} />
                <Entity designator={Entity.DESIGNATOR_ROW_SCORE}
                        modifier={Entity.MODIFIER_ROW_SCORE_2000}
                        animating={this.props.animating} />
                <Entity designator={Entity.DESIGNATOR_ROW_SCORE}
                        modifier={Entity.MODIFIER_ROW_SCORE_5000}
                        animating={this.props.animating} />
            </div>
        );
    }
}

EntityAnimationDebug.propTypes = {
    animating: PropTypes.bool
};

EntityAnimationDebug.defaultProps = {
    animating: true
};

export default EntityAnimationDebug;