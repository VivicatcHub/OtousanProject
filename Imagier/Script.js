var I = localStorage.getItem('I');
if (I === null) {
    I = 1;
    localStorage.setItem('I', I);
}
var CASES = [];
var PLAY = 0;
var DICORETURN = {};
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
var DIFF = localStorage.getItem('Diff');
if (DIFF === null) {
    DIFF = "1";
    localStorage.setItem('Diff', DIFF);
}
var CATEG = localStorage.getItem('Cat');
if (CATEG === null) {
    CATEG = "all";
    localStorage.setItem('Cat', CATEG);
}
var VOICE = localStorage.getItem('Voice');
if (VOICE === null) {
    VOICE = "son-f";
    localStorage.setItem('Voice', VOICE);
}
var detectedKey = localStorage.getItem('Key1');
if (detectedKey === null) {
    detectedKey = "S";
    localStorage.setItem('Key1', detectedKey);
}
var detectedKey2 = localStorage.getItem('Key2');
if (detectedKey2 === null) {
    detectedKey2 = "D";
    localStorage.setItem('Key2', detectedKey2);
}
var DICOLANGtoSEE = {};
var DICOLANGtoTEACH = {};
var SCORE = 0;

async function RecupSheetDatas(ID, TITLE, RANGE) {
    try {
        const Url = `https://docs.google.com/spreadsheets/d/${ID}/gviz/tq?sheet=${TITLE}&range=${RANGE}`;
        const Response = await fetch(Url);
        const Text = await Response.text();
        const Data = JSON.parse(Text.substr(47).slice(0, -2));
        return Data;
    } catch (error) { throw error; }
}

async function TraiterSheetDatas(DATA) {
    console.log("TraiterSheetDatas, Data:", DATA)
    var Liste = [];
    var Dico = {};
    DATA.table.cols.forEach(col => {
        if (col.label !== "Numéro") {
            Liste.push(col.label);
        }
    })
    DATA.table.rows.forEach(row => {
        Dico[String(row.c[0].v)] = {};
        var cp = 1;
        Liste.forEach(el => {
            if (row.c[cp] !== null) {
                // console.log(row.c[0].v, el, row.c[cp].v)
                Dico[String(row.c[0].v)][el] = row.c[cp].v;
            }
            cp++;
        })
    })
    // console.log(Dico);
    return Dico;
}

