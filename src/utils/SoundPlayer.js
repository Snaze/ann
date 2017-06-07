import howler from "../../node_modules/howler/dist/howler";
import begin_wav from "../sounds/pacman_beginning.wav";
import begin_mp3 from "../sounds/pacman_beginning.mp3";
import chomp_wav from "../sounds/pacman_chomp.wav";
import chomp_mp3 from "../sounds/pacman_chomp.mp3";
import death_wav from "../sounds/pacman_death.wav";
import death_mp3 from "../sounds/pacman_death.mp3";
import eatfruit_wav from "../sounds/pacman_eatfruit.wav";
import eatfruit_mp3 from "../sounds/pacman_eatfruit.mp3";
import eatghost_wav from "../sounds/pacman_eatghost.wav";
import eatghost_mp3 from "../sounds/pacman_eatghost.mp3";
import extrapac_wav from "../sounds/pacman_extrapac.wav";
import extrapac_mp3 from "../sounds/pacman_extrapac.mp3";
import intermission_wav from "../sounds/pacman_intermission.wav";
import intermission_mp3 from"../sounds/pacman_intermission.mp3";

let _singleton = Symbol();

class SoundPlayer {

    constructor(singletonToken) {
        if (_singleton !== singletonToken){
            throw new Error('Cannot instantiate directly.');
        }

        this._playFinishedCallbackRef = (e) => this._playFinishedCallback(e);
        this._beginning = null;
        this._chomp = null;
        this._death = null;
        this._eatfruit = null;
        this._eatghost = null;
        this._extrapac = null;
        this._intermission = null;
        this._callbacks = {};
    }

    static get instance() {
        if(!this[_singleton]) {
            this[_singleton] = new SoundPlayer(_singleton);
        }

        return this[_singleton];
    }

    _createHowl(mp3Path, wavPath) {
        return new howler.Howl({
            src: [mp3Path, wavPath],
            format: ['mp3', 'wav'],
            volume: 1.0,
            onend: this._playFinishedCallbackRef
        });
    }

    _setPropIfNotExists(prop, path) {
        if (this[prop] === null) {
            this[prop] = this._createHowl(path);
        }
    }

    _playFinishedCallback(id) {
        // console.log("callback id = " + id);

        if (this._callbacks[id]) {
            this._callbacks[id](id);
            delete this._callbacks[id];
        }
    }

    play(theSound, callback) {
        let id = theSound.play();
        // is this whack?
        this._callbacks[id] = callback;
        return id;
    }

    get beginning() {
        this._setPropIfNotExists("_beginning", begin_mp3, begin_wav);

        return this._beginning;
    }

    get chomp() {
        this._setPropIfNotExists("_chomp", chomp_mp3, chomp_wav);

        return this._chomp;
    }

    get death() {
        this._setPropIfNotExists("_death", death_mp3, death_wav);

        return this._death;
    }

    get eatfruit() {
        this._setPropIfNotExists("_eatfruit", eatfruit_mp3, eatfruit_wav);

        return this._eatfruit;
    }

    get eatghost() {
        this._setPropIfNotExists("_eatghost", eatghost_mp3, eatghost_wav);

        return this._eatghost;
    }

    get extrapac() {
        this._setPropIfNotExists("_extrapac", extrapac_mp3, extrapac_wav);

        return this._extrapac;
    }

    get intermission() {
        this._setPropIfNotExists("_intermission", intermission_mp3, intermission_wav);

        return this._intermission;
    }
}

export default SoundPlayer;