var LANGUEtoSEE = localStorage.getItem('LangS');
if (LANGUEtoSEE === null) {
    LANGUEtoSEE = "en-EN";
    localStorage.setItem('LangS', LANGUEtoSEE);
}
var LANGUEtoTEACH = localStorage.getItem('LangT');
if (LANGUEtoTEACH === null) {
    LANGUEtoTEACH = "jp-JP";
    localStorage.setItem('LangT', LANGUEtoTEACH);
}
var CAT = localStorage.getItem('Diff');
if (CAT === null) {
    CAT = "all";
    localStorage.setItem('Cat', CAT);
}
var NBMOTS = localStorage.getItem('NbMots');
if (NBMOTS === null) {
    NBMOTS = "all";
    localStorage.setItem('NbMots', NBMOTS);
}
var DIFF = localStorage.getItem('Diff');
if (DIFF === null) {
    DIFF = "1";
    localStorage.setItem('Diff', DIFF);
}
var MARATHON = localStorage.getItem('Marathon');
if (MARATHON === null) {
    MARATHON = [];
    localStorage.setItem('Marathon', MARATHON);
}
var MARASCORE = localStorage.getItem('MaraScore');
if (MARASCORE === null) {
    MARASCORE = 0;
    localStorage.setItem('MaraScore', MARASCORE);
}
var DICORETURN = {};
var VAL = "";
var LISTEMOTS = [];
var SCORE = 0;
var HELPRES = 0;

function JapOrNot() {
    if (LANGUEtoTEACH === "jp-JP") {
        if (DICORETURN["Mots"][VAL]["Kanji"] !== undefined) {
            return ` (${DICORETURN["Mots"][VAL]["Kanji"]})`;
        }
    } else {
        return "";
    }
}

function ModifInputs(input) {
    // input.style.width = ((input.value.length + 2) * 10) + 'px';
    switch (LANGUEtoTEACH) {
        case "fr-FR":
            var Temp = "Mot";
            break;
        case "jp-JP":
            var Temp = "Hiragana";
            break;
        default:
            var Temp = LANGUEtoTEACH;
            break;
    }
    switch (LANGUEtoSEE) {
        case "fr-FR":
            var DataToAff = "Mot";
            break;
        case "jp-JP":
            if (DATA[Num]["Kanji"] !== undefined) {
                var DataToAff = "Kanji";
            } else {
                var DataToAff = "Hiragana";
            }
            break;
        default:
            var DataToAff = LANGUEtoSEE;
            break;

    }
    if (DICORETURN["Mots"][VAL][Temp].toUpperCase() === input.value.toUpperCase()) {
        document.getElementById('wtf').innerHTML = `${DICORETURN["Mots"][VAL][DataToAff].toUpperCase()}<br>${DICORETURN["Mots"][VAL][Temp].toUpperCase()}${JapOrNot()}<br>${DICOLANGtoSEE["Word"]} ${DICOLANGtoSEE["Left"]}: ${LISTEMOTS.length}`;
        SCORE++;
        input.value = "";
        if (LISTEMOTS.length >= 1) {
            VAL = LISTEMOTS[0];
            LISTEMOTS = LISTEMOTS.slice(1);
            console.log(LISTEMOTS, LISTEMOTS.length);
        } else {
            document.getElementById("audioFin").play();
            alert(`Bravo, tu as trouvé ${SCORE + MARASCORE} mot(s)`);
            document.getElementById("container").remove();
            document.getElementById("hiragana").remove();
        }
        if (DICORETURN["Mots"][VAL]["Image"] === null || DICORETURN["Mots"][VAL]["Image"] === undefined) {
            // console.log(DICORETURN["Mots"][VAL][DataToAff], DataToAff)
            document.getElementById("container").innerHTML = `<button disabled class="button-grille-quiz"><p class="p-grille-quiz">${DICORETURN["Mots"][VAL][DataToAff].toUpperCase()}</p></button>`;
        } else {
            document.getElementById("container").innerHTML = `<button disabled class="button-grille-quiz"><img class="img-grille-quiz" src="${DICORETURN["Mots"][VAL]["Image"]}"></img></button>`;
        }
        adjustFontSize();
    }
}

