import * as generate from "../javascript/statsGenerate.js";
import {tokenizer} from "../javascript/tokenizer.js";
import * as stats from "../javascript/statsUI.js";
const statsUI = stats.statsUI;
declare const tf;

export async function mainMobile(vocab, nouns, modelName, version){
    statsUI.setLoadingText(`Loading (${version})`);
    statsUI.toggleLoadingScreen(true);
    const model = await generate.loadModel(tf, modelName);
    const trie = tokenizer.load(vocab);
    statsUI.toggleLoadingScreen(false);

    const processInput = (text) => {
        return tokenizer.processInput(text, generate.maskToken, tf, trie);
    };
    const processOutput = (predictions, index, noun) => {
        return tokenizer.processOutput(predictions, index, vocab, noun);
    }

    statsUI.setOnGenerate(async function(){
        statsUI.toggleGenerate(false);
        const enteredValue: string|undefined = statsUI.getEnteredValue();
        const results = await generate.generateStat(
            model, enteredValue, nouns,
            processInput, processOutput,
            statsUI.randomnessValue()
        );
        statsUI.setGenerateText(results.percentage, results.noun, results.chosen);
        statsUI.toggleGenerate(true);
    });
    statsUI.toggleGenerate(true);
}

