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
var RECORDS = localStorage.getItem('RecordsQuiz');
if (RECORDS === null) {
    RECORDS = "0,0,0";
    localStorage.setItem('RecordsQuiz', RECORDS);
}
var DICORETURN = {};
var VAL = "";
var LISTEMOTS = [];
var SCORE = 0;
var HELPRES = 0;
var md = new MobileDetect(window.navigator.userAgent);

function JapOrNot() {
    if (LANGUEtoTEACH === "jp-JP") {
        if (DICORETURN["Mots"][VAL]["Kanji"] !== undefined) {
            return ` (${DICORETURN["Mots"][VAL]["Kanji"]})`;
        }
    }
    return "";
}

document.getElementById('hiragana').addEventListener('focus', function () {
    if (md.mobile()) {
        if (localStorage.getItem("WebView")) {
            document.body.classList.add('close');
        } else {
            document.body.classList.add('open');
        }
    }
});

document.getElementById('hiragana').addEventListener('blur', function () {
    if (md.mobile()) {
        if (localStorage.getItem("WebView")) {
            document.body.classList.remove('close');
        } else {
            document.body.classList.remove('open');
        }
    }
});

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
            if (DICORETURN["Mots"][VAL]["Kanji"] !== undefined && DICORETURN["Mots"][VAL]["Kanji"] !== null) {
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
        document.getElementById('wtf').innerHTML = `${DICORETURN["Mots"][VAL][DataToAff].toUpperCase()}<br>${DICORETURN["Mots"][VAL][Temp].toUpperCase()}${JapOrNot()}<br>${DICOLANGtoSEE["Word"]} ${DICOLANGtoSEE["Left2"]}: ${LISTEMOTS.length}`;
        SCORE++;
        input.value = "";
        if (LISTEMOTS.length >= 1) {
            VAL = LISTEMOTS[0];
            LISTEMOTS = LISTEMOTS.slice(1);
            // console.log(LISTEMOTS, LISTEMOTS.length);
        } else {
            document.getElementById("audioFin").play();
            let Result = parseInt(SCORE) + parseInt(MARASCORE);
            alert(`Bravo, tu as trouvé ${Result} mot(s)`);
            document.getElementById("container").remove();
            document.getElementById("hiragana").remove();
            RECORDS = RECORDS.split(",")
            switch(DIFF) {
                case "1":
                    RECORDS[0] = Math.max(RECORDS[0], Result);
                    break;
                case "4":
                    RECORDS[1] = Math.max(RECORDS[1], Result);
                    break;
                case "10":
                    RECORDS[2] = Math.max(RECORDS[2], Result);
                    break;
            }
            localStorage.setItem("RecordsQuiz", RECORDS);
            // console.log(RECORDS);
        }
        switch (LANGUEtoSEE) {
            case "fr-FR":
                var DataToAff = "Mot";
                break;
            case "jp-JP":
                if (DICORETURN["Mots"][VAL]["Kanji"] !== undefined && DICORETURN["Mots"][VAL]["Kanji"] !== null) {
                    var DataToAff = "Kanji";
                } else {
                    var DataToAff = "Hiragana";
                }
                break;
            default:
                var DataToAff = LANGUEtoSEE;
                break;
    
        }
        if (DICORETURN["Mots"][VAL]["Image"] === null || DICORETURN["Mots"][VAL]["Image"] === undefined) {
            console.log(DICORETURN["Mots"][VAL], DataToAff);
            document.getElementById("container").innerHTML = `<button disabled class="button-grille-quiz"><p class="p-grille-quiz">${DICORETURN["Mots"][VAL][DataToAff].toUpperCase()}</p></button>`;
        } else {
            document.getElementById("container").innerHTML = `<button disabled class="button-grille-quiz"><img class="img-grille-quiz" src="${DICORETURN["Mots"][VAL]["Image"]}"></img></button>`;
        }
        adjustFontSize();
    }
}

function LangueToSee(VALUE) {
    switch (LANGUEtoSEE) {
        case "fr-FR":
            return "Mot";
        case "jp-JP":
            if (VALUE["Kanji"] !== undefined) {
                return "Kanji";
            } else {
                return "Hiragana";
            }
        default:
            return LANGUEtoSEE;
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
        if (CAT === "all") {
            var Liste = Object.entries(DICORETURN["Mots"]).filter(([key, value]) => value[Temp] !== undefined && value[Temp] !== null && LangueToSee(value) !== undefined && LangueToSee(value) !== null).reduce((acc, [key, value]) => { acc[key] = value; return acc; }, {});
        } else {
            var Liste = Object.entries(DICORETURN["Mots"]).filter(([key, value]) => value[Temp] !== undefined && value[Temp] !== null && LangueToSee(value) !== undefined && LangueToSee(value) !== null && InCateg(CAT, value)).reduce((acc, [key, value]) => { acc[key] = value; return acc; }, {});
        }
        let Len = parseInt(NBMOTS !== "all" ? Math.min(NBMOTS, Object.keys(Liste).length) : Object.keys(Liste).length);
        // console.log(Liste, Len);
        for (let i = 0; i < Len; i++) {
            let Temp = ValeurAleatoireDico(Liste);
            delete Liste[Temp];
            LISTEMOTS.push(Temp);
            // console.log(Temp, Object.keys(Liste).length, i);
        }

    } else {
        LISTEMOTS = MARATHON.split(",");
    }
    // console.log(LISTEMOTS);
}