function CreerListeMots() {
    if (MARATHON.length === 0) {
        switch (LANGUEtoTEACH) {
            case "fr-FR":
                var Temp = "Mot";
                break;
            case "jp-JP":
                var Temp = "Hiragana";
                break;
            default:
                var Temp = LANGUEtoTEACH;
                break;
        }
        switch (LANGUEtoSEE) {
            case "fr-FR":
                var Temp2 = "Mot";
                break;
            case "jp-JP":
                if (DATA[Num]["Kanji"] !== undefined) {
                    var Temp2 = "Kanji";
                } else {
                    var Temp2 = "Hiragana";
                }
                break;
            default:
                var Temp2 = LANGUEtoSEE;
                break;
        }
        if (CAT === "all") {
            var Liste = Object.entries(DICORETURN["Mots"]).filter(([key, value]) => value[Temp] !== undefined && value[Temp] !== null && value[Temp2] !== undefined && value[Temp2] !== null).reduce((acc, [key, value]) => { acc[key] = value; return acc; }, {});
        } else {
            var Liste = Object.entries(DICORETURN["Mots"]).filter(([key, value]) => value[Temp] !== undefined && value[Temp] !== null && value[Temp2] !== undefined && value[Temp2] !== null && value["Catégorie"] == CAT).reduce((acc, [key, value]) => { acc[key] = value; return acc; }, {});
        }
        let Len = parseInt(NBMOTS !== "all" ? NBMOTS : Object.keys(Liste).length);
        console.log(Liste, Len);
        for (let i = 0; i < Len; i++) {
            let Temp = ValeurAleatoireDico(Liste);
            delete Liste[Temp];
            LISTEMOTS.push(Temp);
            // console.log(Temp, Object.keys(Liste).length, i);
        }
    } else {
        LISTEMOTS = MARATHON.split(",");
    }
    console.log(LISTEMOTS);
}

function HelpRes() {
    if (DIFF === "1") {
        return "∞";
    } else {
        return HELPRES;
    }
}

function Help() {
    switch (LANGUEtoTEACH) {
        case "fr-FR":
            var Temp = "Mot";
            break;
        case "jp-JP":
            var Temp = "Hiragana";
            break;
        default:
            var Temp = LANGUEtoTEACH;
            break;
    }
    alert(DICORETURN["Mots"][VAL][Temp]);
    HELPRES--;
    document.getElementById("RepRes").innerHTML = `${DICOLANGtoSEE["Left"]}:<br>${HelpRes()}`;
    if (HELPRES === 0 && DIFF !== "1") {
        document.getElementById("help").disabled = true;
        document.getElementById("help").style.cursor = "default";
        document.getElementById("audio-h").onclick = "";
        document.getElementById("audio-h").style.cursor = "default";
        document.getElementById("audio-f").onclick = "";
        document.getElementById("audio-f").style.cursor = "default";
    }
}

function HelpAudio(SEXE) {
    switch (LANGUEtoTEACH) {
        case "fr-FR":
            var Temp = "Mot";
            break;
        case "jp-JP":
            var Temp = "Hiragana";
            break;
        default:
            var Temp = LANGUEtoTEACH;
            break;
    }
    let Text = DICORETURN["Mots"][VAL][Temp];
    if (SEXE === "h") {
        SpeakTextH(Text);
    } else {
        SpeakTextF(Text);
    }
    HELPRES--;
    document.getElementById("RepRes").innerHTML = `${DICOLANGtoSEE["Left"]}:<br>${HelpRes()}`;
    if (HELPRES === 0 && DIFF !== "1") {
        document.getElementById("help").disabled = true;
        document.getElementById("help").style.cursor = "default";
        document.getElementById("audio-h").onclick = "";
        document.getElementById("audio-h").style.cursor = "default";
        document.getElementById("audio-f").onclick = "";
        document.getElementById("audio-f").style.cursor = "default";
    }
}

function Pause() {
    localStorage.setItem("Marathon", LISTEMOTS);
    localStorage.setItem("MaraScore", SCORE);
    Retry();
}

