System.register(["../javascript/statsUI.js"], function (exports_1, context_1) {
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
    var stats, statsUI;
    var __moduleName = context_1 && context_1.id;
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
    exports_1("mainDesktop", mainDesktop);
    return {
        setters: [
            function (stats_1) {
                stats = stats_1;
            }
        ],
        execute: function () {
            statsUI = stats.statsUI;
        }
    };
});
//# sourceMappingURL=statsDesktop.js.map