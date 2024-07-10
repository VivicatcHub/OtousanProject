var I = localStorage.getItem('I');
if (I === null) {
    I = 1;
    localStorage.setItem('I', I);
}
var CASES = [];
var PLAY = 0;
var DICORETURN = {};

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
    var rate = 0.8;
    var msg = new SpeechSynthesisUtterance();
    msg.text = TEXT;
    msg.lang = 'ja-JP'; // Définir la langue à japonais
    msg.rate = rate; // Définir la vitesse de lecture

    // Utiliser la synthèse vocale pour lire le texte
    window.speechSynthesis.speak(msg);
}

function SpeakTextF(TEXT) {
    responsiveVoice.speak(TEXT, "Japanese Female");
}

function ValeurAleatoireDico(DATA) {
    const Keys = Object.keys(DATA);
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

function CreerListe(X, Y, DATA) {
    var Result = [];
    let Nb = (X * Y) / 2;
    let TempData = { ...DATA };
    for (let i = 0; i < Nb; i++) {
        AleaKey = ValeurAleatoireDico(TempData);
        delete TempData[AleaKey];
        Result.push(AleaKey);
    }
    return Result;
}

function CreerGrille(Y, X, DATA) {
    let Liste = CreerListe(X, Y, DATA);
    // console.log(DATA);
    var Grille = `<div style='width: ${Y * 125}px;' class='grille'>`;
    for (let x = 0; x < X; x++) {
        for (let y = 0; y < Y; y++) {
            let Nb = x * Y + y + 1;
            let Num = ValeurAleatoireListe(Liste);
            CASES.push(Num);
            // console.log(Num, DATA[Num]);
            if (DATA[Num]["Image"] === null) {
                Grille += `<button id="${Nb}" class="button-grille" onclick="Click(${Nb}, ${Num})"><p class="p-grille">${DATA[Num]["Mot"]}</p></button>`
            } else {
                Grille += `<button id="${Nb}" class="button-grille" onclick="Click(${Nb}, ${Num})"><img class="img-grille" src="${DATA[Num]["Image"]}"></img></button>`
            }
        }
        Grille += "<br>";
    }
    Grille += "</div>"
    return Grille;
}

function Click(NB, NUM) {
    if (NUM == PLAY) {
        // console.log("fiuuu");
        let as = document.getElementById(String(NB));
        document.getElementById('wtf').innerHTML = DICORETURN["Mots"][PLAY]["Mot"] + "<br>" + DICORETURN["Mots"][PLAY]["Hiragana"] + " - " + DICORETURN["Mots"][PLAY]["Kanji"];
        as.style.visibility = "hidden";
        console.log(CASES);
        SupprimerValeurListe(CASES, String(NUM));
        console.log(CASES);
        if (CASES.length >= 1) {
            PLAY = ValeurAleatoireListe(CASES);
            // console.log(CASES, PLAY)
            SpeakTextF(DICORETURN["Mots"][PLAY]["Hiragana"]);
            document.getElementById('son-h').onclick = function() {
                SpeakTextH(DICORETURN["Mots"][PLAY]["Hiragana"]);
            };
            document.getElementById('son-f').onclick = function() {
                SpeakTextF(DICORETURN["Mots"][PLAY]["Hiragana"]);
            };
        } else {
            alert("Fini");
        }
    } else {
        console.log("raté")
        for (let i = 1; i < 12*7; i++) {
            let as = document.getElementById(String(i));
            if (as.style.visibility === "hidden") {
                let cas = ValeurAleatoireListe(CASES);
                as.onclick = function() {
                    Click(i, cas);
                }
                if (DICORETURN["Mots"][cas]["Image"] === null) {
                    as.innerHTML = `<p class="p-grille">${DICORETURN["Mots"][cas]["Mot"]}</p>`;
                } else {
                    as.innerHTML = `<img class="img-grille" src="${DICORETURN["Mots"][cas]["Image"]}"></img>`;
                }
                as.style.visibility = "";
                break;
            }
        }
    }
}

async function general() {
    DICORETURN = await DatasVictory(DATAS_RANGE);
    console.log("DicoReturn:", DICORETURN);
    document.getElementById('container').innerHTML = CreerGrille(12, 7, DICORETURN["Mots"]);
    PLAY = ValeurAleatoireListe(CASES);
    document.getElementById('wtf').innerHTML = "";
    SpeakTextF(DICORETURN["Mots"][PLAY]["Hiragana"]);
    document.getElementById('son-h').onclick = function() {
        SpeakTextH(DICORETURN["Mots"][PLAY]["Hiragana"]);
    };
    document.getElementById('son-f').onclick = function() {
        SpeakTextF(DICORETURN["Mots"][PLAY]["Hiragana"]);
    };
}