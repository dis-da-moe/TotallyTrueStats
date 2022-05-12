var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let model;
let input;
let output;
let nounList;
//hacky way to get around node's exports
var exports = {};
//these are the types transpiled for node modules, not system.js modules
importScripts("./tokenizer.js");
importScripts("./statsGenerate.js");
importScripts("https://cdn.jsdelivr.net/npm/@tensorflow/tfjs/dist/tf.min.js");
importScripts("../dependencies/chance.min.js");
const tokenizer = exports.tokenizer;
self.addEventListener("message", function (e) {
    return __awaiter(this, void 0, void 0, function* () {
        if (e.data[0] == "load") {
            const vocab = e.data[1];
            const url = e.data[2];
            nounList = e.data[3];
            model = yield exports.loadModel(tf, url);
            const trie = tokenizer.load(vocab);
            input = (text) => {
                return tokenizer.processInput(text, exports.maskToken, tf, trie);
            };
            output = (predictions, index, noun) => {
                return tokenizer.processOutput(predictions, index, vocab, noun);
            };
            self.postMessage("loaded");
        }
        else if (e.data[0] == "generate") {
            const enteredValue = e.data[1];
            const randomness = e.data[2];
            const results = yield exports.generateStat(model, enteredValue, nounList, input, output, randomness);
            self.postMessage(results);
        }
    });
});
//# sourceMappingURL=statsWorker.js.map