import GameObjectContainer from "../GameObjectContainer";
import LevelFactory from "./LevelFactory";
import PowerUp from "../actors/PowerUp";

class GameObjectContainerFactory {

    /**
     * -----------
     * |   |O|   |
     * |___|.|___|
     * |. . P . S|
     * |---|.|---|
     * |   |G|   |
     * -----------
     *
     * S = Strawberry
     * P = Player
     * G = Ghost
     * . = Little Dot
     * O = Big Dot
     * @returns {GameObjectContainer}
     */
    static createGameObjectContainer() {
        let level = LevelFactory.createTestLevel();
        let goc = new GameObjectContainer(level);
        goc.powerUp.location.set(4, 2);
        goc.powerUp.powerUpType = PowerUp.POWER_UP_STRAWBERRY;
        goc.powerUp.isAlive = true;

        return goc;
    }
}

export default GameObjectContainerFactory;