function HelpRes() {
    if (DIFF === "1") {
        return "∞";
    } else {
        return HELPRES;
    }
}

function Block() {
    if (HELPRES <= 0 && DIFF !== "1") {
        document.getElementById("help").disabled = true;
        document.getElementById("help").style.cursor = "default";
        document.getElementById("audio-h").onclick = "";
        document.getElementById("audio-h").style.cursor = "default";
        document.getElementById("audio-f").onclick = "";
        document.getElementById("audio-f").style.cursor = "default";
    }
}

function Help() {
    console.log(HELPRES);
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
    if (HELPRES > 0 || HELPRES === "all") {
        alert(DICORETURN["Mots"][VAL][Temp]);
        if (HELPRES !== "all") { HELPRES-- };
        document.getElementById("RepRes").innerHTML = `${DICOLANGtoSEE["Left"]}:<br>${HelpRes()}`;
    }
    Block();
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
        SpeakTextH(Text, "LangT");
    } else {
        SpeakTextF(Text, "LangT");
    }
    if (HELPRES !== "all") { HELPRES-- };
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
    localStorage.setItem("Marathon", [VAL].concat(LISTEMOTS));
    localStorage.setItem("MaraScore", SCORE);
    localStorage.setItem("MaraHelp", HELPRES);
    Retry();
}

function Launch() {
    NBMOTS = document.getElementById("nbmot").value;
    localStorage.setItem("NbMots", NBMOTS);
    if (NBMOTS === "other") {
        let userInput = prompt("Please enter your number:");
        NBMOTS = parseInt(userInput);
    }
    DIFF = document.getElementById("rep").value;
    if (DIFF === "1") {
        HELPRES = "all";    
    } else if (DIFF === "4") {
        HELPRES = Math.min(25, parseInt(localStorage.getItem("MaraHelp")));
    } else {
        HELPRES = Math.min(5, parseInt(localStorage.getItem("MaraHelp")));
    }
    localStorage.setItem("Diff", DIFF)
    document.getElementById("containerD").innerHTML = `<p id="wtf"></p><div style="align-items: center;display:flex; flex-direction: column;border: 1px solid #ccc; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); padding: 5px;">${DICOLANGtoSEE["Help"]}<br><button class="adj" id="help" onclick="Help()">${DICOLANGtoSEE["Réponse"]}</button><div><img style="cursor: pointer;" src="../speaker_f.png" onclick="HelpAudio('f')" id="audio-h"></img><img style="cursor: pointer;" src="../speaker_h.png" onclick="HelpAudio('h')" id="audio-f"></img></div><div id="RepRes">${DICOLANGtoSEE["Left2"]}:<br>${HelpRes()}</div></div><button class="adj" id="retry" onclick="Pause()">${DICOLANGtoSEE["Pause"]}</button><button class="adj" id="pause" onclick="Retry()">${DICOLANGtoSEE["Retry"]}</button>`;
    document.getElementById("hiragana").style.visibility = "visible";
    CAT = document.getElementById("catégorie").value;
    localStorage.setItem("Cat", CAT)
    LANGUEtoTEACH = document.getElementById("language2").value;
    localStorage.setItem('LangT', LANGUEtoTEACH);
    // console.log(localStorage.getItem("LangT"));
    document.getElementById("container").classList = "containerB";
    CreerListeMots();
    VAL = LISTEMOTS[0];
    LISTEMOTS = LISTEMOTS.slice(1);
    Block();
    // console.log(DICORETURN["Mots"][VAL], VAL);
    if (DICORETURN["Mots"][VAL]["Image"] === null || DICORETURN["Mots"][VAL]["Image"] === undefined) {
        switch (LANGUEtoSEE) {
            case "fr-FR":
                var DataToAff = "Mot";
                break;
            case "jp-JP":
                if (DICORETURN["Mots"][VAL]["Kanji"] !== undefined) {
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
    } else if (localStorage.getItem("NbMots") !== "all") {
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
    document.getElementById("container").innerHTML = Text + Temp + `</select><select id="nbmot" name="nbmot"><option ${SelectedOrNot3("all")}value="all">${DICOLANGtoSEE["All"]}</option><option ${SelectedOrNot3("25")}value="25">25 ${DICOLANGtoSEE["Word"]}</option><option ${SelectedOrNot3("50")}value="50">50 ${DICOLANGtoSEE["Word"]}</option><option ${SelectedOrNot3("100")}value="100">100 ${DICOLANGtoSEE["Word"]}</option><option ${SelectedOrNot3("250")}value="250">250 ${DICOLANGtoSEE["Word"]}</option><option ${SelectedOrNot3("other")}value="other">AUTRES</option></select></div>`;
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