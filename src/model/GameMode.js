
const game_mode_play = 0;
const game_mode_train = 1;
const game_mode_watch = 2;
const game_mode_watch_pre_trained = 3;
const game_mode_all = [
    game_mode_play,
    game_mode_train,
    game_mode_watch,
    game_mode_watch_pre_trained
];

class GameMode {
    static get PLAY() { return game_mode_play; }
    static get TRAIN() { return game_mode_train; }
    static get WATCH() { return game_mode_watch; }
    static get WATCH_PRE_TRAINED() { return game_mode_watch_pre_trained; }
    static get ALL() { return game_mode_all; }
}

export default GameMode;