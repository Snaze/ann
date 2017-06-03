import Player from "./Player";
import Level from "../Level";
import Location from "../Location";
import Dot from "../Dot";
import moment from "../../../node_modules/moment/moment";

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

it ("player spawn location updates on _nestedDataSourceChanged", () => {
    // SETUP
    let theLevel = new Level();
    theLevel.playerSpawnLocation.set(1, 1);
    let player = new Player(theLevel, Player.MR_PAC_MAN);
    let originalLocation = player.location.clone();

    // CALL
    theLevel.playerSpawnLocation.set(1, 2);

    // ASSERT
    expect(player._spawnLocation.isEqualTo(1, 2)).toBe(true);
    expect(player.location.equals(originalLocation)).toBe(true);
});

it ("player spawn location updates on _nestedDataSourceChanged in editMode", () => {
    // SETUP
    let theLevel = new Level();
    theLevel.playerSpawnLocation.set(1, 1);
    theLevel.editMode = true;
    let player = new Player(theLevel, Player.MR_PAC_MAN);
    player.editMode = true;
    // let originalLocation = player.location.clone();

    // CALL
    theLevel.playerSpawnLocation.set(1, 2);

    // ASSERT
    expect(player._spawnLocation.isEqualTo(1, 2)).toBe(true);
    expect(player.location.isEqualTo(1, 2)).toBe(true);
});

it ("handleLocationChange should increment attackModeId", () => {
    // SETUP
    let theLevel = new Level();
    theLevel.playerSpawnLocation.set(0, 1);
    let theCell = theLevel.getCellByLocation(new Location(1, 1));
    theCell.dotType = Dot.BIG;
    let player = new Player(theLevel, Player.MR_PAC_MAN);
    let origAttackModeId = player.attackModeId;

    // CALL
    player.handleLocationChanged(new Location(1, 1));

    // ASSERT
    expect(player.attackModeId).toBe(origAttackModeId + 1);
});

it ("handleLocationChange should not increment attackModeId when its already active", () => {
    // SETUP
    let theLevel = new Level();
    theLevel.playerSpawnLocation.set(0, 1);
    let theCell = theLevel.getCellByLocation(new Location(1, 1));
    theCell.dotType = Dot.BIG;
    let player = new Player(theLevel, Player.MR_PAC_MAN);
    player._attackModeFinishTime = moment().add(120, "s");
    let origAttackModeId = player.attackModeId;

    // CALL
    player.handleLocationChanged(new Location(1, 1));

    // ASSERT
    expect(player.attackModeId).toBe(origAttackModeId);
});

it ("handleLocationChange should reset location if cell doesn't exist", () => {
    // SETUP
    let theLevel = new Level(1, 1);
    theLevel.playerSpawnLocation.set(0, 0);
    let player = new Player(theLevel, Player.MR_PAC_MAN);
    expect(player.location.isEqualTo(0, 0)).toBe(true);

    // CALL
    player.handleLocationChanged(new Location(1, 1));

    // ASSERT
    expect(player.location.isEqualTo(-1, -1)).toBe(true);
});

it ("handleLocationChange shouldnt bomb if the location is -1, -1", () => {
    // SETUP
    let theLevel = new Level(1, 1);
    theLevel.playerSpawnLocation.set(0, 0);
    let player = new Player(theLevel, Player.MR_PAC_MAN);
    expect(player.location.isEqualTo(0, 0)).toBe(true);
    player.location.set(-1, -1);

    // CALL
    player.handleLocationChanged(player.location);

    // ASSERT
    expect(player.location.isEqualTo(-1, -1)).toBe(true);
});