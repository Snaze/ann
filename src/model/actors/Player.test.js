import Player from "./Player";
import Level from "../Level";

it ("Player gender is valid", () => {

    expect(Player.genderIsValid(Player.MR_PAC_MAN)).toBe(true);
    expect(Player.genderIsValid(Player.MRS_PAC_MAN)).toBe(true);
    expect(Player.genderIsValid(3)).toBe(false);

});

it ("Player Constructor Sets initial location to playerSpawn", () => {
    // SETUP
    let theLevel = new Level();
    theLevel.playerSpawnLocation.set(1, 1);

    // CALL
    let thePlayer = new Player(theLevel, Player.MR_PAC_MAN);

    // ASSERT
    expect(thePlayer.location.isEqualTo(1, 1)).toBe(true);
    expect(thePlayer._spawnLocation.isEqualTo(1, 1)).toBe(true);
});

it ("moveBackToSpawn", () => {
    // SETUP
    let theLevel = new Level();
    theLevel.playerSpawnLocation.set(1, 1);
    let player = new Player(theLevel, Player.MR_PAC_MAN);

    // CALL
    player.moveBackToSpawn();

    // ASSERT
    expect(player.location.equals(player._spawnLocation)).toBe(true);
    expect(player._spawnLocation.isEqualTo(1, 1)).toBe(true);
});