import LinkedList from "./LinkedList";

it ("constructor works", () => {
    let ll = new LinkedList();

    expect(ll !== null).toBe(true);
});

it ("prepend first item", () => {
    // SETUP
    let ll = new LinkedList();

    // CALL
    ll.prepend(0);

    // ASSERT
    expect(ll.length).toBe(1);
    expect(ll.head.value).toBe(0);
    expect(ll.tail.value).toBe(0);
});

it ("prepend second item", () => {
    // SETUP
    let ll = new LinkedList();

    // CALL
    ll.prepend(1);
    ll.prepend(0);

    // ASSERT
    expect(ll.length).toBe(2);
    expect(ll.head.value).toBe(0);
    expect(ll.tail.value).toBe(1);
});

it ("append works", () => {
    // SETUP
    let ll = new LinkedList();

    // CALL
    ll.append(0);

    // ASSERT
    expect(ll.length).toBe(1);
    expect(ll.head.value).toBe(0);
    expect(ll.tail.value).toBe(0);
});

it ("append multiple item works", () => {
    // SETUP
    let ll = new LinkedList();

    // CALL
    ll.append(0);
    ll.append(1);
    ll.append(2);

    // ASSERT
    expect(ll.length).toBe(3);
    expect(ll.head.value).toBe(0);
    expect(ll.tail.value).toBe(2);
});

it ("popFront single test", () => {
    // SETUP
    let ll = new LinkedList();
    ll.append(0);

    // CALL
    let value = ll.popFront();

    // ASSERT
    expect(value).toBe(0);
    expect(ll.length).toBe(0);
    expect(ll.head).toBe(null);
    expect(ll.tail).toBe(null);
});

it ("popFront multiple test", () => {
    // SETUP
    let ll = new LinkedList();
    ll.append(0);
    ll.append(1);
    ll.append(2);
    expect(ll.length).toBe(3);
    expect(ll.head.value).toBe(0);
    expect(ll.tail.value).toBe(2);

    // CALL
    ll.popFront();
    ll.popFront();
    let value = ll.popFront();

    // ASSERT
    expect(value).toBe(2);
    expect(ll.length).toBe(0);
    expect(ll.head).toBe(null);
    expect(ll.tail).toBe(null);
});

it ("popRear single test", () => {
    // SETUP
    let ll = new LinkedList();
    ll.append(0);

    // CALL
    let value = ll.popRear();

    // ASSERT
    expect(value).toBe(0);
    expect(ll.length).toBe(0);
    expect(ll.head).toBe(null);
    expect(ll.tail).toBe(null);
});

it ("popRear multiple test", () => {
    // SETUP
    let ll = new LinkedList();
    ll.append(0);
    ll.append(1);
    ll.append(2);
    expect(ll.length).toBe(3);
    expect(ll.head.value).toBe(0);
    expect(ll.tail.value).toBe(2);

    // CALL
    ll.popRear();
    ll.popRear();
    let value = ll.popRear();

    // ASSERT
    expect(value).toBe(0);
    expect(ll.length).toBe(0);
    expect(ll.head).toBe(null);
    expect(ll.tail).toBe(null);
});

it ("contains basic", () => {
    // SETUP
    let ll = new LinkedList();
    ll.append(0);
    ll.append(1);
    ll.append(2);

    // CALL
    let trueVal = ll.contains(2);
    let falseVal = ll.contains(3);

    // ASSERT
    expect(trueVal).toBe(true);
    expect(falseVal).toBe(false);
});

it ("contains object", () => {
    // SETUP
    let ll = new LinkedList();
    ll.append({id: 0, value: "0"});
    ll.append({id: 1, value: "1"});
    let twoObject = {id: 2, value: "2"};
    ll.append(twoObject);
    let threeObject = {id: 3, value: "3"};
    let fetchIdFunction = function (obj) { return obj.id; };

    // CALL
    let trueVal = ll.contains(twoObject, fetchIdFunction);
    let falseVal = ll.contains(threeObject, fetchIdFunction);

    // ASSERT
    expect(trueVal).toBe(true);
    expect(falseVal).toBe(false);
});

it ("iterateOver", () => {
    // SETUP
    let ll = new LinkedList();
    ll.append(0);
    ll.append(1);
    ll.append(2);
    let callback = jest.fn();

    // CALL
    ll.iterateOver(callback);

    // ASSERT
    expect(callback.mock.calls.length).toBe(3);
    expect(callback.mock.calls[0][0]).toBe(0);
    expect(callback.mock.calls[1][0]).toBe(1);
    expect(callback.mock.calls[2][0]).toBe(2);
});