///---------------------------------------------------------///
///-----------------MODAL променливи и методи---------------------///
//const closeModalButtons = document.querySelectorAll('[data-close-button]');
const overlay = document.getElementById('overlay');

overlay.addEventListener('click', () => {
    const modals = document.querySelectorAll('.modal.active')
    modals.forEach(modal => {
        closeModal(modal);
    })
})

/*
closeModalButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modal = button.closest('.modal');
        closeModal(modal);
    })
})
*/

// Open Modal -- привежда модал в активност
function openModal(modal) {
    if (modal == null) return;
    modal.classList.add('active');
    overlay.classList.add('active');
}

// Close Modal -- затваря модал
function closeModal(modal) {
    if (modal == null) return;
    modal.classList.remove('active');
    overlay.classList.remove('active');

    //засега тук, може и да е ненужно
    var moodle = document.getElementById('moodle-container')
    moodle.style.visibility="visible";
}
///------------------XXXXXXXXXXXXXXXXXX---------------------///

///---------------------------------------------------------///
///----------------ЗАПЪЛВАНЕ НА NARRATION-------------------///
var narrationQueue = []; // държим си съобщенията от #narration

// Добавяне на уведомление в полето #narration
function printMessage(message) {
    var narrationField = document.getElementById("narration");
    
    var messageDiv = document.createElement("div");
    messageDiv.innerHTML = message;

    narrationQueue.push(message);
    narrationField.appendChild(messageDiv);
    if (narrationQueue.length == 25) {
        narrationField.lastElementChild().remove();
    }
}
///------------------XXXXXXXXXXXXXXXXXX---------------------///

///---------------------------------------------------------///
///--------------------СЕДМИЧНИ ДЕЙСТВИЯ--------------------///

//Oбектът е глобален, за да може да се обработва oт saveProgress функцията
const counterActionsObj = { counterActions: 0 };

// Инкрементират се действията, за да се проследи седмичният прогрес
function incrementActions(counterActionsObj) {
    // Ако counterActions % 10 == 0, то сме приключили седмицата
    // Това следва да се отрази на moodle статистиката и да нулира
    // седмичния прогрес
    if(counterActionsObj["counterActions"] % 10 == 0) {
        var divsActions = document.getElementsByClassName("week-actions-div");    
        for (let i = 0; i < divsActions.length; i += 1) {
            divsActions[i].style.backgroundColor = "#39D078";
            divsActions[i].style.boxShadow = "none";
        }
        var currAction = document.getElementById("action-" + (counterActionsObj["counterActions"]) % 10);   
        currAction.style.backgroundColor = "#007CFF";
        currAction.style.boxShadow = "0 0 10px #39D078"; 
    } else {
        var currAction = document.getElementById("action-" + (counterActionsObj["counterActions"]) % 10);   
        currAction.style.backgroundColor = "#007CFF";
        currAction.style.boxShadow = "0 0 10px #39D078"; 
    }
}
///------------------XXXXXXXXXXXXXXXXXX---------------------///

///---------------------------------------------------------///
///------------------ОБРАБОТКА СЕДМИЦА 0--------------------///
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modal-title");
const modalBody = document.getElementsByClassName("modal-body")[0];
const modalFooter = document.getElementsByClassName("modal-footer")[0];
//limit е индексът на последното събитие от първата част на седмица 0
const limit = 1;

// Прочита сценария и работи с него
function parseBeginning(eventNumber) {
    fetch("../scenarios/week-0.json")
        .then(data => data.json())
        .then(result => loadWeek0Events(result, eventNumber))
}

