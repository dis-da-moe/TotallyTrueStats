System.register(["../javascript/statsCipher.js"], function (exports_1, context_1) {
    "use strict";
    var statsCipher_js_1, randomLimits, randomDefault, green, red, colours, randomColour, showElement, hideElement, helpButton, helpBlocker, okButton, loadingScreen, generateScreen, loadingText, setLoadingText, generateButton, buttonText, buttonSpinner, generateText, generateTexts, setOnGenerate, generateFor, clearGenerateFor, getEnteredValue, randomnessSlider, randomnessValue, citeButton, statsUI;
    var __moduleName = context_1 && context_1.id;
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
    function toggleLoadingScreen(on) {
        showElement(on ? loadingScreen : generateScreen);
        hideElement(on ? generateScreen : loadingScreen);
    }
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
    return {
        setters: [
            function (statsCipher_js_1_1) {
                statsCipher_js_1 = statsCipher_js_1_1;
            }
        ],
        execute: function () {
            randomLimits = [0, 1];
            randomDefault = randomLimits.reduce((a, b) => a + b) / randomLimits.length;
            green = "#3cc95d";
            red = "#c03923";
            colours = [green, red, "#1d6bb9", "#cc9b40"];
            randomColour = () => colours[Math.floor(Math.random() * colours.length)];
            showElement = (element) => element.style.removeProperty("display");
            hideElement = (element) => element.style.display = "none";
            helpButton = get("help");
            helpBlocker = get("help-blocker");
            hideElement(helpBlocker);
            okButton = get("ok");
            helpButton.onclick = () => showElement(helpBlocker);
            okButton.onclick = () => hideElement(helpBlocker);
            loadingScreen = get("loading-blocker");
            hideElement(loadingScreen);
            generateScreen = get("generate-parent");
            hideElement(generateScreen);
            loadingText = get("loading-text");
            setLoadingText = (text) => loadingText.innerHTML = text;
            generateButton = get("generate-button");
            buttonText = get("button-text");
            buttonSpinner = get("generate-spinner");
            generateText = get("generate-text");
            generateTexts = Object.freeze(Array.from([0, 3, 5], (number) => generateText.children[number]));
            setOnGenerate = (generate) => generateButton.addEventListener("click", () => generate());
            generateFor = get("generate-for");
            clearGenerateFor = get("clear");
            clearGenerateFor.onclick = () => generateFor.value = "";
            getEnteredValue = () => generateFor.value == "" ? undefined : generateFor.value;
            randomnessSlider = get("randomness-slider");
            randomnessSlider.step = Number.MIN_VALUE.toString();
            randomnessSlider.min = randomLimits[0].toString(10);
            randomnessSlider.max = randomLimits[1].toString(10);
            randomnessSlider.value = randomDefault.toString(10);
            randomnessValue = () => parseInt(randomnessSlider.value, 10);
            citeButton = get("cite");
            citeButton.onclick = () => {
                if (!navigator.clipboard) {
                    toastr.error("Could not copy, clipboard disabled.");
                    return;
                }
                const texts = Array.from(generateTexts, (element) => element.innerText);
                const encodedWords = Array.from(texts, (text) => statsCipher_js_1.encode(text)).join(",");
                toastr.info("Link copied to clipboard!");
                navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}?id=${encodedWords}`);
            };
            exports_1("statsUI", statsUI = {
                randomnessValue,
                getEnteredValue,
                setGenerateText,
                setLoadingText,
                setOnGenerate,
                toggleGenerate,
                toggleLoadingScreen
            });
        }
    };
});
//# sourceMappingURL=statsUI.js.map