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
var DICORETURN = {};
var VAL = "";

function ModifInputs(input) {
    input.style.width = ((input.value.length + 2) * 8) + 'px';
    switch (LANGUEtoTEACH) {
        case "fr-FR":
            var DataToAff = "Mot";
            break;
        case "jp-JP":
            var DataToAff = "Hiragana";
            break;
        default:
            var DataToAff = LANGUEtoTEACH;
            break;

    }
    if (DICORETURN["Mots"][VAL][DataToAff].toUpperCase() === input.value.toUpperCase()) {
        input.value = "";
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
        VAL = ValeurAleatoireDico(Object.entries(DICORETURN["Mots"]).filter(([key, value]) => value[Temp] !== undefined && value[Temp] !== null && value[Temp2] !== undefined && value[Temp2] !== null).reduce((acc, [key, value]) => {
            acc[key] = value;
            return acc;
        }, {}));
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
}

function Launch() {
    LANGUEtoTEACH = document.getElementById("language2").value;
    localStorage.setItem('LangT', LANGUEtoTEACH);
    console.log(localStorage.getItem("LangT"));
    document.getElementById("container").classList = "containerB"
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
    VAL = ValeurAleatoireDico(Object.entries(DICORETURN["Mots"]).filter(([key, value]) => value[Temp] !== undefined && value[Temp] !== null && value[Temp2] !== undefined && value[Temp2] !== null).reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
    }, {}));
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
    var Text = `<button class="jouer" id="jouer" onclick="Launch()">${DICOLANGtoSEE["Play"]}</button><div class="form-group"><select onchange="ModifLang()" id="language" name="language">` + Temp + `</select><select id="language2" name="language2">` + Temp2 + `</select></div><div class="form-group"><select id="rep" name="rep"><option ${SelectedOrNot("1")}value="1">${DICOLANGtoSEE["Easy"]}</option><option ${SelectedOrNot("4")}value="4">${DICOLANGtoSEE["Medium"]}</option><option ${SelectedOrNot("10")}value="10">${DICOLANGtoSEE["Hard"]}</option></select>`;
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
    document.getElementById("container").innerHTML = Text + Temp + "</select></div>";
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