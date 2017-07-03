import GameObjectContainer from "../GameObjectContainer";
import LevelFactory from "./LevelFactory";
import PowerUp from "../actors/PowerUp";

class GameObjectContainerFactory {
    static createGameObjectContainer() {
        let level = LevelFactory.createTestLevel();
        let goc = new GameObjectContainer(level);
        goc.powerUp.location.set(4, 2);
        goc.powerUp.powerUpType = PowerUp.POWER_UP_STRAWBERRY;

        return goc;
    }
}

export default GameObjectContainerFactory;