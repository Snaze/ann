

const death = -1.0;
const dot_little = 0.25;
const dot_big = 0.25;
const power_up = 0.75;
const win = 1.0;
const default_tick = -0.1;
const kill_ghost = 0.5;

class Rewards {

    static get DEATH() { return death; }
    static get DOT_LITTLE() { return dot_little; }
    static get DOT_BIG() { return dot_big; }
    static get POWER_UP() { return power_up; }
    static get WIN() { return win; }
    static get DEFAULT_TICK() { return default_tick; }
    static get KILL_GHOST() { return kill_ghost; }

}

export default Rewards;