function Launch() {
    NBMOTS = document.getElementById("nbmot").value;
    localStorage.setItem("NbMots", NBMOTS);
    DIFF = document.getElementById("rep").value;
    if (DIFF === "4") {
        HELPRES = 25;
    } else {
        HELPRES = 5;
    }
    localStorage.setItem("Diff", DIFF)
    document.getElementById("containerD").innerHTML = `<p id="wtf"></p><div style="align-items: center;display:flex; flex-direction: column;border: 1px solid #ccc; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); padding: 5px;">${DICOLANGtoSEE["Help"]}<br><button class="adj" id="help" onclick="Help()">Réponse</button><div><img style="cursor: pointer;" src="../speaker_f.png" onclick="HelpAudio('f')" id="audio-h"></img><img style="cursor: pointer;" src="../speaker_h.png" onclick="HelpAudio('h')" id="audio-f"></img></div><div id="RepRes">${DICOLANGtoSEE["Left"]}:<br>${HelpRes()}</div></div><button class="adj" id="retry" onclick="Pause()">${DICOLANGtoSEE["Pause"]}</button><button class="adj" id="pause" onclick="Retry()">${DICOLANGtoSEE["Retry"]}</button>`;
    document.getElementById("hiragana").style.visibility = "visible";
    CAT = document.getElementById("catégorie").value;
    localStorage.setItem("Cat", CAT)
    LANGUEtoTEACH = document.getElementById("language2").value;
    localStorage.setItem('LangT', LANGUEtoTEACH);
    console.log(localStorage.getItem("LangT"));
    document.getElementById("container").classList = "containerB";
    CreerListeMots();
    VAL = LISTEMOTS[0];
    LISTEMOTS = LISTEMOTS.slice(1);
    console.log(DICORETURN["Mots"][VAL], VAL);
    if (DICORETURN["Mots"][VAL]["Image"] === null || DICORETURN["Mots"][VAL]["Image"] === undefined) {
        switch (LANGUEtoSEE) {
            case "fr-FR":
                var DataToAff = "Mot";
                break;
            case "jp-JP":
                if (DATA[Num]["Kanji"] !== undefined) {
                    var DataToAff = "Kanji";
                } else {
                    var DataToAff = "Hiragana";
                }
                break;
            default:
                var DataToAff = LANGUEtoSEE;
                break;
        }
        console.log(DICORETURN["Mots"][VAL][DataToAff], DataToAff)
        document.getElementById("container").innerHTML = `<button disabled class="button-grille-quiz"><p class="p-grille-quiz">${DICORETURN["Mots"][VAL][DataToAff].toUpperCase()}</p></button>`;
    } else {
        document.getElementById("container").innerHTML = `<button disabled class="button-grille-quiz"><img class="img-grille-quiz" src="${DICORETURN["Mots"][VAL]["Image"]}"></img></button>`;
    }
    adjustFontSize();
}

function SelectedOrNot3(NB) {
    if (NB == localStorage.getItem("NbMots")) {
        return "selected ";
    } else {
        return "";
    }
}

function IfMarathon() {
    if (localStorage.getItem("MaraScore") == 0) {
        return DICOLANGtoSEE["Play"];
    } else {
        return DICOLANGtoSEE["Reprendre"];
    }
}

