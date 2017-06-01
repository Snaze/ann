import GameFooter from "./GameFooter";
import Player from "./actors/Player";
import Level from "./Level";

it ("get powerups works", () => {
    // SETUP
    let level = new Level();
    let player1 = new Player(level, Player.MR_PAC_MAN);
    let player2 = new Player(level, Player.MRS_PAC_MAN);
    let gf = new GameFooter(player1, player2, 1, GameFooter.ACTIVE_PLAYER_1);

    // CALL
    let powerups = gf.powerUps;

    // ASSERT
    expect(powerups.length).toBe(1);
    expect(powerups[0]).toBe("Cherry");
});

it ("get powerups works for level > 7", () => {
    // SETUP
    let level = new Level();
    let player1 = new Player(level, Player.MR_PAC_MAN);
    let player2 = new Player(level, Player.MRS_PAC_MAN);
    let gf = new GameFooter(player1, player2, 8, GameFooter.ACTIVE_PLAYER_1);

    // CALL
    let powerups = gf.powerUps;

    // ASSERT
    expect(powerups.length).toBe(7);
    expect(powerups[0]).toBe("Cherry");
    expect(powerups[1]).toBe("Strawberry");
    expect(powerups[2]).toBe("Orange");
    expect(powerups[3]).toBe("Pretzel");
    expect(powerups[4]).toBe("Apple");
    expect(powerups[5]).toBe("Pear");
    expect(powerups[6]).toBe("Banana");
});