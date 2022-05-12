"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.statsUI = void 0;
const statsCipher_js_1 = require("../javascript/statsCipher.js");
const randomLimits = [0, 1];
const randomDefault = randomLimits.reduce((a, b) => a + b) / randomLimits.length;
const green = "#3cc95d";
const red = "#c03923";
const colours = [green, red, "#1d6bb9", "#cc9b40"];
const randomColour = () => colours[Math.floor(Math.random() * colours.length)];
function showError(message) {
    const errorHeading = document.createElement("h1");
    errorHeading.className = "main-paragraph";
    errorHeading.style.color = "red";
    errorHeading.style.textAlign = "center";
    errorHeading.innerHTML = `An error occurred: ${message}.`;
    document.body.prepend(errorHeading);
    throw new Error(message);
}
function get(id) {
    const element = document.getElementById(id);
    if (element === undefined) {
        showError(`could not find element by id ${id}`);
    }
    return element;
}
const showElement = (element) => element.style.removeProperty("display");
const hideElement = (element) => element.style.display = "none";
const helpButton = get("help");
const helpBlocker = get("help-blocker");
hideElement(helpBlocker);
const okButton = get("ok");
helpButton.onclick = () => showElement(helpBlocker);
okButton.onclick = () => hideElement(helpBlocker);
const loadingScreen = get("loading-blocker");
hideElement(loadingScreen);
const generateScreen = get("generate-parent");
hideElement(generateScreen);
function toggleLoadingScreen(on) {
    showElement(on ? loadingScreen : generateScreen);
    hideElement(on ? generateScreen : loadingScreen);
}
const loadingText = get("loading-text");
const setLoadingText = (text) => loadingText.innerHTML = text;
const generateButton = get("generate-button");
const buttonText = get("button-text");
const buttonSpinner = get("generate-spinner");
const generateText = get("generate-text");
const generateTexts = Object.freeze(Array.from([0, 3, 5], (number) => generateText.children[number]));
const setOnGenerate = (generate) => generateButton.addEventListener("click", () => generate());
function toggleGenerate(on) {
    generateButton.disabled = !on;
    buttonText.innerHTML = on ? "Generate!" : "Loading...";
    const action = on ? hideElement : showElement;
    action(buttonSpinner);
}
function setGenerateText(percentage, noun, adjective) {
    const parsedPercentage = typeof percentage == "number" ? percentage : parseInt(percentage, 10);
    if (!isNaN(parsedPercentage)) {
        generateTexts[0].style.color = parsedPercentage > 50 ? green : red;
    }
    generateTexts[0].innerHTML = percentage.toString();
    const underlinedIndex = Math.round(Math.random()) + 1;
    const boldIndex = underlinedIndex == 1 ? 2 : 1;
    generateTexts[underlinedIndex].style.textDecoration = "underline";
    generateTexts[underlinedIndex].style.removeProperty("font-weight");
    generateTexts[boldIndex].style.fontWeight = "bold";
    generateTexts[boldIndex].style.removeProperty("text-decoration");
    generateTexts[1].innerHTML = noun;
    //console.log(generateTexts[2].);
    generateTexts[2].children[0].innerHTML = adjective;
    [1, 2].forEach(index => generateTexts[index].style.color = randomColour());
}
const generateFor = get("generate-for");
const clearGenerateFor = get("clear");
clearGenerateFor.onclick = () => generateFor.value = "";
const getEnteredValue = () => generateFor.value == "" ? undefined : generateFor.value;
const randomnessSlider = get("randomness-slider");
randomnessSlider.step = Number.MIN_VALUE.toString();
randomnessSlider.min = randomLimits[0].toString(10);
randomnessSlider.max = randomLimits[1].toString(10);
randomnessSlider.value = randomDefault.toString(10);
const randomnessValue = () => parseInt(randomnessSlider.value, 10);
const citeButton = get("cite");
citeButton.onclick = () => {
    if (!navigator.clipboard) {
        toastr.error("Could not copy, clipboard disabled.");
        return;
    }
    const texts = Array.from(generateTexts, (element) => element.innerText);
    const encodedWords = Array.from(texts, (text) => (0, statsCipher_js_1.encode)(text)).join(",");
    toastr.info("Link copied to clipboard!");
    navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}?id=${encodedWords}`);
};
exports.statsUI = {
    randomnessValue,
    getEnteredValue,
    setGenerateText,
    setLoadingText,
    setOnGenerate,
    toggleGenerate,
    toggleLoadingScreen
};
//# sourceMappingURL=statsUI.js.map