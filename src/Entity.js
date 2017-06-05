import React, { Component } from 'react';
import "./Entity.css";
import "./images/PacManSprites.png";
import PropTypes from 'prop-types';
import GameTimer from "./model/GameTimer";

/** DESIGNATORS **/
const mrs_pac_man = "mrs_pac_man";
const pac_man = "pac_man";
const red_ghost = "red_ghost";
const orange_ghost = "orange_ghost";
const pink_ghost = "pink_ghost";
const blue_ghost = "blue_ghost";
const scared_ghost = "scared_ghost";
const dead_ghost = "dead_ghost";
const flash_ghost = "flash_ghost";
const power_up = "power_up";
const act = "act";
const eyes = "eyes";
const heart = "heart";
const tiny_icon = "tiny_icon";
const swan = "swan";
const big_score = "big_score";
const row_score = "row_score";
const none = "none";

/** MODIFIERS **/
const direction_left = "direction_left";
const direction_up = "direction_up";
const direction_right = "direction_right";
const direction_down = "direction_down";
const dead = "dead";

const power_up_cherry = "power_up_cherry";
const power_up_strawberry = "power_up_strawberry";
const power_up_peach = "power_up_peach";
const power_up_pretzel = "power_up_pretzel";
const power_up_apple = "power_up_apple";
const power_up_pear = "power_up_pear";
const power_up_banana = "power_up_banana";
const power_up_key = "power_up_key";

const tiny_icon_potion = "tiny_icon_potion";
const tiny_icon_life = "tiny_icon_life";

const big_score_200 = "big_score_200";
const big_score_400 = "big_score_400";
const big_score_800 = "big_score_800";
const big_score_1600 = "big_score_1600";

const row_score_100 = "row_score_100";
const row_score_200 = "row_score_200";
const row_score_500 = "row_score_500";
const row_score_700 = "row_score_700";
const row_score_1000 = "row_score_1000";
const row_score_2000 = "row_score_2000";
const row_score_5000 = "row_score_5000";

const no_modifier = "no_modifier";

