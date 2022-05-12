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
const modelUrl = `${window.location.origin}/model/model.json`;
function getServerCsv(url) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield fetch(url);
        const csv = yield result.text();
        const array = csv.split("\n");
        const cleaned = array.slice(1).map(word => word.replace("\r", ""));
        return Promise.resolve(cleaned);
    });
}
const statsDisplayGet_js_1 = require("../javascript/statsDisplayGet.js");
const mobile = require("../javascript/statsMobile.js");
const desktop = require("../javascript/statsDesktop.js");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const vocab = yield (yield fetch("/words/vocab.json")).json();
        if (getWords != undefined) {
            yield (0, statsDisplayGet_js_1.display)(getWords);
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
main();
//# sourceMappingURL=statsStarter.js.map