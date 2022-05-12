System.register(["../javascript/statsDisplayGet.js", "../javascript/statsMobile.js", "../javascript/statsDesktop.js"], function (exports_1, context_1) {
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
    var modelUrl, statsDisplayGet_js_1, mobile, desktop;
    var __moduleName = context_1 && context_1.id;
    function getServerCsv(url) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield fetch(url);
            const csv = yield result.text();
            const array = csv.split("\n");
            const cleaned = array.slice(1).map(word => word.replace("\r", ""));
            return Promise.resolve(cleaned);
        });
    }
    function main() {
        return __awaiter(this, void 0, void 0, function* () {
            const vocab = yield (yield fetch("/words/vocab.json")).json();
            if (getWords != undefined) {
                yield statsDisplayGet_js_1.display(getWords);
                return;
            }
            const nouns = yield getServerCsv("/words/Nouns.csv");
            if (isMobile || !isChrome) {
                const version = isMobile ? "Mobile" : "Non-Chrome";
                yield mobile.mainMobile(vocab, nouns, modelUrl, version);
            }
            else {
                yield desktop.mainDesktop(modelUrl, nouns, vocab);
            }
        });
    }
    return {
        setters: [
            function (statsDisplayGet_js_1_1) {
                statsDisplayGet_js_1 = statsDisplayGet_js_1_1;
            },
            function (mobile_1) {
                mobile = mobile_1;
            },
            function (desktop_1) {
                desktop = desktop_1;
            }
        ],
        execute: function () {
            modelUrl = `${window.location.origin}/model/model.json`;
            main();
        }
    };
});
//# sourceMappingURL=statsStarter.js.map