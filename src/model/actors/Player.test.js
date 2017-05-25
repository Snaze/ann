import Player from "./Player";

it ("Player gender is valid", () => {

    expect(Player.genderIsValid(Player.MR_PAC_MAN)).toBe(true);
    expect(Player.genderIsValid(Player.MRS_PAC_MAN)).toBe(true);
    expect(Player.genderIsValid(3)).toBe(false);

});

// TODO: Fill out movement unit tests (test timerTick(e))