async function GeneralQuiz() {
    DICORETURN = await DatasVictory(DATAS_RANGE);
    var Temp = "";
    var Temp2 = "";
    Object.keys(DICORETURN["Langue"]).forEach(lang => {
        lang = DICORETURN["Langue"][lang];
        if (lang["Langue"] === LANGUEtoSEE && lang["Langue"] === LANGUEtoTEACH) {
            DICOLANGtoSEE = lang;
            DICOLANGtoTEACH = lang;
            Temp += `<option selected value="${lang["Langue"]}">${lang["Nom"]} ${lang["Langue"]}</option>`;
            Temp2 += `<option selected value="${lang["Langue"]}">${lang["Nom"]} ${lang["Langue"]}</option>`;
        } else if (lang["Langue"] === LANGUEtoSEE) {
            DICOLANGtoSEE = lang;
            Temp += `<option selected value="${lang["Langue"]}">${lang["Nom"]} ${lang["Langue"]}</option>`;
            Temp2 += `<option value="${lang["Langue"]}">${lang["Nom"]} ${lang["Langue"]}</option>`;
        } else if (lang["Langue"] === LANGUEtoTEACH) {
            DICOLANGtoTEACH = lang;
            Temp += `<option value="${lang["Langue"]}">${lang["Nom"]} ${lang["Langue"]}</option>`;
            Temp2 += `<option selected value="${lang["Langue"]}">${lang["Nom"]} ${lang["Langue"]}</option>`;
        } else {
            Temp += `<option value="${lang["Langue"]}">${lang["Nom"]} ${lang["Langue"]}</option>`;
            Temp2 += `<option value="${lang["Langue"]}">${lang["Nom"]} ${lang["Langue"]}</option>`;
        }
    })
    var Text = `<button class="jouer" id="jouer" onclick="Launch()">${IfMarathon()}</button><div class="form-group"><select onchange="ModifLang()" id="language" name="language">` + Temp + `</select><select id="language2" name="language2">` + Temp2 + `</select></div><div class="form-group"><select id="rep" name="rep"><option ${SelectedOrNot("1")}value="1">${DICOLANGtoSEE["Easy"]}</option><option ${SelectedOrNot("4")}value="4">${DICOLANGtoSEE["Medium"]}</option><option ${SelectedOrNot("10")}value="10">${DICOLANGtoSEE["Hard"]}</option></select>`;
    Temp = `<select id="catégorie" name="catégorie"><option value="all">${DICOLANGtoSEE["All"]}</option>`;
    Object.keys(DICORETURN["Catégorie"]).forEach(cat => {
        let cati = DICORETURN["Catégorie"][cat];
        // console.log(cat);
        if (CATEG === cat) {
            Temp += `<option selected value="${cat}">${cati[localStorage.getItem("LangS")]}</option>`;
        } else {
            Temp += `<option value="${cat}">${cati[localStorage.getItem("LangS")]}</option>`;
        }
    })
    document.getElementById("container").innerHTML = Text + Temp + `</select><select id="nbmot" name="nbmot"><option ${SelectedOrNot3("all")}value="all">${DICOLANGtoSEE["All"]}</option><option ${SelectedOrNot3("25")}value="25">25 ${DICOLANGtoSEE["Word"]}</option><option ${SelectedOrNot3("50")}value="50">50 ${DICOLANGtoSEE["Word"]}</option><option ${SelectedOrNot3("100")}value="100">100 ${DICOLANGtoSEE["Word"]}</option><option ${SelectedOrNot3("250")}value="250">250 ${DICOLANGtoSEE["Word"]}</option></select></div>`;
    /*
    Temp = `<select id="voice" name="voice"><option ${SelectedOrNot2("son-f")}value="son-f">${DICOLANGtoSEE["Voice"]} 1</option><option ${SelectedOrNot2("son-h")}value="son-h">${DICOLANGtoSEE["Voice"]} 2</option></select>`;
    if (window.innerWidth > 1000) {
        Temp += `<input type="text" id="keyInput" value="${detectedKey}" readonly><input type="text" id="keyInput2" value="${detectedKey2}" readonly>`;
    }
    document.getElementById("container2").innerHTML = Temp;
    let obj = Object.entries(DICORETURN["Langue"]).filter(([key, value]) => value["Langue"] === localStorage.getItem("LangS"))[0][1];
    document.getElementById("modifier").innerHTML = obj["Modify"];
    if (window.innerWidth > 1000) {
        document.getElementById('keyInput').addEventListener('keydown', function (event) {
            detectedKey = event.key;
            this.value = detectedKey.toUpperCase();
            localStorage.setItem("Key1", detectedKey);
        });
    
        document.getElementById('keyInput2').addEventListener('keydown', function (event) {
            detectedKey2 = event.key;
            this.value = detectedKey2.toUpperCase();
            localStorage.setItem("Key2", detectedKey2);
        });
    }*/
}