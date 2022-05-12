const SPACE_REPLACER = "-";
const SPACE = " ";
const lowercaseStart = "a".charCodeAt(0);
const lowercaseEnd = "z".charCodeAt(0);
const lowercaseLetters = Array.from({length: lowercaseEnd-lowercaseStart + 1},
    (_, index) => String.fromCharCode(lowercaseStart + index));
const shift = (arr, k) => arr.slice(k).concat(arr.slice(0, k));
const shiftedLetters: string[] = shift(lowercaseLetters, 10);

function isAlpha(char: string){
    return char.match(/[a-z]/i);
}

function isLower(char: string){
    return char == char.toLowerCase();
}

export function encode(original: string){
    const cleaned = original.replace(SPACE, SPACE_REPLACER).toLowerCase();
    return Array.from(cleaned, (char) => {
        if(!lowercaseLetters.includes(char)) return char;
        return shiftedLetters[lowercaseLetters.indexOf(char)];
    }).join("");
}

export function decode(original: string){
    return Array.from(original, (char) => {
        if (char == SPACE_REPLACER) return SPACE;
        if (!shiftedLetters.includes(char)) return char;
        return lowercaseLetters[shiftedLetters.indexOf(char)];
    }).join("");
}

export function validateEncoded(word: string){
    const wordArray = word.split("");
    return (wordArray.every((char) => !isAlpha(char) || isLower(char)));
}