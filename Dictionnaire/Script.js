var DICORETURN = {};
var LANGUEtoSEE = localStorage.getItem('LangS');
if (LANGUEtoSEE === null) {
    LANGUEtoSEE = null;
    localStorage.setItem('LangS', LANGUEtoSEE);
}
var LANGUEtoTEACH = localStorage.getItem('LangT');
if (LANGUEtoTEACH === null) {
    LANGUEtoTEACH = "jp-JP";
    localStorage.setItem('LangT', LANGUEtoTEACH);
}

function Info(NUM) {
    var Data = DICORETURN["Mots"][NUM];
    console.log(Data);
    var Text = "";
    Object.keys(DICORETURN["Langue"]).forEach(Num => {
        let Lan = DICORETURN["Langue"][Num];
        switch (Lan["Langue"]) {
            case "jp-JP":
                if (Data["Hiragana"] !== null && Data["Hiragana"] !== undefined) {
                    Text += Object.entries(DICORETURN["Langue"]).filter(([key, value]) => value["Langue"] === LANGUEtoSEE)[0][1][Lan["Langue"]] + ":<br>";
                    Text += Data["Hiragana"];
                    if (Data["Kanji"] !== null && Data["Kanji"] !== undefined) {
                        Text += ` (${Data["Kanji"]})`;
                    }
                    Text += "<br><br>";
                }
                break;
            case "fr-FR":
                if (Data["Mot"] !== null && Data["Mot"] !== undefined) {
                    Text += Object.entries(DICORETURN["Langue"]).filter(([key, value]) => value["Langue"] === LANGUEtoSEE)[0][1][Lan["Langue"]] + ":<br>";
                    Text += Data["Mot"] + "<br><br>";
                }
                break;
            default:
                if (Data[Lan["Langue"]] !== null && Data[Lan["Langue"]] !== undefined) {
                    Text += Object.entries(DICORETURN["Langue"]).filter(([key, value]) => value["Langue"] === LANGUEtoSEE)[0][1][Lan["Langue"]] + ":<br>";
                    Text += Data[Lan["Langue"]] + "<br><br>";
                }
                break;
        }
    });
    const overlay = document.getElementById('overlay');
    overlay.style.display = 'block';
    let MaDiv = document.createElement("div");
    MaDiv.classList.add("pop-up");
    MaDiv.innerHTML = Text;
    document.body.appendChild(MaDiv);
    overlay.addEventListener('click', function () {
        overlay.style.display = 'none';
        MaDiv.remove();
    });
}

async function GeneralDico() {
    DICORETURN = await DatasVictory(DATAS_RANGE);
    const data = DICORETURN["Mots"]

    var Text = `<option value="all">CATEGORIE</option>`;
    Object.keys(DICORETURN["Catégorie"]).forEach(Num => {
        var Data = DICORETURN["Catégorie"][Num];
        Text += `<option value="${Num}">${Data[LANGUEtoSEE]}</option>`;
    });
    document.getElementById("categorySelect").innerHTML = Text;

    const categorySelect = document.getElementById('categorySelect');
    const numberList = document.getElementById('numberList');

    function Loading() {
        const loader = document.getElementById('loader');
        loader.style.display = 'block';
        const overlay = document.getElementById('overlay');
        overlay.style.display = 'block';
    }

    function NotLoading() {
        const loader = document.getElementById('loader');
        loader.style.display = 'none';
        const overlay = document.getElementById('overlay');
        overlay.style.display = 'none';
    }

    function filterNumbers() {
        Loading();
        setTimeout(() => {
            const selectedCategory = categorySelect.value;
            numberList.innerHTML = '';

            for (const [number, info] of Object.entries(data)) {
                if (selectedCategory === "all" || InCateg(selectedCategory, info)) {
                    const li = document.createElement('li');
                    let Test = `<div style='width: ${window.innerWidth < 1000 ? '75px' : '125px'};' class='grille-dico'>`;

                    if (data[number]["Image"] === null || data[number]["Image"] === undefined) {
                        Test += `<button onclick="Info(${number})" class="button-grille"><p class="p-grille">${data[number]["Mot"].toUpperCase()}</p></button>`;
                    } else {
                        Test += `<button onclick="Info(${number})" class="button-grille"><img class="img-grille" src="${data[number]["Image"]}"></button>`;
                    }
                    Test += "</div>";
                    li.innerHTML = Test;
                    numberList.appendChild(li);
                }
            }
            adjustFontSize();
            NotLoading();
        }, 100); // Ajoutez un délai pour permettre l'affichage du chargement
    }

    categorySelect.addEventListener('change', filterNumbers);

    // Affiche tous les numéros au chargement initial
    //filterNumbers();
}