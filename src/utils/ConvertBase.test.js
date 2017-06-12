import ConvertBase from "./ConvertBase";

it ("bin2dec", () => {
    // SETUP
    let toConvert = "10000";

    // CALL
    let value = ConvertBase.bin2dec(toConvert);

    // ASSERT
    expect(parseInt(value, 10)).toBe(16);
});

it ("dec2bin", () => {
    // SETUP
    let toConvert = 17;

    // CALL
    let value = ConvertBase.dec2bin(toConvert);

    // ASSERT
    expect(value).toBe("10001");
});