// Подготовка на интерфейс в седмица 0
function loadWeek0Events(result, eventNumber) {
  
    // Четем събитията от json файла
    modalTitle.innerHTML = result[eventNumber].eventHeader;
    modalBody.innerHTML = result[eventNumber].event;

    // Добавят се към UI елементи
    var optButton = document.createElement("button");
    optButton.innerHTML = result[eventNumber].options[0].text;

    //Изчистваме footer от старите бутони
    modalFooter.innerHTML = "";
    modalFooter.appendChild(optButton);

    optButton.addEventListener('click', () => {
        if (eventNumber == limit) {
            activateWeek0Events(result, eventNumber + 1);
        } else {
            closeModal(modal);
        }

    })

    // Създава се скрит бутон
    // При успешно логване той се кликва, за да се покаже страницата със статистиките
    var hiddenSignalButton = document.createElement("button");
    hiddenSignalButton.style.visibility = "hidden";
    hiddenSignalButton.id = "hidden-signal-button";
    modalTitle.appendChild(hiddenSignalButton);

    hiddenSignalButton.addEventListener('click', () => {
        loadWeek0Events(result, eventNumber + 1);
    })


    setTimeout(() => { openModal(modal) }, 1000);
    
}

// 
function activateWeek0Events(result, eventNumber) {

    //функцията е рекурсивна, тук е дъното й
    openModal(modal);
    if (eventNumber >= result.length) {
        closeModal(modal);
        document.getElementById("toggle-mode").style.visibility = "visible";
        document.getElementsByClassName("actions")[0].style.visibility = "visible";
        document.getElementById("locations-activities").style.visibility = "visible";
        document.getElementById("narration").style.visibility = "visible";

        return null;
    }

    modalTitle.innerHTML = result[eventNumber].eventHeader;
    modalBody.innerHTML = result[eventNumber].event;

    // Изчистваме footer от старите бутони
    modalFooter.innerHTML = "";

    for (let i in result[eventNumber].options) {

        let skipVal = result[eventNumber].options[i].skip;
        let response;
        if (result[eventNumber].options[i].hasOwnProperty('response')) {
            response = result[eventNumber].options[i].response;
        }

        let optButton = document.createElement("button");
        optButton.innerHTML = result[eventNumber].options[i].text;

        optButton.addEventListener('click', () => {

            // На бутоните, които реално са опции, eventHandler() променя модала с 
            // response на съответната избрана опция
            if (result[eventNumber].options[i].hasOwnProperty('response')) {
                modalBody.innerHTML = response;
                modalFooter.innerHTML = "";
                var responseButton = document.createElement("button");
                responseButton.innerHTML = "Продължи";

                //response бутонът извиква функцията отново със следващия event
                responseButton.addEventListener('click', () => {
                    activateWeek0Events(result, eventNumber + skipVal + 1);
                    // activateWeek0Events(result, eventNumber + skipVal + 1);
                })

                modalFooter.appendChild(responseButton);

            } else {
                activateWeek0Events(result, eventNumber + skipVal + 1);
            }

        })
        modalFooter.appendChild(optButton);
    }
}
///------------------XXXXXXXXXXXXXXXXXX---------------------///


///---------------------------------------------------------///
///-----------------ЗАПАЗВАНЕ НА ПРОГРЕС--------------------///

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


    // Заявка към php скрипт, който ще запазва прогреса
    // Ще трябва да се добави към логин скрипта взимане на този прогрес от базата данни и инициализиране на статовете
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
///------------------XXXXXXXXXXXXXXXXXX---------------------///

///---------------------------------------------------------///
///-----------------РАБОТА СЪС СЕДМИЦИТЕ--------------------///

// Чете json файлове и вика подходящи функции
function parseWeek(weekNum) {
    fetch("../scenarios/week-"+ weekNum + "-activities.json")
        .then(data => data.json())
        .then(result => activitiesWeek1(result, weekNum))
    
}

