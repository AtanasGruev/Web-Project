//const openModalButtons = document.querySelectorAll('[data-modal-target]')
const closeModalButtons = document.querySelectorAll('[data-close-button]');
const overlay = document.getElementById('overlay');


const modalOnLoad = document.getElementById("modal");
// window.onload = openModal(modalOnLoad)


//отварянето го преместих в callback функцията, демек отваря се след като е load-нат json-а и е променен innerHTML-a на модала
//setTimeout(() => { openModal(modalOnLoad) }, 2000);

//закоментираното вече е излишно май, тъй като няма да имаме бутон който да отваря модалите

// openModalButtons.forEach(button => {
//     button.addEventListener('click', () => {
//         const modal = document.querySelector(button.dataset.modalTarget)
//         openModal(modal)
//     })
// })

overlay.addEventListener('click', () => {
    const modals = document.querySelectorAll('.modal.active')
    modals.forEach(modal => {
        closeModal(modal);
    })
})

closeModalButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modal = button.closest('.modal');
        closeModal(modal);
    })
})

function openModal(modal) {
    if (modal == null) return;
    modal.classList.add('active');
    overlay.classList.add('active');
}

function closeModal(modal) {
    if (modal == null) return;
    modal.classList.remove('active');
    overlay.classList.remove('active');

    //засега тук, може и да е ненужно
    var moodle = document.getElementById('moodle-container')
    moodle.style.visibility="visible";
}

function printMessage(message) {
    var narrationField = document.getElementById("narration");
    var messageQueue = [];

    messageQueue.push(message);
    if (messageQueue.length == 20) {
        messageQueue.shift();
    } else {
        narrationField.innerHTML += message;
        narrationField.innerHTML += "<br/><br/>"
    }
}

function incrementActions(counterActionsObj) {
    if (counterActionsObj["counterActions"] % 10 == 0 && counterActionsObj["flag"] == false) {
        console.log("NOW");
        var divsActions = document.getElementsByClassName("week-actions-div");
        for (var i = 0; i < divsActions.length; i += 1) {
            divsActions[i].style.backgroundColor = "#39d078";
            divsActions[i].style.boxShadow = "none";
        }
        counterActionsObj["flag"] = true;
    } else if (counterActionsObj["flag"]) {
        var currAction = document.getElementById("action-" + (counterActionsObj["counterActions"]) % 10);
        currAction.style.backgroundColor = "blue";
        currAction.style.boxShadow = "0 0 5px red";
        counterActionsObj["counterActions"]++;
        console.log(counterActionsObj["counterActions"]);

        if (counterActionsObj["counterActions"] % 10 == 0) {
            counterActionsObj["flag"] = false;
        }
    }
}

function parseWeeks() {
    fetch("../scenarios/week-0.json")
        .then(data => data.json())
        .then(result => callback(result))
}

// Това е все едно за обработката преди moodle формата
// Затова има само по един бутон

// За callback2 ще се минава с цикъл по options от json и ще се създават необходимите
// бутони. CSS-а ще ги прави да изглеждат ок, споко ;)))

function callback(result) {
    var modal = document.getElementById("modal");

    var modalTitle = document.getElementById("modal-title"); 
    var modalBody = document.getElementsByClassName("modal-body")[0];
    var modalFooter = document.getElementsByClassName("modal-footer")[0];

    modalTitle.innerHTML = result[0].eventHeader;
    modalBody.innerHTML = result[0].event;
    
    // Четем от json-а и си създаваме бутоните...

    // трябва да се промени малко json-a
    // скифтвай синтаксиса, много тромаво става
    // дали да не махнем array като options и да сложим "обект", ддз
    console.log(result[0].options[0].text); 

    var optButton = document.createElement("button");
    optButton.innerHTML = result[0].options[0].text;
    modalFooter.appendChild(optButton);

    // Слагаме eventListener на бутона, като се цъкне, closeModal() и скачаме на следващия modal
    optButton.addEventListener('click', () => {
        closeModal(modalOnLoad); // константата от горе, той си е един
        // Други действия
    })

    // За CSS-а на бутоните съм написал настройки в css-файла
    // Когато няма бутони - ок, нищо не се вижда
    // Когато има, няма да им сменяме стила оттук, затова е удобно ;)

    setTimeout(() => { openModal(modalOnLoad) }, 1500);

    //не знам дали тук е възможно да бъде цялата логика за week0
    //ако е в някакъв цикъл и итерира през евентите, може ли цикъла да блокира до натискане на опция на модала
    //edit: или до успешното регистриране и логване в мудъл
    //дали ще е по-лесно на бъдат две отделни функции - в едната е първата половина на week0 - която казва да се 
    //регистрираш и може да има още едно модал който да обяснява нещо за статистиките когато успееш да се регистрираш
    //и втората половина е вече тази в която имаме опциите дето трябва да избираш

    
}


(function () {
    // Да се направи на отделна функция, а IIFE да служи за main()

    var toggleMode = document.getElementById("toggle-day-night");
    var counterToggle = 0;

    toggleMode.onclick = () => {
        document.querySelector("body").classList.toggle("active");
        console.log(counterToggle);
        if (counterToggle % 2 == 0) {
            // Добавяме рамка в night mode
            var iframeVar = document.getElementById("moodle-iframe").contentWindow;
            var moodleRoot = iframeVar.document.getElementById("root");

            moodleRoot.style.border = "2px solid #FDD835";
            moodleRoot.style.borderRadius = "0.5rem";

            var currAddress = iframeVar.location.href;
            var targetAddress = currAddress.substring(0, currAddress.lastIndexOf('/'));

            // Нуждаем се от код, който да прави видимо съдържанието на moodle-main
            if (iframeVar.location.href === targetAddress + "/moodle-main.html") {
                moodleRoot.style.color = "#FDD835";
                moodleRoot.style.backgroundColor = "#09071E";
            }
        } else {
            // При последващ toggle, махаме рамката
            var iframeVar = document.getElementById("moodle-iframe").contentWindow;
            var moodleRoot = iframeVar.document.getElementById("root");

            moodleRoot.style.border = "2px solid black";
            moodleRoot.style.color = "black";

            var currAddress = iframeVar.location.href;
            var targetAddress = currAddress.substring(0, currAddress.lastIndexOf('/'));

            if (iframeVar.location.href === targetAddress + "/moodle-main.html") {
                moodleRoot.style.border = "2px solid black";
                moodleRoot.style.backgroundColor = "white";
            }
        }
        counterToggle++;
    }


    var counterActionsObj = {counterActions : 0, flag: true};
    var actionBtn = document.getElementById("btn-actions");
    actionBtn.addEventListener("click", function() {
        incrementActions(counterActionsObj)
    });


    parseWeeks();

})();