async function DatasVictory(DATAS) {
    var MODIF = localStorage.getItem('Modif');
    if (MODIF === 'true') {
        try {
            var LISTE = [];
            Object.keys(DATAS).forEach(ele => {
                LISTE.push(ele);
            })
            console.log("LISTE:", LISTE);
            var Dico = {};
            var promises = LISTE.map(async function (Element) { // Création d'un tableau de promesses
                Dico[Element] = await TraiterSheetDatas(await RecupSheetDatas(SHEET_ID, Element, DATAS[Element]));
            });
            await Promise.all(promises); // Attendre que toutes les promesses se terminent
            console.log("DICO:", Dico);
            var Request = indexedDB.open(`MaBaseDeDonnees${GAME}`, I);

            Request.onupgradeneeded = function (event) {
                var Db = event.target.result;
                var ObjectStore = Db.createObjectStore('MonObjet', { keyPath: 'id', autoIncrement: true }); // Créer un objetStore (équivalent à une table dans une base de données relationnelle)
            };

            Request.onsuccess = function (event) {
                var Db = event.target.result;
                var Transaction = Db.transaction(['MonObjet'], 'readwrite'); // Commencer une transaction en mode lecture-écriture
                var ObjectStore = Transaction.objectStore('MonObjet'); // Récupérer l'objet store
                var Data = Dico; // Ajouter l'objet à l'objet store
                // console.log("Data:", Data, Element);
                Data["id"] = 1;
                var NewRequest = ObjectStore.put(Data);

                NewRequest.onsuccess = function (event) {
                    console.log("Objet modifié avec succès !");
                };

                NewRequest.onerror = function (event) {
                    console.error("Erreur lors de l'ajout de l'objet :", event.target.error);
                };
            };

            Request.onerror = function (event) {
                console.error("Erreur lors de l'ouverture de la base de données :", event.target.error, Element);
            };

        } catch (error) {
            console.error('Une erreur est survenue :', error);
        }
        MODIF = false;
        localStorage.setItem('Modif', MODIF);
    }
    else {
        var Dico = {};
        try {
            var Promesse = new Promise(function (Resolve, Reject) {
                var Request = indexedDB.open(`MaBaseDeDonnees${GAME}`, I);

                Request.onsuccess = function (event) {
                    var Db = event.target.result; // Obtention de la référence à la base de données ouverte
                    var Transaction = Db.transaction(['MonObjet'], 'readonly'); // Utilisation de la base de données pour effectuer des opérations | par exemple, récupérer des données depuis un objet store
                    var ObjectStore = Transaction.objectStore('MonObjet');
                    var GetRequest = ObjectStore.get(1);

                    GetRequest.onsuccess = function (event) {
                        Dico = GetRequest.result;
                        // console.log("Récupération réussie pour :", Element)
                        Resolve();
                    };

                    GetRequest.onerror = function (event) {
                        console.error("Erreur lors de la récupération de l'objet :", event.target.error);
                        Reject(event.target.error);
                    };
                };

                Request.onerror = function (event) {
                    console.error("Erreur lors de l'ouverture de la base de données :", event.target.error);
                    Reject(event.target.error);
                };

                Request.onupgradeneeded = async function (event) {
                    MODIF = 'true';
                    localStorage.setItem('Modif', MODIF);
                    I++;
                    localStorage.setItem('I', I);
                    location.reload();
                };
            });
            await Promesse;

        } catch (error) {
            console.error('Une erreur est survenue :', error);
            var Dico = {};
            var LISTE = [];
            Object.keys(DATAS).forEach(ele => {
                LISTE.push(ele);
            })
            var promises = LISTE.map(async function (Element) { // Création d'un tableau de promesses
                Dico[Element] = await TraiterSheetDatas(await RecupSheetDatas(SHEET_ID, Element, DATAS[Element]));
            });
            await Promise.all(promises); // Attendre que toutes les promesses se terminent
            console.log(Dico);
            return Dico;
        }
    }

    return Dico;
}

function Modif() {
    let MODIF = 'true';
    localStorage.setItem('Modif', MODIF);
    location.reload();
}

function SpeakTextH(TEXT) {
    /*
    var rate = 0.8;
    var msg = new SpeechSynthesisUtterance();
    msg.text = TEXT;
    msg.lang = 'ja-JP'; // Définir la langue à japonais
    msg.rate = rate; // Définir la vitesse de lecture

    // Utiliser la synthèse vocale pour lire le texte
    window.speechSynthesis.speak(msg);*/
    responsiveVoice.speak(TEXT, `${DICOLANGtoTEACH["Nom"]} Male`);
}

function SpeakTextF(TEXT) {
    responsiveVoice.speak(TEXT, `${DICOLANGtoTEACH["Nom"]} Female`);
}

function ValeurAleatoireDico(DATA) {
    const Keys = Object.keys(DATA);
    // console.log(Keys)
    const AleaKey = Keys[Math.floor(Math.random() * Keys.length)];
    return AleaKey;
}

function ValeurAleatoireListe(LIST) {
    // console.log(LIST)
    const Alea = Math.floor(Math.random() * LIST.length);
    return LIST[Alea];
}

function SupprimerValeurListe(LIST, valeur) {
    const index = LIST.indexOf(valeur);
    if (index > -1) {
        LIST.splice(index, 1); // Supprime l'élément à l'index spécifié
    }
}

