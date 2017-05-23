import Direction from "../utils/Direction";

// TODO: Replace all usages of BorderType to use Direction
class BorderType {
    static get LEFT() { return Direction.LEFT; }
    static get TOP() { return Direction.UP; }
    static get RIGHT() { return Direction.RIGHT; }
    static get BOTTOM() { return Direction.DOWN; }

    static isValid(borderType) {
        return Direction.isValid(borderType);
    }
}

export default BorderType;