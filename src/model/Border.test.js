import Border from "./Border";

function testAttribute(attrName) {
    let temp = new Border();

    expect(temp[attrName]).toBe(false);
    temp[attrName] = true;

    expect(temp[attrName]).toBe(true);

    temp[attrName] = false;
    expect(temp[attrName]).toBe(false);
}

it('left works', () => {
    testAttribute("left");
});

it('top works', () => {
    testAttribute("top");
});

it('right works', () => {
    testAttribute("right");
});

it('bottom works', () => {
    testAttribute("bottom");
});