function SameVoice(KEY, RESULT) {
    switch (LANGUEtoTEACH) {
        case "jp-JP":
            var Temp = "Hiragana";
            break;
        case "fr-FR":
            var Temp = "Mot";
            break;
        default:
            var Temp = LANGUEtoTEACH;
            break;
    }
    for (let i = 0; i < RESULT.length; i++) {
        // console.log(DICORETURN["Mots"][KEY][Temp], DICORETURN["Mots"][RESULT[i]][Temp])
        if (DICORETURN["Mots"][KEY][Temp] === DICORETURN["Mots"][RESULT[i]][Temp]) {
            return true;
        }
    }
    return false;
}

function SameWord(KEY, RESULT) {
    switch (LANGUEtoSEE) {
        case "jp-JP":
            var Temp = "Hiragana";
            break;
        case "fr-FR":
            var Temp = "Mot";
            break;
        default:
            var Temp = LANGUEtoSEE;
            break;
    }
    for (let i = 0; i < RESULT.length; i++) {
        // console.log(DICORETURN["Mots"][KEY][Temp], DICORETURN["Mots"][RESULT[i]][Temp])
        if (DICORETURN["Mots"][KEY][Temp] === DICORETURN["Mots"][RESULT[i]][Temp]) {
            return true;
        }
    }
    return false;
}

function CreerListe(X, Y, DATA, CAT) {
    var Result = [];
    let Nb = (X * Y) / 2;
    let Rep = parseInt(document.getElementById("rep").value);
    localStorage.setItem("Diff", Rep);
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
            var Temp2 = "Hiragana";
            break;
        default:
            var Temp2 = LANGUEtoSEE;
            break;
    }
    if (CAT === "all") {
        var TempData = Object.entries(DATA)
            .filter(([key, value]) => value[Temp] !== undefined && value[Temp] !== null && value[Temp2] !== undefined && value[Temp2] !== null).reduce((acc, [key, value]) => {
                acc[key] = value;
                return acc;
            }, {});
    } else {
        var TempData = Object.fromEntries(Object.entries(DATA).filter(([key, value]) => value["Catégorie"] === parseInt(CAT) && value[Temp] !== undefined && value[Temp] !== null && value[Temp2] !== undefined && value[Temp2] !== null));
    }
    let Len = Object.keys(TempData).length;
    // console.log(Nb, Len, Rep)
    for (let i = 0; i < Math.min(Nb, Len) / Rep; i++) {
        AleaKey = ValeurAleatoireDico(TempData);
        var cp = 0;
        while (SameVoice(AleaKey, Result) || SameWord(AleaKey, Result)) {
            // console.log(TempData, Result, AleaKey);
            AleaKey = ValeurAleatoireDico(TempData);
            cp++;
            if (cp > 100) {
                console.log("break");
                break;
            }
        }
        // alert('ui')
        delete TempData[AleaKey];
        Result.push(AleaKey);
    }
    return Result;
}

function rgbToHex(RGB) {
    return `#${RGB.map(val => {
        const hex = val.toString(16).padStart(2, '0');
        return hex;
    }).join('')}`;
}

function interpolateColor(FACTOR) {
    const start = [255, 127, 0]; // Orange
    const end = [127, 0, 255]; // Violet
    return start.map((startVal, i) => Math.round(startVal + FACTOR * (end[i] - startVal)));
}

