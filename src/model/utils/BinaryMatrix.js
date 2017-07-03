import ConvertBase from "../../utils/ConvertBase";
import _ from "../../../node_modules/lodash/lodash";

class BinaryMatrix {

    constructor(binStrMatrix, headerBufferLength=1) {
        this._headerBufferLength = headerBufferLength;
        this._height = binStrMatrix.length;
        this._width = binStrMatrix[0].length;

        let header = BinaryMatrix.createHeader(headerBufferLength);

        this._binStrMatrix = _.concat(header, _.flattenDeep(binStrMatrix));
        this._numMatrix = BinaryMatrix.createNumericMatrix(this._binStrMatrix);
        this._prevState = {};
    }

    static createHeader(headerBufferLength) {
        let toRet = [];

        for (let i = 0; i < headerBufferLength; i++) {
            toRet.push("0");
        }

        return toRet;
    }

    static createNumericMatrix(flattenedStrMatrix) {

        let toRet = [];
        let decimalString = null;

        for (let i = 0; i < flattenedStrMatrix.length; i++) {
            decimalString = ConvertBase.bin2dec(flattenedStrMatrix[i]);
            toRet[i] = parseInt(decimalString, 10);
        }

        return toRet;
    }

    static setStringCharAtIndex(theString, theIndex, theValue) {
        let theStringArray = theString.split("");
        theStringArray[theIndex] = theValue;
        return theStringArray.join("");
    }

    getIndex(x, y) {
        return this._headerBufferLength + (y * this._width) + x;
    }

    getDecimalValue(x, y) {
        let index = this.getIndex(x, y);

        return this._numMatrix[index];
    }

    getBinaryValue(x, y) {
        let index = this.getIndex(x, y);

        return this._binStrMatrix[index];
    }

    setBinaryHeaderValue(index, value) {
        if (index >= this._headerBufferLength) {
            throw new Error("Invalid header index");
        }

        this._binStrMatrix[index] = value;
        let decimalValue = ConvertBase.bin2dec(value);
        this._numMatrix[index] = parseInt(decimalValue, 10);
    }

    _setBinaryValue(x, y, value) {
        let index = this.getIndex(x, y);

        this._binStrMatrix[index] = value;
        let decimalValue = ConvertBase.bin2dec(value);
        this._numMatrix[index] = parseInt(decimalValue, 10);
    }

    _setBinaryValueAtLocation(location, index, value) {
        let origBinValue = this.getBinaryValue(location.x, location.y);
        let toggledBinValue = BinaryMatrix.setStringCharAtIndex(origBinValue, index, value);
        this._setBinaryValue(location.x, location.y, toggledBinValue);
    }

    /**
     * This will set a binary value at the specified grid location
     *
     * @param prevName the name used to store a prev location.  This value will get unset the next
     * time you call this method.  Pass null or false if you don't want to use this functionality.
     * @param location The location in the matrix
     * @param index The index of the binary string you wish to update
     * @param value The value you wish to set.  "0" or "1"
     */
    setBinaryValueAtLocation (prevName, location, index, value) {
        if (!!prevName && prevName in this._prevState && this._prevState[prevName].isValid) {
            let prevLoc = this._prevState[prevName];
            this._setBinaryValueAtLocation(prevLoc, index, "0");
        }

        if (location.isValid) {
            this._setBinaryValueAtLocation(location, index, value);
        }

        if (!this._prevState[prevName]) {
            this._prevState[prevName] = location.clone();
        } else {
            this._prevState[prevName].setWithLocation(location);
        }
    }

    /**
     * This returns the numeric matrix as a single flattened array
     *
     * @returns {*}
     */
    get numMatrix() {
        return this._numMatrix;
    }

}

export default BinaryMatrix;