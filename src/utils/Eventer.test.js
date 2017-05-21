import Eventer from "./Eventer";

it ("addCallback works", () => {
    let eventer = new Eventer();
    let callback = function (data) {
        return true;
    };
    eventer.addCallback(callback);

    expect(eventer._callbacks[0]).toBe(callback);
});

it ("removeCallback works", () => {
    let eventer = new Eventer();
    let callback = function (data) {
        return true;
    };
    eventer.addCallback(callback);

    expect(eventer._callbacks[0]).toBe(callback);

    eventer.removeCallback(callback);
    expect(eventer._callbacks.length).toBe(0);
});

it ("raiseEvent works", () => {
    let eventer = new Eventer();
    let theValue = null;
    let toBeValue = "test";

    let callback = function (data) {
        theValue = data;
    };
    eventer.addCallback(callback);

    expect(eventer._callbacks[0]).toBe(callback);

    eventer.raiseEvent(toBeValue);

    expect(theValue).toBe(toBeValue);
});