function CreerGrille(Y, X, DATA, CAT) {
    let Liste = CreerListe(X, Y, DATA, CAT);
    // console.log(Liste);
    if (window.innerWidth < 1000) {
        var Grille = `<div style='width: ${Y * 75}px; background-image: url("${DICORETURN["Images"][ValeurAleatoireDico(Object.fromEntries(Object.entries(DICORETURN["Images"]).filter(([key, value]) => value["Type"] === "t")))]["Image"]}");' class='grille'>`;
    } else {
        var Grille = `<div style='width: ${Y * 125}px; background-image: url("${DICORETURN["Images"][ValeurAleatoireDico(Object.fromEntries(Object.entries(DICORETURN["Images"]).filter(([key, value]) => value["Type"] === "p")))]["Image"]}");' class='grille'>`;
    }
    for (let x = 0; x < X; x++) {
        for (let y = 0; y < Y; y++) {
            // console.log(x, y)
            let Nb = x * Y + y + 1;
            let Num = ValeurAleatoireListe(Liste);
            CASES.push(Num);
            if (DATA[Num]["Image"] === null || DATA[Num]["Image"] === undefined) {
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
                // console.log(rgbToHex(interpolateColor((x * Y + y) / (X * Y - 1))))
                Grille += `<button id="${Nb}" style="background-color: ${rgbToHex(interpolateColor((x * Y + y) / (X * Y - 1)))};" class="button-grille" onclick="Click(${Nb}, ${Num}, ${X}, ${Y}, '${CAT}')"><p class="p-grille" style="background-color: ${rgbToHex(interpolateColor((x * Y + y) / (X * Y - 1)))}; color: white;">${DATA[Num][DataToAff].toUpperCase()}</p></button>`
            } else {
                Grille += `<button id="${Nb}" style="background-color: ${rgbToHex(interpolateColor((x * Y + y) / (X * Y - 1)))};" class="button-grille" onclick="Click(${Nb}, ${Num}, ${X}, ${Y}, '${CAT}')"><img class="img-grille" src="${DATA[Num]["Image"]}"></img></button>`
            }
        }
        Grille += "<br>";
    }
    Grille += "</div>"
    return Grille;
}

function adjustFontSize() {
    textFit(document.querySelectorAll(".p-grille"), {
        alignHoriz: true,
        alignVert: true,
        multiLine: true,
        detectMultiLine: false,
        maxFontSize: 20,
        minFontSize: 6
    });
}

window.onload = adjustFontSize;
window.onresize = adjustFontSize;


function IfIsntUndefined(VAL) {
    if (VAL === undefined) {
        return "";
    } else {
        return `(${VAL})`;
    }
}

