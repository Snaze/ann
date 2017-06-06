import CountDownMenu from "./CountDownMenu";

it ("Constructor works", ()  => {
    let countDownMenu = new CountDownMenu();

    expect(countDownMenu !== null).toBe(true);
});

it ("interval tick fires at 0", () => {
    // SETUP
    // let fired = false;
    // let callback = function (e) {
    //     fired = true;
    // };

    let countDownMenu = new CountDownMenu();
    countDownMenu.count = 1;

    // CALL
    countDownMenu.intervalTick({});

    // ASSERT
    expect(countDownMenu._interval === null).toBe(true);
});

it ("interval tick only fires at 0", () => {
    // SETUP
    let fired = false;
    let callback = function (e) {
        fired = true;
    };

    let countDownMenu = new CountDownMenu();
    countDownMenu.count = 2;
    countDownMenu.callback = callback;

    // CALL
    countDownMenu.intervalTick({});

    // ASSERT
    expect(fired).toBe(false);
});