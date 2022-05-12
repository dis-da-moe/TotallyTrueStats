export async function display(getWords: Array<string>){
    const ui = (await import("../javascript/statsUI.js")).statsUI;
    ui.toggleGenerate(true);
    ui.setOnGenerate(() => window.location.href = window.location.origin + window.location.pathname);
    ui.toggleLoadingScreen(false);
    ui.setGenerateText(getWords[0], getWords[1], getWords[2]);
}