function activitiesWeek1(result, weekNum) {
    for (let location in result) {
        // За взимане индекс на часовник при инвертиране на toggle
        
        // Подготовка на бутоните за локации
        var locationsDiv = document.getElementById("locations-activities");

        // Искаме да добавим цял <div>, който да поддържа локация и 
        // прилежащите й опции
        var newPlacementDiv = document.createElement("div");
        newPlacementDiv.setAttribute("class", "locations-activities-container");
        locationsDiv.appendChild(newPlacementDiv);

        locationsPlacementDiv = document.createElement("div");
        locationsPlacementDiv.setAttribute("class", "week-locations");
        activitiesPlacementDiv = document.createElement("div");
        activitiesPlacementDiv.setAttribute("class", "week-activities");
        newPlacementDiv.appendChild(locationsPlacementDiv);
        newPlacementDiv.appendChild(activitiesPlacementDiv);

        var locButton = document.createElement("button");
        locButton.setAttribute("class", "week-locations-button");
        locButton.setAttribute("id", location.replace(/\s+/g, ''));
        locButton.innerHTML = location;
        locationsPlacementDiv.appendChild(locButton); 

        // Ако се натисне локация, показват се възможни действия
        locButton.addEventListener('click', function(event) {
            locationButtonClicked(event, location);
        })

        // Добавят се бутоните за действия за съответната локация
        for (let i = 0; i < result[location].length; i++) {

            // Създаваме си <div>, в който ще има бутон за действие и 
            // изображение (default - не се вижда), което ще отчита време.
            var actDiv = document.createElement("div");
            actDiv.setAttribute("class", "week-activities-clock-div");

            // Бутон за действие
            var actButton = document.createElement("button");
            actButton.setAttribute("class", "week-activities-button");
            actButton.setAttribute("id", result[location][i]["event"].replace(/\s+/g, ''));
            actButton.setAttribute("name", location);
            actButton.style.display = "none";
            actButton.innerHTML = result[location][i]["event"];
            actDiv.appendChild(actButton);

            // Допълвваме с иконка за часовник
            var clockIconDay = document.createElement("img");
            var clockIconNight = document.createElement("img");

            clockIconDay.setAttribute("src", "../misc/sandclock-day.jpg");
            clockIconNight.setAttribute("src", "../misc/sandclock-night.png")
            clockIconDay.setAttribute("class", "activities-clock");
            clockIconNight.setAttribute("class", "activities-clock");

            if(counterToggle % 2 == 0) {
                if(actDiv.childNodes.length == 2) {
                    actDiv.removeChild(actDiv.childNodes[1]);
                }
                actDiv.appendChild(clockIconDay);
            }
            else {
                if(actDiv.childNodes.length == 2) {
                    actDiv.removeChild(actDiv.childNodes[1]);
                }
                actDiv.appendChild(clockIconNight);
            }

            activitiesPlacementDiv.appendChild(actDiv);

            actButton.addEventListener('click', function(event) {
                if(!transitionFlagObj["transition"]) {
                    var action = result[location][i];
                    actionButtonClicked(event, action);
                }
            })
        }
    }

    // Прочитаме notifications за седмицата и ги връзваме с бутоните, narrations и bars
    fetch("../scenarios/week-"+ weekNum + "-notifications.json")
        .then(data => data.json())
        .then(result => notificationsWeek1(result))
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
    var allButtons = document.getElementsByClassName("week-activities-button");
    allButtons = [...allButtons];
    for (let b in allButtons) {
        allButtons[b].style.display = "none";
    }

    var appropriateButtons = document.getElementsByName(location);
    appropriateButtons = [...appropriateButtons];
    for (let b in appropriateButtons) {
        appropriateButtons[b].style.display = "block";
    }
}

// Ако действие се извършва, с този флаг забраняваме достъп до бутоните
transitionFlagObj = {transition : false};
clockIndexObj = {clockIndex : 0};

