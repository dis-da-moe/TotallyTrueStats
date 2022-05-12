export const maskToken = "***mask***";
const cutoffRange = [0.0002, 0.001]

const cleanInput = (userInput) => {
    userInput = userInput.replace(/[^0-9a-z ]/gi, '');
    if(userInput.length < 1) return undefined;
    if(userInput.length > 512) return userInput.substring(0, 512);
    return userInput;
}
const sample = (array, limit=undefined) => {
    limit = limit === undefined? array.length : Math.min(array.length, limit);
    return array[Math.floor(Math.random()*limit)];
}

export function getNoun(nounList, input){
    if(input != undefined){
        const cleaned = cleanInput(input);
        if(cleaned != undefined) return cleaned;
    }
    return sample(nounList);
}

export function randomPercentage(){
    const number = Math.random() * 100;
    return Math.round(number * 10) / 10;
}

export async function loadModel(tf, modelUrl: string){
    const model = await tf.loadGraphModel(modelUrl);
    const dummyInput = new tf.zeros([1,512], "int32");
    model.execute({
        "input_ids": dummyInput,
        "attention_mask": dummyInput
    });
    dummyInput.dispose();
    return model;
}

declare const chance;

export async function generateStat(model, input, nounList, processInput, processOutput, randomness: number){
    const noun = getNoun(nounList, input);
    const percentage = randomPercentage();
    const text = `${percentage} percent of ${noun} are ${maskToken}.`;
    const tokenized = processInput(text);
    const predictions = model.execute(tokenized.inputs);

    const wordsProbs: [string, number] = processOutput(predictions, tokenized.maskIndex, noun);

    const cutoffValue = (cutoffRange[1] - cutoffRange[0]) * (1-randomness) + cutoffRange[0];
    const cutOffProbs = wordsProbs.filter((pair) => pair[0].length > 2 && pair[1] > cutoffValue);

    const probabilities = Array.from(cutOffProbs, pair => pair[1]);
    const sum = probabilities.reduce(((previousValue, currentValue) => previousValue + currentValue));
    const average = sum / probabilities.length;
    const weights = Array.from(probabilities, probability => {
        const deviation = probability - average;
        return average + deviation * (1-randomness);
    });
    const words = Array.from(cutOffProbs, pair => pair[0]);

    const chosen = chance.weighted(words, weights);
    return {percentage, noun, chosen};
}