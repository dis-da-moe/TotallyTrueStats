System.register([], function (exports_1, context_1) {
    "use strict";
    var SPACE_REPLACER, SPACE, lowercaseStart, lowercaseEnd, lowercaseLetters, shift, shiftedLetters;
    var __moduleName = context_1 && context_1.id;
    function isAlpha(char) {
        return char.match(/[a-z]/i);
    }
    function isLower(char) {
        return char == char.toLowerCase();
    }
    function encode(original) {
        const cleaned = original.replace(SPACE, SPACE_REPLACER).toLowerCase();
        return Array.from(cleaned, (char) => {
            if (!lowercaseLetters.includes(char))
                return char;
            return shiftedLetters[lowercaseLetters.indexOf(char)];
        }).join("");
    }
    exports_1("encode", encode);
    function decode(original) {
        return Array.from(original, (char) => {
            if (char == SPACE_REPLACER)
                return SPACE;
            if (!shiftedLetters.includes(char))
                return char;
            return lowercaseLetters[shiftedLetters.indexOf(char)];
        }).join("");
    }
    exports_1("decode", decode);
    function validateEncoded(word) {
        const wordArray = word.split("");
        return (wordArray.every((char) => !isAlpha(char) || isLower(char)));
    }
    exports_1("validateEncoded", validateEncoded);
    return {
        setters: [],
        execute: function () {
            SPACE_REPLACER = "-";
            SPACE = " ";
            lowercaseStart = "a".charCodeAt(0);
            lowercaseEnd = "z".charCodeAt(0);
            lowercaseLetters = Array.from({ length: lowercaseEnd - lowercaseStart + 1 }, (_, index) => String.fromCharCode(lowercaseStart + index));
            shift = (arr, k) => arr.slice(k).concat(arr.slice(0, k));
            shiftedLetters = shift(lowercaseLetters, 10);
        }
    };
});
//# sourceMappingURL=statsCipher.js.map