

class ConvertBase {

    static convert(num) {
        return {
            from : function (baseFrom) {
                return {
                    to : function (baseTo) {
                        return parseInt(num, baseFrom).toString(baseTo);
                    }
                };
            }
        };
    }

    // binary to decimal
    static bin2dec (num) {
        return ConvertBase.convert(num).from(2).to(10);
    }

    // binary to hexadecimal
    static bin2hex (num) {
        return ConvertBase.convert(num).from(2).to(16);
    }

    // decimal to binary
    static dec2bin (num) {
        return ConvertBase.convert(num).from(10).to(2);
    }

    // decimal to hexadecimal
    static dec2hex (num) {
        return ConvertBase.convert(num).from(10).to(16);
    }

    // hexadecimal to binary
    static hex2bin (num) {
        return ConvertBase.convert(num).from(16).to(2);
    }

    // hexadecimal to decimal
    static hex2dec (num) {
        return ConvertBase.convert(num).from(16).to(10);
    }

}

export default ConvertBase;