function actionButtonClicked(event, action) {
    // Връзка с брояч на действия през седмицата
    incrementActions(counterActionsObj);
    counterActionsObj["counterActions"]++;

    if (counterActionsObj["counterActions"] % 10 == 0) {
        var moodleWeek = document.getElementById("moodle-iframe").contentWindow.document.getElementsByClassName("week-notification")[0];
        var listWeekNotifications = ["Доживя до седмица ", "Настъпи седмица ", "Ето я и новата седмица", "Все някак добута до седмица", 
                                     "Семестърът няма край! Седмица", "Ох, само да мине и седмица", "Хайде нека малко поолекно със седмица"];

        var indexWeekMessage = Math.floor(Math.random() * listWeekNotifications.length);
        moodleWeek.innerHTML = listWeekNotifications[indexWeekMessage] + " " + (counterActionsObj["counterActions"] / 10 + 1) + "!"; 
    }

    // Флагът за извършвано действие се вдига
    transitionFlagObj["transition"] = true;

    // Симулация на времетраене - правим часовника видим и го анимираме
    var activityClock = event.currentTarget.parentNode.getElementsByClassName("activities-clock")[0];
    activityClock.style.visibility = "visible"; // часовникът става видим

    // Да се намери индекс на часовник
    var allClocks = document.getElementsByClassName("activities-clock");
    allClocks = [...allClocks];
    clockIndexObj["clockIndex"] = allClocks.map(elem => elem.style.visibility).indexOf('visible');

    // Бутоните сменят стила си, т.е. са неактивни
    var allButtons = document.getElementsByClassName("week-activities-button");
    allButtons = [...allButtons];
    for (let b in allButtons) {
        allButtons[b].style.cursor = "default";
        allButtons[b].style.borderColor = "#B2B2B2";
        allButtons[b].style.color = "#B2B2B2";
    }

    setTimeout(function() {
        activityClock.style.visibility = "hidden";
        transitionFlagObj["transition"] = false;
    }, 10000);
}

function notificationsWeek1(result) {
    // За всеки бутон добавяме по още един eventListener()
    // За всеки бутон ще взмемем възможните notifications, които да се
    // случат при такова събитие, и ще ги вържем с другите неща
    for(let location in result) {
        for (let activity in result[location]) {
            activityReduced = activity.replace(/\s+/g, '');
            var actButton = document.getElementById(activityReduced);
            // console.log(result[location][activity])
            actButton.addEventListener("click", function() {
                 // кое съобщение ще излезе
                var randomNotification = Math.floor(Math.random() * result[location][activity].length);

                // вероятност за получаване на съобщение
                var flagNotification = false;
                if (Math.floor(Math.random()) > 0.5) flagNotification = true;

                // timeout интервал

                var action = result[location][activity][randomNotification];
                openModal(modal);
                modalTitle.innerHTML = action["eventHeader"];
                modalBody.innerHTML = action["event"];
                modalFooter.innerHTML = "";

                var narrationField = document.getElementById("narration");

                for (let i in action["options"]) {
                    var optButton = document.createElement("button");
                    optButton.innerHTML = action["options"][i]["text"];

                    optButton.addEventListener("click", function() {
                        // Да изведем response на #narration
                        var messageDiv = document.createElement("div");
                        messageDiv.setAttribute("class", "narration-response");
                        messageDiv.innerHTML = action["options"][i]["response"];
                        narrationField.prepend(messageDiv);
                        closeModal(modal);
                    })

                    modalFooter.appendChild(optButton);
                }
            })
        }
    }

    /*------------------------------------*/
     //функцията е рекурсивна, тук е дъното й
     /*
     modalTitle.innerHTML = result[eventNumber].eventHeader;
     modalBody.innerHTML = result[eventNumber].event;
 
     // Изчистваме footer от старите бутони
     modalFooter.innerHTML = "";
 
     for (let i in result[eventNumber].options) {
 
         let skipVal = result[eventNumber].options[i].skip;
         let response;
         if (result[eventNumber].options[i].hasOwnProperty('response')) {
             response = result[eventNumber].options[i].response;
         }
 
         let optButton = document.createElement("button");
         optButton.innerHTML = result[eventNumber].options[i].text;
 
         optButton.addEventListener('click', () => {
 
             // На бутоните, които реално са опции, eventHandler() променя модала с 
             // response на съответната избрана опция
             if (result[eventNumber].options[i].hasOwnProperty('response')) {
                 modalBody.innerHTML = response;
                 modalFooter.innerHTML = "";
                 var responseButton = document.createElement("button");
                 responseButton.innerHTML = "Продължи";
 
                 //response бутонът извиква функцията отново със следващия event
                 responseButton.addEventListener('click', () => {
                     activateWeek0Events(result, eventNumber + skipVal + 1);
                     // activateWeek0Events(result, eventNumber + skipVal + 1);
                 })
 
                 modalFooter.appendChild(responseButton);
 
             } else {
                 activateWeek0Events(result, eventNumber + skipVal + 1);
             }
 
         })
         modalFooter.appendChild(optButton);
     }
     /*------------------------------------*/
}


