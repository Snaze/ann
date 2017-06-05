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

it ("timerTick doesn't bomb if the player's location isn't set", () => {
    // SETUP
    let theLevel = new Level(1, 1);
    theLevel.playerSpawnLocation.set(-1, -1);
    let player = new Player(theLevel, Player.MR_PAC_MAN);
    expect(player.location.isEqualTo(-1, -1)).toBe(true);

    // CALL
    player.timerTick({});
});

it ("setting isAlive to false resets _attackModeFinishTime", () => {
    // SETUP
    let theLevel = new Level(1, 1);
    theLevel.playerSpawnLocation.set(0, 0);
    let player = new Player(theLevel, Player.MR_PAC_MAN);
    player._attackModeFinishTime = moment().add(120, "s");

    // CALL
    player.isAlive = false;

    // ASSERT
    expect(player._attackModeFinishTime <= moment()).toBe(true);
});

it ("when the level changes reset the player's location and dotsEaten", () => {
    // SETUP
    let theLevel = new Level(3, 3);
    theLevel.playerSpawnLocation.set(1, 1);
    let player = new Player(theLevel, Player.MR_PAC_MAN);
    player._dotsEaten = 2;
    let theLevel2 = new Level(3, 3);
    theLevel2.playerSpawnLocation.set(2, 2);

    // CALL
    player.level = theLevel2;

    // ASSERT
    expect(player.location.isEqualTo(2, 2)).toBe(true);
    expect(player.spawnLocation.isEqualTo(2, 2)).toBe(true);
    expect(player.dotsEaten).toBe(0);

});

it ("when the level changes the cell transition duration should be updated", () => {
    // SETUP
    let theLevel = new Level(3, 3);
    theLevel.levelNum = 5;
    let player = new Player(theLevel, Player.MR_PAC_MAN);
    let theLevelMin = new Level(3, 3);
    theLevelMin.levelNum = 1;
    let theLevelMax = new Level(3, 3);
    theLevelMax.levelNum = 17;
    let theLevelMid = new Level(3, 3);
    theLevelMid.levelNum = 10;

    // CALL and ASSERT
    player.level = theLevelMin;
    expect(player.cellTransitionDuration === Player.MAX_CELL_DURATION).toBe(true);

    // CALL and ASSERT
    player.level = theLevelMax;
    expect(player.cellTransitionDuration === Player.MIN_CELL_DURATION).toBe(true);

    // CALL and ASSERT
    player.level = theLevelMid;
    expect(player.cellTransitionDuration > Player.MIN_CELL_DURATION).toBe(true);
    expect(player.cellTransitionDuration < Player.MAX_CELL_DURATION).toBe(true);
});

it ("player constructor should set cellDuration maxRange", () => {
    // SETUP
    let theLevel = new Level(3, 3);
    theLevel.levelNum = 1;

    // CALL
    let player = new Player(theLevel, Player.MR_PAC_MAN);

    // ASSERT
    expect(player.cellTransitionDuration).toBe(Player.MAX_CELL_DURATION);
});

it ("player constructor should set cellDuration minRange", () => {
    // SETUP
    let theLevel = new Level(3, 3);
    theLevel.levelNum = 17;

    // CALL
    let player = new Player(theLevel, Player.MR_PAC_MAN);

    // ASSERT
    expect(player.cellTransitionDuration).toBe(Player.MIN_CELL_DURATION);
});

it ("player constructor should set cellDuration midRange", () => {
    // SETUP
    let theLevel = new Level(3, 3);
    theLevel.levelNum = 2;

    // CALL
    let player = new Player(theLevel, Player.MR_PAC_MAN);

    // ASSERT
    expect(player.cellTransitionDuration < Player.MAX_CELL_DURATION).toBe(true);
    expect(player.cellTransitionDuration > Player.MIN_CELL_DURATION).toBe(true);
});

it ("setting level should reset the attackModeFinishTime", () => {
    // SETUP
    let theLevel = new Level(3, 3);
    theLevel.levelNum = 2;
    let player = new Player(theLevel, Player.MR_PAC_MAN);
    player._attackModeFinishTime = moment().add(120, "s");

    // CALL
    player.level = new Level(2, 2);

    // ASSERT
    expect(player._attackModeFinishTime < moment()).toBe(true);
});

it ("test getAttackDuration()", () => {
    // SETUP
    let theLevel = new Level(3, 3);

    // CALL
    theLevel.levelNum = 1;
    let maxAttackDuration = Player.getAttackDuration(theLevel);

    theLevel.levelNum = Level.TOTAL_LEVELS;
    let minAttackDuration = Player.getAttackDuration(theLevel);

    theLevel.levelNum = Math.floor(Level.TOTAL_LEVELS / 2);
    let midAttackDuration = Player.getAttackDuration(theLevel);

    // ASSERT
    expect(maxAttackDuration).toBe(Player.MAX_ATTACK_DURATION);
    expect(minAttackDuration).toBe(Player.MIN_ATTACK_DURATION);
    expect(Player.MAX_ATTACK_DURATION > midAttackDuration && Player.MIN_ATTACK_DURATION < midAttackDuration).toBe(true);
});

const testEatBigDot = function (levelNum, attackFinishTime) {
    // SETUP
    let theLevel = new Level(3, 3);
    theLevel.levelNum = levelNum;
    let theCell = theLevel.getCell(0, 0);
    theCell.dotType = Dot.BIG;
    let thePlayer = new Player(theLevel, Player.MR_PAC_MAN);
    thePlayer.location.set(0, 0);

    // CALL
    thePlayer._eatBigDot(theCell);

    // ASSERT
    expect(thePlayer.attackModeFinishTime >= attackFinishTime).toBe(true);

};

it ("test eatBigDot", () => {
    testEatBigDot(1, moment().add(Player.MAX_ATTACK_DURATION, "s"));
    testEatBigDot(Math.floor(Level.TOTAL_LEVELS / 2), moment().add(Player.MIN_ATTACK_DURATION, "s"));
    testEatBigDot(Level.TOTAL_LEVELS, moment().add(Player.MIN_ATTACK_DURATION, "s"));
});