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

document.addEventListener('DOMContentLoaded', (event) => {
    if (window.innerWidth > 1000) {
        var boxSize = 120 + 40; // Taille des boîtes
    } else if (window.innerWidth > 800) {
        var boxSize = 100 + 40; // Taille des boîtes
    } else {
        var boxSize = 80 + 40; // Taille des boîtes
    }
    const boxes = document.querySelectorAll('.Box');
    const speed = 1;
    const directions = Array.from({ length: boxes.length }, () => ({
        x: Math.random() > 0.5 ? speed : -speed,
        y: Math.random() > 0.5 ? speed : -speed
    }));

    function moveBoxes() {
        boxes.forEach((box, index) => {
            let rect = box.getBoundingClientRect();

            // Move box
            let newX = rect.left + directions[index].x;
            let newY = rect.top + directions[index].y;

            // Check for collision with walls
            if (newX <= 0 || newX + rect.width >= window.innerWidth) {
                directions[index].x *= -1;
            }
            if (newY <= 0 || newY + rect.height >= window.innerHeight) {
                directions[index].y *= -1;
            }

            // Check for collision with other boxes
            boxes.forEach((otherBox, otherIndex) => {
                if (index !== otherIndex) {
                    let otherRect = otherBox.getBoundingClientRect();
                    if (
                        rect.left < otherRect.right &&
                        rect.right > otherRect.left &&
                        rect.top < otherRect.bottom &&
                        rect.bottom > otherRect.top
                    ) {
                        // Simple collision response: reverse direction
                        directions[index].x *= -1;
                        directions[index].y *= -1;
                        directions[otherIndex].x *= -1;
                        directions[otherIndex].y *= -1;
                    }
                }
            });

            box.style.left = `${rect.left + directions[index].x}px`;
            box.style.top = `${rect.top + directions[index].y}px`;
        });

        requestAnimationFrame(moveBoxes);
    }

    function isOverlapping(box, otherBoxes) {
        const rect1 = box.getBoundingClientRect();
        return Array.from(otherBoxes).some(otherBox => {
            if (box === otherBox) return false;
            const rect2 = otherBox.getBoundingClientRect();
            return (
                rect1.left < rect2.right &&
                rect1.right > rect2.left &&
                rect1.top < rect2.bottom &&
                rect1.bottom > rect2.top
            );
        });
    }

    boxes.forEach((box, index) => {
        let posX, posY;
        do {
            posX = Math.random() * (window.innerWidth - boxSize - 10);
            posY = Math.random() * (window.innerHeight - boxSize - 10);
            box.style.left = `${posX}px`;
            box.style.top = `${posY}px`;
        } while (isOverlapping(box, boxes));
    });
    moveBoxes();
});

async function GeneralRecords() {
    DICORETURN = await DatasVictory(DATAS_RANGE);
    let RecordsImagier = localStorage.getItem("RecordsImagier");
    if (RecordsImagier === null) {
        RecordsImagier = "0,0,0";
        localStorage.setItem('RecordsImagier', RecordsImagier);
    }
    RecordsImagier = RecordsImagier.split(",")
    var RecordsQuiz = localStorage.getItem('RecordsQuiz');
    if (RecordsQuiz === null) {
        RecordsQuiz = "0,0,0";
        localStorage.setItem('RecordsQuiz', RecordsQuiz);
    }
    RecordsQuiz = RecordsQuiz.split(",")
    document.getElementById("ImagierBox").innerHTML = `<div class="name" id="Imagier">${Object.keys(DICORETURN["Langue"]).map(Lan => DICORETURN["Langue"][Lan]).find(Lan => Lan["Langue"] === LANGUEtoSEE)?.["Imagier"]}</div><br>${Object.keys(DICORETURN["Langue"]).map(Lan => DICORETURN["Langue"][Lan]).find(Lan => Lan["Langue"] === LANGUEtoSEE)?.["Easy"]}: ${RecordsImagier[0]}<br>${Object.keys(DICORETURN["Langue"]).map(Lan => DICORETURN["Langue"][Lan]).find(Lan => Lan["Langue"] === LANGUEtoSEE)?.["Medium"]}: ${RecordsImagier[1]}<br>${Object.keys(DICORETURN["Langue"]).map(Lan => DICORETURN["Langue"][Lan]).find(Lan => Lan["Langue"] === LANGUEtoSEE)?.["Hard"]}: ${RecordsImagier[2]}`;
    document.getElementById("QuizBox").innerHTML = `<div class="name" id="Quiz">${Object.keys(DICORETURN["Langue"]).map(Lan => DICORETURN["Langue"][Lan]).find(Lan => Lan["Langue"] === LANGUEtoSEE)?.["Quiz"]}</div><br>${Object.keys(DICORETURN["Langue"]).map(Lan => DICORETURN["Langue"][Lan]).find(Lan => Lan["Langue"] === LANGUEtoSEE)?.["Easy"]}: ${RecordsQuiz[0]}<br>${Object.keys(DICORETURN["Langue"]).map(Lan => DICORETURN["Langue"][Lan]).find(Lan => Lan["Langue"] === LANGUEtoSEE)?.["Medium"]}: ${RecordsQuiz[1]}<br>${Object.keys(DICORETURN["Langue"]).map(Lan => DICORETURN["Langue"][Lan]).find(Lan => Lan["Langue"] === LANGUEtoSEE)?.["Hard"]}: ${RecordsQuiz[2]}`;
    document.getElementById("Menu").innerHTML = Object.keys(DICORETURN["Langue"]).map(Lan => DICORETURN["Langue"][Lan]).find(Lan => Lan["Langue"] === LANGUEtoSEE)?.["Menu"];
    adjustFontSize();
}

GeneralRecords();