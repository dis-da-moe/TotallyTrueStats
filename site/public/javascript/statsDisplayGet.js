System.register([], function (exports_1, context_1) {
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
    var __moduleName = context_1 && context_1.id;
    function display(getWords) {
        return __awaiter(this, void 0, void 0, function* () {
            const ui = (yield context_1.import("../javascript/statsUI.js")).statsUI;
            ui.toggleGenerate(true);
            ui.setOnGenerate(() => window.location.href = window.location.origin + window.location.pathname);
            ui.toggleLoadingScreen(false);
            ui.setGenerateText(getWords[0], getWords[1], getWords[2]);
        });
    }
    exports_1("display", display);
    return {
        setters: [],
        execute: function () {
        }
    };
});
//# sourceMappingURL=statsDisplayGet.js.map