import Direction from "../../utils/Direction";
import Level from "../Level";
import Dot from "../Dot";
import Location from "../Location";

class LevelFactory {

    static _setTwoWayBorder(level, x, y, direction, value) {

        let cell = level.getCell(x, y);
        let otherLocation = new Location(x, y);
        otherLocation.moveInDirection(direction, level.height, level.width);
        let otherCell = level.getCellByLocation(otherLocation);

        cell.setSolidBorder(direction, value);
        otherCell.setSolidBorder(Direction.getOpposite(direction), value);

    }

    static createTestLevel() {
        let toRet = new Level(5, 5);

        LevelFactory._setTwoWayBorder(toRet, 2, 0, Direction.LEFT, true);
        LevelFactory._setTwoWayBorder(toRet, 2, 0, Direction.UP, true);
        LevelFactory._setTwoWayBorder(toRet, 2, 0, Direction.RIGHT, true);
        toRet.getCell(2, 0).dotType = Dot.BIG;

        LevelFactory._setTwoWayBorder(toRet, 2, 1, Direction.LEFT, true);
        LevelFactory._setTwoWayBorder(toRet, 2, 1, Direction.RIGHT, true);
        toRet.getCell(2, 1).dotType = Dot.LITTLE;

        toRet.getCell(2, 2).isPlayerSpawn = true;

        LevelFactory._setTwoWayBorder(toRet, 2, 3, Direction.LEFT, true);
        LevelFactory._setTwoWayBorder(toRet, 2, 3, Direction.RIGHT, true);
        toRet.getCell(2, 3).dotType = Dot.LITTLE;

        LevelFactory._setTwoWayBorder(toRet, 2, 4, Direction.LEFT, true);
        LevelFactory._setTwoWayBorder(toRet, 2, 4, Direction.RIGHT, true);
        LevelFactory._setTwoWayBorder(toRet, 2, 4, Direction.DOWN, true);
        toRet.getCell(2, 4).dotType = Dot.LITTLE;
        toRet.getCell(2, 4).isGhostRedSpawn = true;

        LevelFactory._setTwoWayBorder(toRet, 1, 2, Direction.UP, true);
        LevelFactory._setTwoWayBorder(toRet, 1, 2, Direction.DOWN, true);
        toRet.getCell(1, 2).solidBorder.top = true;
        toRet.getCell(1, 2).solidBorder.bottom = true;
        toRet.getCell(1, 2).dotType = Dot.LITTLE;

        LevelFactory._setTwoWayBorder(toRet, 0, 2, Direction.UP, true);
        LevelFactory._setTwoWayBorder(toRet, 0, 2, Direction.DOWN, true);
        LevelFactory._setTwoWayBorder(toRet, 0, 2, Direction.LEFT, true);
        toRet.getCell(0, 2).dotType = Dot.LITTLE;

        LevelFactory._setTwoWayBorder(toRet, 3, 2, Direction.UP, true);
        LevelFactory._setTwoWayBorder(toRet, 3, 2, Direction.DOWN, true);
        toRet.getCell(3, 2).dotType = Dot.LITTLE;

        LevelFactory._setTwoWayBorder(toRet, 4, 2, Direction.UP, true);
        LevelFactory._setTwoWayBorder(toRet, 4, 2, Direction.DOWN, true);
        LevelFactory._setTwoWayBorder(toRet, 4, 2, Direction.RIGHT, true);
        toRet.getCell(4, 2).dotType = Dot.LITTLE;

        return toRet;
    }

}

export default LevelFactory;