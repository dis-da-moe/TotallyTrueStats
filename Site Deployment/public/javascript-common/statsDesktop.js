"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mainDesktop = void 0;
const stats = require("../javascript/statsUI.js");
const statsUI = stats.statsUI;
function startWorker(url, nouns, vocab) {
    const worker = new Worker("javascript-common/statsWorker.js");
    worker.addEventListener("message", function (e) {
        if (e.data == "loaded") {
            statsUI.setOnGenerate(() => {
                worker.postMessage(["generate", statsUI.getEnteredValue(), statsUI.randomnessValue()]);
            });
            statsUI.toggleGenerate(true);
            statsUI.toggleLoadingScreen(false);
        }
        else {
            statsUI.setGenerateText(e.data.percentage, e.data.noun, e.data.chosen);
        }
    });
    worker.postMessage(["load", vocab, url, nouns]);
    return worker;
}
function mainDesktop(modelUrl, nouns, vocab) {
    return __awaiter(this, void 0, void 0, function* () {
        statsUI.setLoadingText("Loading");
        statsUI.toggleLoadingScreen(true);
        startWorker(modelUrl, nouns, vocab);
    });
}
exports.mainDesktop = mainDesktop;
//# sourceMappingURL=statsDesktop.js.map