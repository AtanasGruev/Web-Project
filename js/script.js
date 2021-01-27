// Евентуално при refactoring трябва да докараме тук глобалните променливи...
var narrationQueue = [];

//const openModalButtons = document.querySelectorAll('[data-modal-target]')
const closeModalButtons = document.querySelectorAll('[data-close-button]');
const overlay = document.getElementById('overlay');


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

function parseWeeks(eventNumber) {
    fetch("../scenarios/week-0.json")
        .then(data => data.json())
        .then(result => callback(result, eventNumber))
}

// Това е все едно за обработката преди moodle формата
// Затова има само по един бутон

// За callback2 ще се минава с цикъл по options от json и ще се създават необходимите
// бутони. CSS-а ще ги прави да изглеждат ок, споко ;)))



//понеже се използват и в callback2, а и двете функции са рекурсивни, няма смисъл да се гетват всеки път

const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modal-title");
const modalBody = document.getElementsByClassName("modal-body")[0];
const modalFooter = document.getElementsByClassName("modal-footer")[0];
//limit е индекса на последния евент от първата част на week0
const limit = 1;

function callback(result, eventNumber) {
  
    modalTitle.innerHTML = result[eventNumber].eventHeader;
    modalBody.innerHTML = result[eventNumber].event;

    // трябва да се промени малко json-a
    // скифтвай синтаксиса, много тромаво става
    // дали да не махнем array като options и да сложим "обект", ддз

    var optButton = document.createElement("button");
    optButton.innerHTML = result[eventNumber].options[0].text;

    //изчистваме футъра от старите бутони
    modalFooter.innerHTML = "";
    modalFooter.appendChild(optButton);

    optButton.addEventListener('click', () => {

        if (eventNumber == limit) {
            callback2(result, eventNumber + 1);
        } else {
            closeModal(modal);
        }

    })

    //скрит бутон, който ще бъде кликван от логин скрипта при успешно логване, за да се покаже стат модала
    var hiddenSignalButton = document.createElement("button");
    hiddenSignalButton.style.visibility = "hidden";
    hiddenSignalButton.id = "hidden-signal-button";
    modalTitle.appendChild(hiddenSignalButton);

    hiddenSignalButton.addEventListener('click', () => {
        callback(result, eventNumber + 1);
    })


    setTimeout(() => { openModal(modal) }, 1000);
    
}


function callback2(result, eventNumber) {

    //функцията е рекурсивна, тук е дъното и
    openModal(modal);
    if (eventNumber >= result.length) {
        closeModal(modal);
        document.getElementById("toggle-mode").style.visibility = "visible";
        document.getElementsByClassName("actions")[0].style.visibility = "visible";
        document.getElementById("locations-actions").style.visibility = "visible";
        document.getElementById("narration").style.visibility = "visible";


        return null;
    }

    modalTitle.innerHTML = result[eventNumber].eventHeader;
    modalBody.innerHTML = result[eventNumber].event;

    //изчистваме футъра от старите бутони
    modalFooter.innerHTML = "";

    for (i in result[eventNumber].options) {


        let skipVal = result[eventNumber].options[i].skip;
        let response;
        if (result[eventNumber].options[i].hasOwnProperty('response')) {
            response = result[eventNumber].options[i].response;
        }

        let optButton = document.createElement("button");
        optButton.innerHTML = result[eventNumber].options[i].text;


        optButton.addEventListener('click', () => {

            //на бутоните които са реално опции евент хендлъра променя модала с респонса на съответната избрана опция
            if (result[eventNumber].options[i].hasOwnProperty('response')) {
                modalBody.innerHTML = response;
                modalFooter.innerHTML = "";
                var responseButton = document.createElement("button");
                responseButton.innerHTML = "Продължи";

                //респонс бутона вече извиква наново функцията със следващия евент
                responseButton.addEventListener('click', () => {
                    callback2(result, eventNumber + skipVal + 1);
                })

                modalFooter.appendChild(responseButton);

            } else {
                //това са финалните бутони които нямат опции, а само един бутон
                callback2(result, eventNumber + skipVal + 1);
            }

        })

        modalFooter.appendChild(optButton);
    }

}

//обекта е глобален за да може да се обработва oт saveProgress функцията
const counterActionsObj = { counterActions: 0, flag: true };

//saveProgress се извиква при затваряне/презареждане на страницата
window.addEventListener("unload", saveProgress);

function saveProgress() {

    console.log("actions:");
    console.log(counterActionsObj.counterActions);

    var iframe = document.getElementById("moodle-iframe");
    var statTotal = iframe.contentWindow.document.getElementsByClassName("health-bar")[0];

    var healthBarValue = iframe.contentWindow.document.getElementsByClassName("health-bar-real")[0];
    var sleepBarValue = iframe.contentWindow.document.getElementsByClassName("sleep-bar-real")[0];
    var fmiBarValue = iframe.contentWindow.document.getElementsByClassName("fmi-bar-real")[0];

    var maxStat = iframe.contentWindow.getComputedStyle(statTotal).getPropertyValue('width');
    maxStat = maxStat.substring(0, maxStat.length - 2);

    var padding = iframe.contentWindow.getComputedStyle(statTotal, null).getPropertyValue('padding-left');
    padding = padding.substring(0, padding.length - 2);

    maxStat -= padding * 2;

    var currHealth = iframe.contentWindow.getComputedStyle(healthBarValue).getPropertyValue('width');
    currHealth = currHealth.substring(0, currHealth.length - 2);

    var currSleep = iframe.contentWindow.getComputedStyle(sleepBarValue).getPropertyValue('width');
    currSleep = currSleep.substring(0, currSleep.length - 2);

    var currFmi = iframe.contentWindow.getComputedStyle(fmiBarValue).getPropertyValue('width');
    currFmi = currFmi.substring(0, currFmi.length - 2);

    console.log("health is:")
    console.log(currHealth / maxStat);

    console.log("sleep is:")
    console.log(currSleep / maxStat);

    console.log("fmi is:")
    console.log(currFmi / maxStat);


    //заявка към php скрипт който ще запазва прогреса
    //ще трябва да се добави към логин скрипта взимане на този прогрес от базата данни и инициализиране на статовете
    var url = "../backend/save-progress.php";
    let progress = {
        health: currHealth / maxStat,
        sleep: currSleep / maxStat,
        fmi: currFmi / maxStat,
        actions: counterActionsObj.counterActions
    }
    //ajax(url, { method: "POST", data: progress });

}

function ajax(url, settings) {

    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (!xhr.status == 200) {
            console.error(xhr.responseText);
        }
    };

    xhr.open(settings.method || 'GET', url, /* async */ true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send(settings.data || null);
}


function parseWeek1(result) {
    fetch("../scenarios/week-1-activities.json")
        .then(data => data.json())
        .then(result => activitiesWeek1(result))
        //.then(result => notificationsWeek1(result))
}

function activitiesWeek1(result) {

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


    /* var actionBtn = document.getElementById("btn-actions");
    actionBtn.addEventListener("click", function() {
        incrementActions(counterActionsObj)
    }); */


    parseWeeks(0);
    parseWeek1();

    printMessage("A semester begins at FMI!");
})();