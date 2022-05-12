let model;
let input;
let output;
let nounList;
//hacky way to get around node's exports
var exports:any = {};
//these are the types transpiled for node modules, not system.js modules
importScripts("./tokenizer.js");
importScripts("./statsGenerate.js");

importScripts("https://cdn.jsdelivr.net/npm/@tensorflow/tfjs/dist/tf.min.js");

importScripts("../dependencies/chance.min.js")

declare const tf;
const tokenizer = exports.tokenizer;

self.addEventListener("message", async function (e){
   if(e.data[0] == "load"){
       const vocab = e.data[1];
       const url = e.data[2];
       nounList = e.data[3];
       model = await exports.loadModel(tf, url);
       const trie = tokenizer.load(vocab)
       input = (text) => {
           return tokenizer.processInput(text, exports.maskToken, tf, trie);
       };
       output = (predictions, index, noun) => {
           return tokenizer.processOutput(predictions, index, vocab, noun)
       };
       self.postMessage("loaded");
   }
   else if(e.data[0] == "generate"){
       const enteredValue = e.data[1];
       const randomness = e.data[2];
       const results = await exports.generateStat(
           model,
           enteredValue,
           nounList,
           input,
           output,
           randomness
       )
       self.postMessage(results);
   }
});