// TODO: You could have probably done all these animations in CSS
// which would have been cleaner.  I'll plan on doing that in the future.
const frame_mappings = {
    mrs_pac_man: {
        direction_left: [
            "Entity RowEntity MrsPacManLeftOpen",
            "Entity RowEntity MrsPacManLeftMid",
            "Entity RowEntity MrsPacManLeftClose",
            "Entity RowEntity MrsPacManLeftMid",
        ],
        direction_up: [
            "Entity RowEntity MrsPacManUpOpen",
            "Entity RowEntity MrsPacManUpMid",
            "Entity RowEntity MrsPacManUpClose",
            "Entity RowEntity MrsPacManUpMid"
        ],
        direction_right: [
            "Entity RowEntity MrsPacManRightOpen",
            "Entity RowEntity MrsPacManRightMid",
            "Entity RowEntity MrsPacManRightClose",
            "Entity RowEntity MrsPacManRightMid"
        ],
        direction_down: [
            "Entity RowEntity MrsPacManDownOpen",
            "Entity RowEntity MrsPacManDownMid",
            "Entity RowEntity MrsPacManDownClose",
            "Entity RowEntity MrsPacManDownMid"
        ],
        dead: [
            "Entity RowEntity MrsPacManLeftMid",
            "Entity RowEntity MrsPacManUpMid",
            "Entity RowEntity MrsPacManRightMid",
            "Entity RowEntity MrsPacManDownMid"
        ]
    },
    pac_man: {
        direction_left: [
            "Entity RowEntity PacManLeftOpen",
            "Entity RowEntity PacManLeftMid",
            "Entity RowEntity PacManLeftClose",
            "Entity RowEntity PacManLeftMid",
        ],
        direction_up: [
            "Entity RowEntity PacManUpOpen",
            "Entity RowEntity PacManUpMid",
            "Entity RowEntity PacManUpClose",
            "Entity RowEntity PacManUpMid"
        ],
        direction_right: [
            "Entity RowEntity PacManRightOpen",
            "Entity RowEntity PacManRightMid",
            "Entity RowEntity PacManRightClose",
            "Entity RowEntity PacManRightMid"
        ],
        direction_down: [
            "Entity RowEntity PacManDownOpen",
            "Entity RowEntity PacManDownMid",
            "Entity RowEntity PacManDownClose",
            "Entity RowEntity PacManDownMid"
        ],
        dead: [
            "Entity RowEntity PacManLeftMid",
            "Entity RowEntity PacManUpMid",
            "Entity RowEntity PacManRightMid",
            "Entity RowEntity PacManDownMid"
        ]
    },
    red_ghost: {
        direction_left: ["Entity RowEntity GhostRedLeft1", "Entity RowEntity GhostRedLeft2"],
        direction_up: ["Entity RowEntity GhostRedUp1", "Entity RowEntity GhostRedUp2"],
        direction_right: ["Entity RowEntity GhostRedRight1", "Entity RowEntity GhostRedRight2"],
        direction_down: ["Entity RowEntity GhostRedDown1", "Entity RowEntity GhostRedDown2"]
    },
    orange_ghost: {
        direction_left: ["Entity RowEntity GhostOrangeLeft1", "Entity RowEntity GhostOrangeLeft2"],
        direction_up: ["Entity RowEntity GhostOrangeUp1", "Entity RowEntity GhostOrangeUp2"],
        direction_right: ["Entity RowEntity GhostOrangeRight1", "Entity RowEntity GhostOrangeRight2"],
        direction_down: ["Entity RowEntity GhostOrangeDown1", "Entity RowEntity GhostOrangeDown2"]
    },
    pink_ghost: {
        direction_left: ["Entity RowEntity GhostPinkLeft1", "Entity RowEntity GhostPinkLeft2"],
        direction_up: ["Entity RowEntity GhostPinkUp1", "Entity RowEntity GhostPinkUp2"],
        direction_right: ["Entity RowEntity GhostPinkRight1", "Entity RowEntity GhostPinkRight2"],
        direction_down: ["Entity RowEntity GhostPinkDown1", "Entity RowEntity GhostPinkDown2"]
    },
    blue_ghost: {
        direction_left: ["Entity RowEntity GhostBlueLeft1", "Entity RowEntity GhostBlueLeft2"],
        direction_up: ["Entity RowEntity GhostBlueUp1", "Entity RowEntity GhostBlueUp2"],
        direction_right: ["Entity RowEntity GhostBlueRight1", "Entity RowEntity GhostBlueRight2"],
        direction_down: ["Entity RowEntity GhostBlueDown1", "Entity RowEntity GhostBlueDown2"]
    },
    scared_ghost: {
        direction_left: ["Entity RowEntity GhostScared1", "Entity RowEntity GhostScared2"],
        direction_up: ["Entity RowEntity GhostScared1", "Entity RowEntity GhostScared2"],
        direction_right: ["Entity RowEntity GhostScared1", "Entity RowEntity GhostScared2"],
        direction_down: ["Entity RowEntity GhostScared1", "Entity RowEntity GhostScared2"]
    },
    dead_ghost: {
        direction_left: ["Entity RowEntity GhostDead1", "Entity RowEntity GhostDead2"],
        direction_up: ["Entity RowEntity GhostDead1", "Entity RowEntity GhostDead2"],
        direction_right: ["Entity RowEntity GhostDead1", "Entity RowEntity GhostDead2"],
        direction_down: ["Entity RowEntity GhostDead1", "Entity RowEntity GhostDead2"]
    },
    flash_ghost: {
        direction_left: ["Entity RowEntity GhostScared1", "Entity RowEntity GhostDead2"],
        direction_up: ["Entity RowEntity GhostScared1", "Entity RowEntity GhostDead2"],
        direction_right: ["Entity RowEntity GhostScared1", "Entity RowEntity GhostDead2"],
        direction_down: ["Entity RowEntity GhostScared1", "Entity RowEntity GhostDead2"]
    },
    power_up: {
        power_up_cherry: ["Entity RowEntity Cherry"],
        power_up_strawberry: ["Entity RowEntity Strawberry"],
        power_up_peach: ["Entity RowEntity Peach"],
        power_up_pretzel: ["Entity RowEntity Pretzel"],
        power_up_apple: ["Entity RowEntity Apple"],
        power_up_pear: ["Entity RowEntity Pear"],
        power_up_banana: ["Entity RowEntity Banana"],
        power_up_key: ["Entity RowEntity Key"],
    },
    act: {
        no_modifier: ["Entity ActEntity ActOpen", "Entity ActEntity ActMid", "Entity ActEntity ActClosed"]
    },
    eyes: {
        direction_left: ["Entity RowEntity EyesLeft"],
        direction_up: ["Entity RowEntity EyesUp"],
        direction_right: ["Entity RowEntity EyesRight"],
        direction_down: ["Entity RowEntity EyesDown"]
    },
    heart: {
        no_modifier: ["Entity RowEntity Heart"]
    },
    tiny_icon: {
        tiny_icon_potion: ["Entity TinyIcon Potion"],
        tiny_icon_life: ["Entity TinyIcon Life"]
    },
    swan: {
        no_modifier: ["Entity Swan SwanUp", "Entity Swan SwanDown"]
    },
    big_score: {
        big_score_200:  ["Entity BigScore BigScore200"],
        big_score_400:  ["Entity BigScore BigScore400"],
        big_score_800:  ["Entity BigScore BigScore800"],
        big_score_1600: ["Entity BigScore BigScore1600"]
    },
    row_score: {
        row_score_100:  ["Entity RowEntity Score100"],
        row_score_200:  ["Entity RowEntity Score200"],
        row_score_500:  ["Entity RowEntity Score500"],
        row_score_700:  ["Entity RowEntity Score700"],
        row_score_1000: ["Entity RowEntity Score1000"],
        row_score_2000: ["Entity RowEntity Score2000"],
        row_score_5000: ["Entity RowEntity Score5000"]
    },
    none: {
        no_modifier: ["EntityInvisible"]
    }
};

class Entity extends Component {