///------------------XXXXXXXXXXXXXXXXXX---------------------///

///---------------------------------------------------------///
///-----------------НОЩЕН РЕЖИМ НА ИГРАТА-------------------///
var toggleMode = document.getElementById("toggle-day-night");
var counterToggle = 0;

toggleMode.onclick = () => {

    document.querySelector("body").classList.toggle("active");
    if (counterToggle % 2 == 0) {
        /* NIGHT MODE ON */

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

        // Променяме цветовете на бутоните за локации и действия
        var nightLocationButtons = document.getElementsByClassName("week-locations-button");
        nightLocationButtons = [...nightLocationButtons];
        for (let b in nightLocationButtons) {
            nightLocationButtons[b].style.color = "#FDD835";
            nightLocationButtons[b].style.backgroundColor = "#09071E";
            nightLocationButtons[b].style.border = "2px solid #FDD835";
        }

        var nightActivitiesButtons = document.getElementsByClassName("week-activities-button");
        nightActivitiesButtons = [...nightActivitiesButtons];
        for (let b in nightActivitiesButtons) {
            nightActivitiesButtons[b].style.color = "#FDD835";
            nightActivitiesButtons[b].style.backgroundColor = "#09071E";
            nightActivitiesButtons[b].style.border = "2px solid #FDD835";
        }

        // Ако сме задействали нещо, трябва да сменим иконката за часовника
        var clockIcon = document.getElementsByClassName("activities-clock")[clockIndexObj["clockIndex"]];
        clockIcon.setAttribute("src", "../misc/sandclock-night.png");

    } else {
        /* NIGHT MODE OFF */

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

        // Връщаме цветовете на бутони и локации
        var nightLocationButtons = document.getElementsByClassName("week-locations-button");
        nightLocationButtons = [...nightLocationButtons];
        for (let b in nightLocationButtons) {
            nightLocationButtons[b].style.color = "black";
            nightLocationButtons[b].style.backgroundColor = "white";
            nightLocationButtons[b].style.border = "2px solid #F5F5F5";
        }

        var nightActivitiesButtons = document.getElementsByClassName("week-activities-button");
        nightActivitiesButtons = [...nightActivitiesButtons];
        for (let b in nightActivitiesButtons) {
            nightActivitiesButtons[b].style.color = "black";
            nightActivitiesButtons[b].style.backgroundColor = "white";
            nightActivitiesButtons[b].style.border = "2px solid black";
        }

        var clockIcon = document.getElementsByClassName("activities-clock")[clockIndexObj["clockIndex"]];
        clockIcon.setAttribute("src", "../misc/sandclock-day.jpg")
    }

    counterToggle++;
}

///------------------XXXXXXXXXXXXXXXXXX---------------------///

// Main() функционалност
(function () {

    parseBeginning(0);
    for(let i = 1; i < 2; i++) {
        parseWeek(i);
    }
})();