function Click(NB, NUM, X, Y, CAT) {
    // console.log(CAT);
    if (NUM == PLAY) {
        // console.log("fiuuu");
        switch (LANGUEtoTEACH) {
            case "jp-JP":
                var Temp = DICORETURN["Mots"][PLAY]["Hiragana"] + IfIsntUndefined(DICORETURN["Mots"][PLAY]["Kanji"]);
                break;
            case "fr-FR":
                var Temp = DICORETURN["Mots"][PLAY]["Mot"];
                break;
            default:
                var Temp = DICORETURN["Mots"][PLAY][LANGUEtoTEACH];
                break;
        }
        let as = document.getElementById(String(NB));
        document.getElementById('wtf').innerHTML = DICORETURN["Mots"][PLAY]["Mot"] + (LANGUEtoSEE !== LANGUEtoTEACH ? "<br>" + Temp : "");
        as.style.visibility = "hidden";
        SupprimerValeurListe(CASES, String(NUM));
        if (CASES.length >= 1) {
            PLAY = ValeurAleatoireListe(CASES);
            // console.log(CASES, PLAY)
            switch (LANGUEtoTEACH) {
                case "fr-FR":
                    if (VOICE === "son-f") {
                        SpeakTextF(DICORETURN["Mots"][PLAY]["Mot"]);
                    } else {
                        SpeakTextH(DICORETURN["Mots"][PLAY]["Mot"]);
                    }
                    break;
                case "jp-JP":
                    if (VOICE === "son-f") {
                        SpeakTextF(DICORETURN["Mots"][PLAY]["Hiragana"]);
                    } else {
                        SpeakTextH(DICORETURN["Mots"][PLAY]["Hiragana"]);
                    }
                    break;
                default:
                    if (VOICE === "son-f") {
                        SpeakTextF(DICORETURN["Mots"][PLAY][LANGUEtoTEACH]);
                    } else {
                        SpeakTextH(DICORETURN["Mots"][PLAY][LANGUEtoTEACH]);
                    }
                    break;

            }
            document.getElementById('son-h').onclick = function () {
                switch (LANGUEtoTEACH) {
                    case "fr-FR":
                        SpeakTextH(DICORETURN["Mots"][PLAY]["Mot"]);
                        break;
                    case "jp-JP":
                        SpeakTextH(DICORETURN["Mots"][PLAY]["Hiragana"]);
                        break;
                    default:
                        SpeakTextH(DICORETURN["Mots"][PLAY][LANGUEtoTEACH]);
                        break;

                }
            };
            document.getElementById('son-f').onclick = function () {
                switch (LANGUEtoTEACH) {
                    case "fr-FR":
                        SpeakTextF(DICORETURN["Mots"][PLAY]["Mot"]);
                        break;
                    case "jp-JP":
                        SpeakTextF(DICORETURN["Mots"][PLAY]["Hiragana"]);
                        break;
                    default:
                        SpeakTextF(DICORETURN["Mots"][PLAY][LANGUEtoTEACH]);
                        break;

                }
            };
        } else {
            switch (LANGUEtoSEE) {
                case "jp-JP":
                    var Temp = "1";
                    break;
                case "fr-FR":
                    var Temp = "2";
                    break;
                default:
                    var Temp = "0";
                    break;
            }
            document.getElementById("audioFin").play();
            var Text = DICORETURN["Langue"][Temp]["Fin"].replace('$', `${SCORE}`)
            alert(Text);
        }
    } else {
        SCORE++;
        console.log("raté");
        var box = document.getElementById(String(NB));
        box.classList.remove('animate');  // Remove the class to restart the animation if already present
        void box.offsetWidth;  // Trigger reflow to reset the animation
        box.classList.add('animate');
        for (let i = 1; i < X * Y + 1; i++) {
            let as = document.getElementById(String(i));
            if (as.style.visibility === "hidden") {
                // console.log(CASES, ValeurAleatoireDico(DICORETURN["Mots"]))
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
                if (CAT === "all") {
                    var cas = ValeurAleatoireDico(Object.entries(DICORETURN["Mots"])
                        .filter(([key, value]) => value[Temp] !== undefined && value[Temp] !== null && value[DataToAff] !== undefined && value[DataToAff] !== null).reduce((acc, [key, value]) => {
                            acc[key] = value;
                            return acc;
                        }, {}));
                } else {
                    var cas = ValeurAleatoireDico(Object.fromEntries(Object.entries(DICORETURN["Mots"]).filter(([key, value]) => value["Catégorie"] === parseInt(CAT) && value[Temp] !== undefined && value[Temp] !== null && value[DataToAff] !== undefined && value[DataToAff] !== null)));
                }
                CASES.push(cas);
                as.onclick = function () {
                    Click(i, cas, X, Y, CAT);
                }
                let x = Math.floor(i / Y);
                let y = i % Y - 1;
                console.log(x, y)
                if (DICORETURN["Mots"][cas]["Image"] === null || DICORETURN["Mots"][cas]["Image"] === undefined) {
                    as.innerHTML = `<p style="background-color: ${rgbToHex(interpolateColor((x * Y + y) / (X * Y - 1)))}; color: white;" class="p-grille">${DICORETURN["Mots"][cas][DataToAff].toUpperCase()}</p>`;
                } else {
                    as.innerHTML = `<img style="background-color: ${rgbToHex(interpolateColor((x * Y + y) / (X * Y - 1)))}; color: white;" class="img-grille" src="${DICORETURN["Mots"][cas]["Image"]}"></img>`;
                }
                as.style.visibility = "";
                break;
            }
        }
        adjustFontSize;
    }
}

function Retry() {
    location.reload();
    general;
}

