// Евентуално при refactoring трябва да докараме тук глобалните променливи...
var narrationQueue = [];

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
    
    var messageDiv = document.createElement("div");
    messageDiv.innerHTML = message;

    narrationQueue.push(message);
    narrationField.appendChild(messageDiv);
    if (narrationQueue.length == 15) {
        narrationField.lastElementChild().remove();
    }
}

function incrementActions(counterActionsObj) {
    if (counterActionsObj["counterActions"] % 10 == 0 && counterActionsObj["flag"] == false) {
        var divsActions = document.getElementsByClassName("week-actions-div");
        for (var i = 0; i < divsActions.length; i += 1) {
            divsActions[i].style.backgroundColor = "#39D078";
            divsActions[i].style.boxShadow = "none";
        }
        counterActionsObj["flag"] = true;
    } else if (counterActionsObj["flag"]) {
        var currAction = document.getElementById("action-" + (counterActionsObj["counterActions"]) % 10);
        currAction.style.backgroundColor = "#007CFF";
        currAction.style.boxShadow = "0 0 10px #39D078";
        counterActionsObj["counterActions"]++;

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
        return;
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

function parseWeek1(result) {
    fetch("../scenarios/week-1-activities.json")
        .then(data => data.json())
        .then(result => activitiesWeek1(result))
        //.then(result => notificationsWeek1(result))
}

function activitiesWeek1(result) {
    // Трябва да е във fetch(), иначе поначало е видима...
    document.getElementById("toggle-mode").style.visibility = "visible";
    document.getElementsByClassName("actions")[0].style.visibility = "visible";

    for (let location in result) {
        var locationsDiv = document.getElementById("week-locations");
        var locButton = document.createElement("button");
        locButton.setAttribute("class", "week-locations-button");
        locButton.innerHTML = location;
        locationsDiv.appendChild(locButton); 

        locButton.addEventListener('click', function(event) {
            locationButtonClicked(event, location);
        })

        var actionsDiv = document.getElementById("week-activities");
        for (let i = 0; i < result[location].length; i++) {
            var actButton = document.createElement("button");
            actButton.setAttribute("class", "week-activities-button");
            actButton.setAttribute("name", location);
            actButton.style.display = "none";
            actButton.innerHTML = result[location][i]["event"];
            actionsDiv.appendChild(actButton);

            actButton.addEventListener('click', function(event) {
                var action = result[location][i];
                actionButtonClicked(event, action); // предстои да се имплементира
            })
        }
    }
}

function locationButtonClicked(event, location) {
    var weekLocations = document.getElementsByClassName("week-locations-button");
    weekLocations = [...weekLocations];

    // Премахваме ефектите на всички други локации
    weekLocations.forEach(element => {
        element.style.textDecoration = "none";
    })

    // Ефект само на конкретната локация
    event.currentTarget.style.textDecoration = "underline";

    // Бутоните на другите локации не се виждат
    allButtons = document.getElementsByClassName("week-activities-button");
    allButtons = [...allButtons];
    for (let b in allButtons) {
        allButtons[b].style.display = "none";
    }

    appropriateButtons = document.getElementsByName(location);
    appropriateButtons = [...appropriateButtons];
    for (let b in appropriateButtons) {
        appropriateButtons[b].style.display = "block";
    }
}

function actionButtonClicked(event, action) {
    // Предстои да се имплементира
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
    // Вместо това - всеки бутон за действие ще вика тази функция incrementActions()

    /* var actionBtn = document.getElementById("btn-actions");
    actionBtn.addEventListener("click", function() {
        incrementActions(counterActionsObj)
    }); */


    parseWeeks();
    parseWeek1();

    printMessage("A semester begins at FMI!");
})();