System.register(["../javascript/statsGenerate.js", "../javascript/tokenizer.js", "../javascript/statsUI.js"], function (exports_1, context_1) {
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
    var generate, tokenizer_js_1, stats, statsUI;
    var __moduleName = context_1 && context_1.id;
    function mainMobile(vocab, nouns, modelName, version) {
        return __awaiter(this, void 0, void 0, function* () {
            statsUI.setLoadingText(`Loading (${version})`);
            statsUI.toggleLoadingScreen(true);
            const model = yield generate.loadModel(tf, modelName);
            const trie = tokenizer_js_1.tokenizer.load(vocab);
            statsUI.toggleLoadingScreen(false);
            const processInput = (text) => {
                return tokenizer_js_1.tokenizer.processInput(text, generate.maskToken, tf, trie);
            };
            const processOutput = (predictions, index, noun) => {
                return tokenizer_js_1.tokenizer.processOutput(predictions, index, vocab, noun);
            };
            statsUI.setOnGenerate(function () {
                return __awaiter(this, void 0, void 0, function* () {
                    statsUI.toggleGenerate(false);
                    const enteredValue = statsUI.getEnteredValue();
                    const results = yield generate.generateStat(model, enteredValue, nouns, processInput, processOutput, statsUI.randomnessValue());
                    statsUI.setGenerateText(results.percentage, results.noun, results.chosen);
                    statsUI.toggleGenerate(true);
                });
            });
            statsUI.toggleGenerate(true);
        });
    }
    exports_1("mainMobile", mainMobile);
    return {
        setters: [
            function (generate_1) {
                generate = generate_1;
            },
            function (tokenizer_js_1_1) {
                tokenizer_js_1 = tokenizer_js_1_1;
            },
            function (stats_1) {
                stats = stats_1;
            }
        ],
        execute: function () {
            statsUI = stats.statsUI;
        }
    };
});
//# sourceMappingURL=statsMobile.js.map