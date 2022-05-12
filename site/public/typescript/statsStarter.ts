const modelUrl = `${window.location.origin}/model/model.json`;

async function getServerCsv(url){
    const result = await fetch(url);
    const csv = await result.text();
    const array = csv.split("\n")
    const cleaned = array.slice(1).map(word => word.replace("\r", ""));
    return Promise.resolve(cleaned);
}

import {display} from "../javascript/statsDisplayGet.js";
import * as mobile from "../javascript/statsMobile.js";
import * as desktop from "../javascript/statsDesktop.js";

declare const getWords: undefined|Array<string>;
declare const isMobile: boolean;
declare const isChrome: boolean;

async function main(){
    const vocab = await (await fetch("/words/vocab.json")).json();
    if(getWords != undefined){
        await display(getWords);
        return;
    }

    const nouns = await getServerCsv("/words/Nouns.csv");
    if (isMobile || !isChrome) {
        const version = isMobile ? "Mobile" : "Non-Chrome";
        await mobile.mainMobile(vocab, nouns, modelUrl, version);
    }
    else {
        await desktop.mainDesktop(modelUrl, nouns, vocab)
    }

}
main();


