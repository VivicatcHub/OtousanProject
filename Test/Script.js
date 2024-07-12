var DICORETURN = {};

async function GeneralTest() {
    DICORETURN = await DatasVictory(DATAS_RANGE);
    if (window.innerWidth > 1000) {
        X = Math.floor(window.innerWidth / 125);
    } else {
        X = Math.floor(window.innerWidth / 75);
    }
    var Y = Object.keys(DICORETURN["Mots"]).length;
    if (window.innerWidth < 1000) {
        var Test = `<div style='width: ${X * 75}px;' class='grille'>`;
    } else {
        var Test = `<div style='width: ${X * 125}px;' class='grille'>`;
    }
    Object.keys(DICORETURN["Mots"]).forEach(Num => {
        var DATA = DICORETURN["Mots"];
        if (DATA[Num]["Image"] === null) {
            Test += `<button class="button-grille"><p class="p-grille">${DATA[Num]["Mot"].toUpperCase()}</p></button>`
        } else {
            Test += `<button class="button-grille"><img class="img-grille" src="${DATA[Num]["Image"]}"></img></button>`
        }
    })
    Test += "</div>";
    document.getElementById('container').innerHTML = Test;
}