function Launch() {
    VOICE = document.getElementById("voice").value;
    localStorage.setItem("Voice", VOICE);
    document.getElementById("container").classList = "cont";
    var selectedOption = document.getElementById("language2").value;
    localStorage.setItem('LangT', selectedOption);
    LANGUEtoTEACH = selectedOption;
    DICOLANGtoTEACH = Object.entries(DICORETURN["Langue"]).filter(([key, value]) => value["Langue"] === selectedOption)[0][1];
    X = document.getElementById("number-x").value;
    Y = document.getElementById("number-y").value;
    let CAT = String(document.getElementById("catégorie").value);
    localStorage.setItem("Cat", CAT);
    // console.log(CAT);
    document.getElementById('container').innerHTML = CreerGrille(X, Y, DICORETURN["Mots"], CAT);
    PLAY = ValeurAleatoireListe(CASES);
    document.getElementById("containerD").innerHTML = `<div class="containerB"><button id="son-f"><img src="../speaker_f.png" alt="JOUER"></img></button><p id="wtf"></p><button id="son-h"><img src="../speaker_h.png" alt="JOUER"></img></button></div><button id="retry" onclick="Retry()">${DICOLANGtoSEE["Retry"]}</button>`;
    document.getElementById('son-h').onclick = function () {
        // console.log(DICORETURN["Mots"][PLAY][LANGUEtoTEACH], LANGUEtoTEACH) 
        switch (LANGUEtoTEACH) {
            case "fr-FR":
                SpeakTextH(DICORETURN["Mots"][PLAY]["Mot"]);
                break;
            case "jp-JP":
                SpeakTextH(DICORETURN["Mots"][PLAY]["Hiragana"]);
                break;
            default:
                SpeakTextH(DICORETURN["Mots"][PLAY][LANGUEtoTEACH]);
                break;

        }
    };
    document.getElementById('son-f').onclick = function () {
        // console.log(DICORETURN["Mots"][PLAY][LANGUEtoTEACH], LANGUEtoTEACH)
        switch (LANGUEtoTEACH) {
            case "fr-FR":
                SpeakTextF(DICORETURN["Mots"][PLAY]["Mot"]);
                break;
            case "jp-JP":
                SpeakTextF(DICORETURN["Mots"][PLAY]["Hiragana"]);
                break;
            default:
                SpeakTextF(DICORETURN["Mots"][PLAY][LANGUEtoTEACH]);
                break;

        }
    };
    document.getElementById("container2").remove();
    adjustFontSize();
}

function ModifLang() {
    var selectedOption = document.getElementById("language").value;
    localStorage.setItem('LangS', selectedOption);
    location.reload();
}

document.addEventListener('keydown', function (event) {
    try {
        if (event.key === detectedKey) {
            document.getElementById("son-f").click();
        } else if (event.key === detectedKey2) {
            document.getElementById("son-h").click();
        }
    } catch (error) {
        console.log(error);
    }
});

function SelectedOrNot(NUM) {
    if (DIFF === NUM) {
        return "selected ";
    } else {
        return "";
    }
}

function SelectedOrNot2(NUM) {
    if (VOICE === NUM) {
        return "selected ";
    } else {
        return "";
    }
}

async function general() {
    DICORETURN = await DatasVictory(DATAS_RANGE);
    // console.log("DicoReturn:", DICORETURN);
    if (window.innerWidth > 1000) {
        X = Math.floor((window.innerWidth * 0.9) / 125);
        Y = Math.floor((window.innerHeight) / 125);
    } else {
        X = Math.floor((window.innerWidth) / 75);
        Y = Math.floor((window.innerHeight) / 75) + 1;
    }
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
    var Text = `<button class="jouer" id="jouer" onclick="Launch()">${DICOLANGtoSEE["Play"]}</button><div class="form-group"><select onchange="ModifLang()" id="language" name="language">` + Temp + `</select><select id="language2" name="language2">` + Temp2 + `</select></div><input type="number" id="number-y" name="number" min="1" max="50" value="${Y}"><input type="number" id="number-x" name="number" min="1" max="50" value="${X}"><div class="form-group"><select id="rep" name="rep"><option ${SelectedOrNot("1")}value="1">${DICOLANGtoSEE["Easy"]}</option><option ${SelectedOrNot("4")}value="4">${DICOLANGtoSEE["Medium"]}</option><option ${SelectedOrNot("10")}value="10">${DICOLANGtoSEE["Hard"]}</option></select>`;
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
    }
}