"use strict";

/**
 * Regex to parse Excel addresses.
 * @private
 */
var addressRegex = /^\s*(?:'?(.+?)'?\!)?\$?([A-Z]+)\$?(\d+)\s*$/i;

module.exports = {
    /**
     * Checks if a number is an integer.
     * @param {*} value - The value to check.
     * @returns {boolean} A flag indicating if the value is an integer.
     */
    isInteger: function (value) {
        return value === parseInt(value);
    },

    /**
     * Converts a column number to column name (e.g. 2 -> "B").
     * @param {number} number - The number to convert.
     * @returns {string} The corresponding name.
     */
    columnNumberToName: function (number) {
        if (!this.isInteger(number) || number <= 0) return;

        var dividend = number;
        var name = '';
        var modulo = 0;

        while (dividend > 0) {
            modulo = (dividend - 1) % 26;
            name = String.fromCharCode('A'.charCodeAt(0) + modulo) + name;
            dividend = Math.floor((dividend - modulo) / 26);
        }

        return name;
    },

    /**
     * Converts a column name to column number (e.g. "B" -> 2).
     * @param {string} name - The name to convert.
     * @returns {number} The corresponding number.
     */
    columnNameToNumber: function (name) {
        if (!name || typeof name !== "string") return;

        name = name.toUpperCase();
        var sum = 0;
        for (var i = 0; i < name.length; i++) {
            sum *= 26;
            sum += name[i].charCodeAt(0) - 'A'.charCodeAt(0) + 1;
        }

        return sum;
    },

    /**
     * Converts a row and column (and option sheet) to an Excel address.
     * @param {number} row - The row number.
     * @param {number} column - The column number.
     * @param {string} [sheet] - The sheet name (full a full address).
     * @returns {string} The converted address.
     */
    rowAndColumnToAddress: function (row, column, sheet) {
        if (!this.isInteger(row) || !this.isInteger(column) || row <= 0 || column <= 0) return;
        var address = this.columnNumberToName(column) + row;
        if (sheet) address = this.addressToFullAddress(sheet, address);
        return address;
    },

    /**
     * Converts an address and sheet name to a full address.
     * @param {string} sheet - The sheet name.
     * @param {string} address - The address.
     * @returns {string} The full address.
     */
    addressToFullAddress: function (sheet, address) {
        return "'" + sheet + "'!" + address;
    },

    /**
     * Converts an address to row and column (and sheet if present).
     * @param {string} address - The address to convert.
     * @returns {{}} parsed - The parsed values.
     * @returns {number} parsed.row - The row.
     * @returns {number} parsed.column - The column.
     * @returns {string} [parsed.sheet] - The sheet.
     */
    addressToRowAndColumn: function (address) {
        var match = addressRegex.exec(address);
        if (!match) return;

        var ref = {
            row: parseInt(match[3]),
            column: this.columnNameToNumber(match[2])
        };

        if (match[1]) ref.sheet = match[1];

        return ref;
    }
};