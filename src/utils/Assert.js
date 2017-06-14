

export const assert = function (expression, errorMessage="Assertion failed") {
    if (!expression) {
        throw new Error(errorMessage);
    }
};