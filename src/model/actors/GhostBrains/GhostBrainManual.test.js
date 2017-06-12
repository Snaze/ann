import Level from "../../Level";
import Ghost from "../Ghost";
import Player from "../Player";
import GhostBrainManual from "./GhostBrainManual";
import Direction from "../../../utils/Direction";
import moment from "../../../../node_modules/moment/moment";
import GhostBrainStrategyHoldingPin from "./GhostBrainStrategies/GhostBrainStrategyHoldingPin";
import GhostBrainStrategyWander from "./GhostBrainStrategies/GhostBrainStrategyWander";

it ("_canGhostSeePlayer works", () => {
    // SETUP
    let level = new Level(2, 2);
    let player = new Player(level, Player.MR_PAC_MAN);
    player.location.set(0, 0);
    player.direction = Direction.RIGHT;

    let ghost = new Ghost(level, Ghost.RED, player);
    ghost.location.set(1, 0);
    ghost.direction = Direction.LEFT;

    let gbm = new GhostBrainManual();

    // CALL
    let result = gbm._canGhostSeePlayer(ghost, player, level);

    // ASSERT
    expect(result).toBe(true);
});

it ("_canGhostSeePlayer works (not seeing - diff row)", () => {
    // SETUP
    let level = new Level(2, 2);
    let player = new Player(level, Player.MR_PAC_MAN);
    player.location.set(0, 1);
    player.direction = Direction.RIGHT;

    let ghost = new Ghost(level, Ghost.RED, player);
    ghost.location.set(1, 0);
    ghost.direction = Direction.LEFT;

    let gbm = new GhostBrainManual();

    // CALL
    let result = gbm._canGhostSeePlayer(ghost, player, level);

    // ASSERT
    expect(result).toBe(false);
});

it ("_canGhostSeePlayer works (same col - can see)", () => {
    // SETUP
    let level = new Level(2, 2);
    let player = new Player(level, Player.MR_PAC_MAN);
    player.location.set(0, 0);
    player.direction = Direction.DOWN;

    let ghost = new Ghost(level, Ghost.RED, player);
    ghost.location.set(0, 1);
    ghost.direction = Direction.UP;

    let gbm = new GhostBrainManual();

    // CALL
    let result = gbm._canGhostSeePlayer(ghost, player, level);

    // ASSERT
    expect(result).toBe(true);
});

it ("_canGhostSeePlayer works (same col - wrong direction)", () => {
    // SETUP
    let level = new Level(2, 2);
    let player = new Player(level, Player.MR_PAC_MAN);
    player.location.set(0, 0);
    player.direction = Direction.DOWN;

    let ghost = new Ghost(level, Ghost.RED, player);
    ghost.location.set(0, 1);
    ghost.direction = Direction.DOWN;

    let gbm = new GhostBrainManual();

    // CALL
    let result = gbm._canGhostSeePlayer(ghost, player, level);

    // ASSERT
    expect(result).toBe(false);
});

it ("_canGhostSeePlayer works (same col - can see)", () => {
    // SETUP
    let level = new Level(2, 2);
    let player = new Player(level, Player.MR_PAC_MAN);
    player.location.set(1, 0);
    player.direction = Direction.DOWN;

    let ghost = new Ghost(level, Ghost.RED, player);
    ghost.location.set(0, 1);
    ghost.direction = Direction.UP;

    let gbm = new GhostBrainManual();

    // CALL
    let result = gbm._canGhostSeePlayer(ghost, player, level);

    // ASSERT
    expect(result).toBe(false);
});

it ("_changeStateIfNeeded wont go into scared mode if already killed during current attack mode", () => {
    // SETUP
    let level = new Level(2, 2);
    let player = new Player(level, Player.MR_PAC_MAN);
    player.location.set(0, 0);
    player.direction = Direction.RIGHT;
    player._attackModeId = 1;
    player._attackModeFinishTime = moment().add(120, "s");

    let ghost = new Ghost(level, Ghost.RED, player);
    ghost.location.set(1, 1);
    ghost.direction = Direction.LEFT;
    ghost.prevKilledByAttackModeId = 1;

    let gbm = new GhostBrainManual();
    gbm._currentState = GhostBrainManual.GHOST_STATE_WANDER;

    // CALL
    gbm._changeStateIfNeeded(ghost, player, level);

    // ASSERT
    expect(gbm._currentState).toBe(GhostBrainManual.GHOST_STATE_WANDER);
});

it ("_changeStateIfNeeded will go into scared mode if not already killed during current attack mode", () => {
    // SETUP
    let level = new Level(2, 2);
    let player = new Player(level, Player.MR_PAC_MAN);
    player.location.set(0, 0);
    player.direction = Direction.RIGHT;
    player._attackModeId = 2;
    player._attackModeFinishTime = moment().add(120, "s");

    let ghost = new Ghost(level, Ghost.RED, player);
    ghost.location.set(1, 1);
    ghost.direction = Direction.LEFT;
    ghost.prevKilledByAttackModeId = 1;

    let gbm = new GhostBrainManual();
    gbm._currentState = GhostBrainManual.GHOST_STATE_WANDER;

    // CALL
    gbm._changeStateIfNeeded(ghost, player, level);

    // ASSERT
    expect(gbm._currentState).toBe(GhostBrainManual.GHOST_STATE_SCARED);
});

it ("getCellTransitionDuration should return ghostBrainStrategyHoldingPin minDuration", () => {
    // SETUP
    let level = new Level(2, 2);
    level.levelNum = 10;

    let gbm = new GhostBrainManual();
    gbm.enterState(GhostBrainManual.GHOST_STATE_HOLDING_PIN);
    let gbsw = new GhostBrainStrategyHoldingPin();

    // CALL
    let theDuration = gbm.getCellTransitionDuration(level);

    // ASSERT
    expect(theDuration).toBe(gbsw.cellTransitionDurationMin);
    expect(theDuration).toBe(gbsw.cellTransitionDurationMax);
});

it ("getCellTransitionDuration should return ghostBrainStrategyWander maxDuration", () => {
    // SETUP
    let level = new Level(2, 2);
    level.levelNum = 1;

    let gbm = new GhostBrainManual();
    gbm.enterState(GhostBrainManual.GHOST_STATE_WANDER);
    let gbsw = new GhostBrainStrategyWander();

    // CALL
    let theDuration = gbm.getCellTransitionDuration(level);

    // ASSERT
    expect(theDuration).toBe(gbsw.cellTransitionDurationMax);
});