var I = localStorage.getItem('I');
if (I === null) {
    I = 1;
    localStorage.setItem('I', I);
}

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
        Dico[row.c[0].v] = {};
        var cp = 1;
        Liste.forEach(el => {
            if (row.c[cp] !== null) {
                // console.log(row.c[0].v, el, row.c[cp].v)
                Dico[row.c[0].v][el] = row.c[cp].v;
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

async function general() {
    var DicoReturn = await DatasVictory(DATAS_RANGE);
    console.log("DicoReturn:", DicoReturn);
    var text = "";
    for (let i = 1; i < 49; i++) {
        mot = DicoReturn["Mots"][i];
        text += `<img src='${mot["Image"]}'>${mot["Mot"]}</img><br>`;
    }
    document.getElementById('container').innerHTML = text;
}