    static get DESIGNATOR_MRS_PAC_MAN() { return mrs_pac_man; }
    static get DESIGNATOR_PAC_MAN() { return pac_man; }
    static get DESIGNATOR_RED_GHOST() { return red_ghost; }
    static get DESIGNATOR_ORANGE_GHOST() { return orange_ghost; }
    static get DESIGNATOR_PINK_GHOST() { return pink_ghost; }
    static get DESIGNATOR_BLUE_GHOST() { return blue_ghost; }
    static get DESIGNATOR_SCARED_GHOST() { return scared_ghost; }
    static get DESIGNATOR_DEAD_GHOST() { return dead_ghost; }
    static get DESIGNATOR_FLASH_GHOST() { return flash_ghost; }
    static get DESIGNATOR_POWER_UP() { return power_up; }
    static get DESIGNATOR_ACT() { return act; }
    static get DESIGNATOR_EYES() { return eyes; }
    static get DESIGNATOR_HEART() { return heart; }
    static get DESIGNATOR_TINY_ICON() { return tiny_icon; }
    static get DESIGNATOR_SWAN() { return swan; }
    static get DESIGNATOR_BIG_SCORE() { return big_score; }
    static get DESIGNATOR_ROW_SCORE() { return row_score; }
    static get DESIGNATOR_NONE() { return none; }

    static get MODIFIER_DIRECTION_UP() { return direction_up; }
    static get MODIFIER_DIRECTION_LEFT() { return direction_left }
    static get MODIFIER_DIRECTION_RIGHT() { return direction_right; }
    static get MODIFIER_DIRECTION_DOWN() { return direction_down; }
    static get MODIFIER_DEAD() { return dead; }

    static get MODIFIER_POWER_UP_CHERRY() { return power_up_cherry; }
    static get MODIFIER_POWER_UP_STRAWBERRY() { return power_up_strawberry; }
    static get MODIFIER_POWER_UP_PEACH() { return power_up_peach; }
    static get MODIFIER_POWER_UP_PRETZEL() { return power_up_pretzel; }
    static get MODIFIER_POWER_UP_APPLE() { return power_up_apple; }
    static get MODIFIER_POWER_UP_PEAR() { return power_up_pear; }
    static get MODIFIER_POWER_UP_BANANA() { return power_up_banana; }
    static get MODIFIER_POWER_UP_KEY() { return power_up_key; }

    static get MODIFIER_TINY_ICON_POTION() { return tiny_icon_potion; }
    static get MODIFIER_TINY_ICON_LIFE() { return tiny_icon_life; }

    static get MODIFIER_BIG_SCORE_200() { return big_score_200; }
    static get MODIFIER_BIG_SCORE_400() { return big_score_400; }
    static get MODIFIER_BIG_SCORE_800() { return big_score_800; }
    static get MODIFIER_BIG_SCORE_1600() { return big_score_1600; }

    static get MODIFIER_ROW_SCORE_100() { return row_score_100; }
    static get MODIFIER_ROW_SCORE_200() { return row_score_200; }
    static get MODIFIER_ROW_SCORE_500() { return row_score_500; }
    static get MODIFIER_ROW_SCORE_700() { return row_score_700; }
    static get MODIFIER_ROW_SCORE_1000() { return row_score_1000; }
    static get MODIFIER_ROW_SCORE_2000() { return row_score_2000; }
    static get MODIFIER_ROW_SCORE_5000() { return row_score_5000; }

    static get MODIFIER_NO_MODIFIER() { return no_modifier; }

    constructor(props) {
        super(props);
        this._tickHandler = (e) => this.gameTimerTick(e);

        this.state = {
            stepNumber: 0
        };
    }

    gameTimerTick(e) {

        this.setState({
            stepNumber: e[GameTimer.TIME_250MS]
        });
    }

    componentWillReceiveProps(nextProps, oldProps) {
        if (!this.props.animating && nextProps.animating) {
            GameTimer.instance.addCallback(this._tickHandler);
        } else if (this.props.animating && !nextProps.animating) {
            GameTimer.instance.removeCallback(this._tickHandler);
        }
    }

    componentDidMount() {
        if (this.props.animating) {
            GameTimer.instance.addCallback(this._tickHandler);
        }
    }

    componentWillUnmount() {
        GameTimer.instance.removeCallback(this._tickHandler);
    }

    currentClassName() {
        let frames = frame_mappings[this.props.designator][this.props.modifier];
        if (typeof(frames) === "undefined") {
            throw new Error("Invalid Mapping Detected between " +
                this.props.designator +
                " and " +
                this.props.modifier);
        }

        let frameNumber = this.state.stepNumber % frames.length;
        let toRet = frames[frameNumber];
        if (this.props.blink) {
            toRet += " EntityBlink";
        }
        return toRet;
    }

    render() {
        return (<div className={this.currentClassName()}></div>);
    }

}

Entity.propTypes = {
    designator: PropTypes.string.isRequired,
    modifier: PropTypes.string.isRequired,
    animating: PropTypes.bool,
    blink: PropTypes.bool
};

Entity.defaultProps = {
    animating: true,
    blink: false
};

export default Entity;