import GhostBrainStrategyScared from "./GhostBrainStrategyScared";
import Level from "../../../Level";
import Ghost from "../../../actors/Ghost";
import Player from "../../../actors/Player";
import Direction from "../../../../utils/Direction";

it ("getNextDirection works", () => {
    // SETUP
    let level = new Level(6, 6);
    let player = new Player(level, Player.MR_PAC_MAN);
    player.location.set(3, 3);
    let ghost = new Ghost(level, Ghost.RED, player);
    ghost.location.set(4, 3);
    let scaredStrat = new GhostBrainStrategyScared();
    let validDirections = [Direction.UP, Direction.RIGHT, Direction.DOWN];

    // CALL
    let nextDirection = scaredStrat.getNextDirection(ghost, player, level);

    // ASSERT
    expect(validDirections.indexOf(nextDirection) >= 0).toBe(true);
});