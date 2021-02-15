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
    moodle.style.visibility = "visible";
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
    if (counterActionsObj["counterActions"] % 10 == 0) {
        saveProgress();
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
    fetch("../scenarios/" + scenario + "/week-0.json")
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

    hiddenSignalButton = document.createElement("button");
    hiddenSignalButton.style.visibility = "hidden";
    hiddenSignalButton.id = "hidden-signal-button-two";
    modalTitle.appendChild(hiddenSignalButton);

    hiddenSignalButton.addEventListener('click', () => {
        activateWeek0Events([], 1);
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

        counterActionsObj.counterActions = window.actions;

        forceAction(counterActionsObj.counterActions/10);

        if (result.length == 0) {
            updateMoodleText();
        }
        return null;
    }

    forceAction(0);

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
//window.addEventListener("unload", saveProgress);

function saveProgress() {

    var iframe = document.getElementById("moodle-iframe");

    var healthBarValue = iframe.contentWindow.document.getElementsByClassName("health-bar-real")[0];
    var funBarValue = iframe.contentWindow.document.getElementsByClassName("sleep-bar-real")[0];
    var fmiBarValue = iframe.contentWindow.document.getElementsByClassName("fmi-bar-real")[0];

    var currHealth = iframe.contentWindow.getComputedStyle(healthBarValue).getPropertyValue('width');
    currHealth = currHealth.substring(0, currHealth.length - 2);

    var currFun = iframe.contentWindow.getComputedStyle(funBarValue).getPropertyValue('width');
    currFun = currFun.substring(0, currFun.length - 2);

    var currFmi = iframe.contentWindow.getComputedStyle(fmiBarValue).getPropertyValue('width');
    currFmi = currFmi.substring(0, currFmi.length - 2);

    updateStats(currHealth, currFun, currFmi, counterActionsObj.counterActions);

}

function updateStats(currHealth, currFun, currFmi, actions) {

    var url = "../backend/save-stats.php";

    progress = "health=" + currHealth
        + "&fun=" + currFun
        + "&fmi=" + currFmi
        + "&actions=" + actions
        + "&id=" + window.id;

    ajax(url, { method: "POST", data: progress });
}

function ajax(url, settings) {

    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
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

    if (weekNum > 1) {
        const interface = document.getElementById("locations-activities");
        while (interface.firstChild) {
            interface.removeChild(interface.lastChild);
        }
    }

    if (weekNum > weeksCount) {
        endGame("over");
    } else {
        notificationsSeenObj["notificationsSeen"] = [];
        fetch("../scenarios/" + scenario + "/week-" + weekNum + "-activities.json")
            .then(data => data.json())
            .then(result => activitiesWeek(result, weekNum))
    }
}

function activitiesWeek(result, weekNum) {
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
        locButton.addEventListener('click', function (event) {
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

            // Допълваме с иконка за часовник
            var clockIconDay = document.createElement("img");
            var clockIconNight = document.createElement("img");

            clockIconDay.setAttribute("src", "../misc/sandclock-day.jpg");
            clockIconNight.setAttribute("src", "../misc/sandclock-night.png")
            clockIconDay.setAttribute("class", "activities-clock");
            clockIconNight.setAttribute("class", "activities-clock");

            if (counterToggle % 2 == 0) {
                if (actDiv.childNodes.length == 2) {
                    actDiv.removeChild(actDiv.childNodes[1]);
                }
                actDiv.appendChild(clockIconDay);
            }
            else {
                if (actDiv.childNodes.length == 2) {
                    actDiv.removeChild(actDiv.childNodes[1]);
                }
                actDiv.appendChild(clockIconNight);
            }

            activitiesPlacementDiv.appendChild(actDiv);

            actButton.addEventListener('click', function (event) {
                var action = result[location][i];
                actionButtonClicked(event, action);
            })
        }
    }

    // Прочитаме notifications за седмицата и ги връзваме с бутоните, narrations и bars
    fetch("../scenarios/" + scenario + "/week-" + weekNum + "-notifications.json")
        .then(data => data.json())
        .then(result => notificationsWeek(result))
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
transitionFlagObj = { transition: false, notification: false };
clockIndexObj = { clockIndex: 0 };
dayNightFlagObj = { night: false };


function endGame(reason) {

    updateStats(170, 194.4, 20, 0);

    transitionFlagObj.notification = true;
    openModal(modal);
    modalTitle.innerHTML = 'Край!';
    var message;
    switch (reason) {
        case "health": message = "Нездравословният ти начин на живот си каза думата - разви тумор на мозъка!"; break;
        case "fun": message = "Не може да се живее без забавление от време на време... Толкова си нещастен, че се самоубиваш!"; break;
        case "fmi": message = "Изпусна прекалено много материал... Няма никакъв шанс да успееш да наваксаш през сесията, тоя семестър е провал!"; break;
        case "over": message = "Засега толкова! Благодаря, че играхте в нашия ФМИ семестриален симулатор, надяваме се да ви е харесал! Ако искате да продължим разработването на играта и да добавим още сценарии (седмици, семестри). моля помислете да ни подкрепите финансово на нашият IBAN: BG18RZBB91550123456789."; break;
        case "fire": message = "Опитваш се да се измъкнеш, но пламъците са навсякъде... умираш в агония."; break;
        case "neck": message = "В бързината си се подхлъзваш на стълбите и политаш надолу. Падаш на главата си и си чупиш врата."; break;
    }

    modalBody.innerHTML = message;
    modalFooter.innerHTML = "";

    var optButton = document.createElement("button");
    optButton.innerHTML = "Започни отначало";
    modalFooter.appendChild(optButton);

    optButton.addEventListener('click', () => {

        //да ресетва, да трие от базата, да показва ли ранкиране?
        //засега просто затваря страницата

        window.open(window.location, '_self').top.close();
    });

}

function updateMoodleText() {
    if (counterActionsObj["counterActions"] % 10 == 0) {
        var moodleWeek = document.getElementById("moodle-iframe").contentWindow.document.getElementsByClassName("week-notification")[0];
        var listWeekNotifications = ["Доживя до седмица ", "Настъпи седмица ", "Ето я и новата седмица", "Все някак добута до седмица",
            "Семестърът няма край! Седмица", "Ох, само да мине и седмица", "Хайде нека малко поолекне със седмица"];

        var indexWeekMessage = Math.floor(Math.random() * listWeekNotifications.length);
        moodleWeek.innerHTML = listWeekNotifications[indexWeekMessage] + " " + (counterActionsObj["counterActions"] / 10 + 1) + "!";

        if (transitionFlagObj["transition"]) {
            setTimeout(function () {
                parseWeek((counterActionsObj["counterActions"] / 10 + 1));
            }, 6500)
        } else {
            parseWeek((counterActionsObj["counterActions"] / 10 + 1));
        }
    }
}

function actionButtonClicked(event, action) {
    if (!transitionFlagObj["transition"]) {

        // Флагът за извършвано действие се вдига
        transitionFlagObj["transition"] = true;

        // Връзка с брояч на действия през седмицата
        incrementActions(counterActionsObj);
        counterActionsObj["counterActions"]++;

        updateMoodleText();

        // Връзваме натискането на бутоните за действия с bars от moodle полето
        // Това е на ниво БУТОНИ ЗА ДЕЙСТВИЯ!
        // Връзка с характеристиките от moodle полето
        var funStats = action["statsChange"]["fun"];
        var healthStats = action["statsChange"]["health"];
        var fmiStats = action["statsChange"]["uni"];

        // За здравето
        var healthBar = document.getElementById("moodle-iframe").contentWindow.document.getElementsByClassName("health-bar")[0];
        var healthBarReal = document.getElementById("moodle-iframe").contentWindow.document.getElementsByClassName("health-bar-real")[0];

        // За социалния живот
        var funBarReal = document.getElementById("moodle-iframe").contentWindow.document.getElementsByClassName("sleep-bar-real")[0];

        // За университета
        var fmiBarReal = document.getElementById("moodle-iframe").contentWindow.document.getElementsByClassName("fmi-bar-real")[0];

        // Можем да осъществим самата промяна
        // 100 процента считаме дължината на healthBar (примерно)
        var maxWidth = healthBar.offsetWidth;
        var widthPercent = maxWidth / 100;

        // Трябва да поставим условия:
        // Да не надминава 100%;
        // Да не пада под 0%;

        var newHealth = healthBarReal.offsetWidth + healthStats * widthPercent;
        if (Math.round(newHealth) > maxWidth - 8) newHealth = maxWidth - 8;
        else if (Math.round(newHealth) <= 0) {
            newHealth = 0;
            endGame("health");
        } // Имплементираме логика -- ГУБИТЕ ИГРАТА!    
        healthBarReal.style.width = Math.round(newHealth) + "px";

        var newFun = funBarReal.offsetWidth + funStats * widthPercent;
        if (Math.round(newFun) > maxWidth - 8) newFun = maxWidth - 8;
        else if (Math.round(newFun) <= 0) {
            newFun = 0;
            endGame("fun");
        }// Имплементираме логика -- ГУБИТЕ ИГРАТА! 
        funBarReal.style.width = Math.round(newFun) + "px";

        var newFmi = fmiBarReal.offsetWidth + fmiStats * widthPercent;
        if (Math.round(newFmi) > maxWidth - 8) newFmi = maxWidth - 8;
        else if (Math.round(newFmi) <= 0) {
            newFmi = 0;
            endGame("fmi");
        } // Имплементираме логика -- ГУБИТЕ ИГРАТА! 
        fmiBarReal.style.width = Math.round(newFmi) + "px";

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

        setTimeout(function () {
            activityClock.style.visibility = "hidden";
            transitionFlagObj["transition"] = false;
            transitionFlagObj["notification"] = false;

            var allButtons = document.getElementsByClassName("week-activities-button");
            allButtons = [...allButtons];
            if (!dayNightFlagObj["night"]) {
                for (let b in allButtons) {
                    allButtons[b].style.cursor = "pointer";
                    allButtons[b].style.borderColor = "black";
                    allButtons[b].style.color = "black";
                }
            } else {
                for (let b in allButtons) {
                    allButtons[b].style.cursor = "pointer";
                    allButtons[b].style.borderColor = "#FDD835";
                    allButtons[b].style.color = "#FDD835";
                }
            }
        }, 6000);
    }
}

notificationsSeenObj = { notificationsSeen: [] };

function notificationsWeek(result) {
    // За всеки бутон добавяме по още един eventListener()
    // За всеки бутон ще взмемем възможните notifications, които да се
    // случат при такова събитие, и ще ги вържем с другите неща
    for (let location in result) {
        for (let activity in result[location]) {
            activityReduced = activity.replace(/\s+/g, '');
            var actButton = document.getElementById(activityReduced);

            actButton.addEventListener("click", function () {
                if (!transitionFlagObj["notification"]) {

                    // вероятност за получаване на съобщение
                    var flagNotification = false;
                    if (Math.random() > 0.25) flagNotification = true;

                    // timeout интервал
                    // Може да се поработи върху хубави стойности
                    var timeoutNotification = Math.random() * 0.15 + 0.25;

                    // Понякога ще се появяват известия с избори, понякога - не
                    if (flagNotification) {

                        var randomNotification = Math.floor(Math.random() * result[location][activity].length);

                        // Не допускаме събитията от лекции да се повтарят
                        if (activity == "Посещаване на лекция") {

                            if (notificationsSeenObj["notificationsSeen"].length != result[location][activity].length) {
                                while (notificationsSeenObj["notificationsSeen"].includes(result[location][activity][randomNotification]["eventNumber"])) {
                                    // кое съобщение ще излезе
                                    var randomNotification = Math.floor(Math.random() * result[location][activity].length);
                                }
                            } else {
                                notificationsSeenObj["notificationsSeen"] = []
                            }

                            notificationsSeenObj["notificationsSeen"].push(result[location][activity][randomNotification]["eventNumber"])
                        }

                        // Изчакване преди появата на notification
                        setTimeout(function () {
                            var action = result[location][activity][randomNotification];

                            openModal(modal);
                            modalTitle.innerHTML = action["eventHeader"];
                            modalBody.innerHTML = action["event"];
                            modalFooter.innerHTML = "";

                            var narrationField = document.getElementById("narration");

                            for (let i in action["options"]) {
                                var optButton = document.createElement("button");
                                optButton.innerHTML = action["options"][i]["text"];

                                optButton.addEventListener("click", function () {

                                    if(action.hasOwnProperty("flag")) {
                                         endGame(action.flag);
                                    } else {

                                        // Да изведем response на #narration
                                        var messageDiv = document.createElement("div");
                                        messageDiv.setAttribute("class", "narration-response");
                                        messageDiv.innerHTML = action["options"][i]["response"];
                                        narrationField.prepend(messageDiv);
                                        closeModal(modal);

                                        // Връзка с характеристиките от moodle полето
                                        // Това е на ниво ИЗВЕСТИЯ!
                                        var funStats = result[location][activity][randomNotification]["options"][i]["statsChange"]["fun"];
                                        var healthStats = result[location][activity][randomNotification]["options"][i]["statsChange"]["health"];
                                        var fmiStats = result[location][activity][randomNotification]["options"][i]["statsChange"]["uni"];

                                        // За здравето
                                        var healthBar = document.getElementById("moodle-iframe").contentWindow.document.getElementsByClassName("health-bar")[0];
                                        var healthBarReal = document.getElementById("moodle-iframe").contentWindow.document.getElementsByClassName("health-bar-real")[0];

                                        // За социалния живот
                                        var funBarReal = document.getElementById("moodle-iframe").contentWindow.document.getElementsByClassName("sleep-bar-real")[0];

                                        // За университета
                                        var fmiBarReal = document.getElementById("moodle-iframe").contentWindow.document.getElementsByClassName("fmi-bar-real")[0];

                                        // Можем да осъществим самата промяна
                                        // 100 процента считаме дължината на healthBar (примерно)
                                        var maxWidth = healthBar.offsetWidth;
                                        var widthPercent = maxWidth / 100;

                                        var newHealth = healthBarReal.offsetWidth + healthStats * widthPercent;
                                        if (Math.round(newHealth) > maxWidth - 8) newHealth = maxWidth - 8;
                                        else if (Math.round(newHealth) <= 0) {
                                            newHealth = 0;
                                            endGame("health");
                                        }// Имплементираме логика -- ГУБИТЕ ИГРАТА!    
                                        healthBarReal.style.width = Math.round(newHealth) + "px";

                                        var newFun = funBarReal.offsetWidth + funStats * widthPercent;
                                        if (Math.round(newFun) > maxWidth - 8) newFun = maxWidth - 8;
                                        else if (Math.round(newFun) <= 0) {
                                            newFun = 0;
                                            endGame("fun");
                                        }// Имплементираме логика -- ГУБИТЕ ИГРАТА! 
                                        funBarReal.style.width = Math.round(newFun) + "px";

                                        var newFmi = fmiBarReal.offsetWidth + fmiStats * widthPercent;
                                        if (Math.round(newFmi) > maxWidth - 8) newFmi = maxWidth - 8;
                                        else if (Math.round(newFmi) <= 0) {
                                            newFmi = 0;
                                            endGame("fmi");
                                        } // Имплементираме логика -- ГУБИТЕ ИГРАТА! 
                                        fmiBarReal.style.width = Math.round(newFmi) + "px";
                                    }
                                })
                                modalFooter.appendChild(optButton);
                            }
                        }, timeoutNotification * 10000);
                    }

                    transitionFlagObj["notification"] = true;
                }
            })
        }
    }
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
        dayNightFlagObj["night"] = true;

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
        // var clockIcon = document.getElementsByClassName("activities-clock")[clockIndexObj["clockIndex"]];
        //clockIcon.setAttribute("src", "../misc/sandclock-night.png");

        // Сменяме направо за всички часовници и не се грижим да връщаме стилове
        var clockIcons = document.getElementsByClassName("activities-clock");
        clockIcons = [...clockIcons];
        for (let ci in clockIcons) {
            clockIcons[ci].setAttribute("src", "../misc/sandclock-night.png");
        }

    } else {
        /* NIGHT MODE OFF */
        dayNightFlagObj["night"] = false;

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

        // var clockIcon = document.getElementsByClassName("activities-clock")[clockIndexObj["clockIndex"]];
        // clockIcon.setAttribute("src", "../misc/sandclock-day.jpg")

        // Сменяме направо за всички часовници и не се грижим да връщаме стилове
        var clockIcons = document.getElementsByClassName("activities-clock");
        clockIcons = [...clockIcons];
        for (let ci in clockIcons) {
            clockIcons[ci].setAttribute("src", "../misc/sandclock-day.jpg");
        }
    }

    counterToggle++;
}


function loadForcedActions() {
    fetch("../scenarios/" + scenario + "/forced-notifications.json")
        .then(data => data.json())
        .then(result => { 
            forcedActions = result.forcedActions; 
            forcedNotificationAction = result.forcedNotificationAction;
        })
}

function forceAction(week) {

    if (counterActionsObj.counterActions == forcedNotificationAction[week] && !transitionFlagObj.transition) {
        openModal(modal);
        modalTitle.innerHTML = forcedActions[week].eventHeader;
        modalBody.innerHTML = forcedActions[week].event;
        modalFooter.innerHTML = "";

        var narrationField = document.getElementById("narration");

        for (let i in forcedActions[week]["options"]) {
            var optButton = document.createElement("button");
            optButton.innerHTML = forcedActions[week]["options"][i]["text"];

            optButton.addEventListener("click", function () {

                // Да изведем response на #narration
                var messageDiv = document.createElement("div");
                messageDiv.setAttribute("class", "narration-response");
                messageDiv.innerHTML =forcedActions[week]["options"][i]["response"];
                narrationField.prepend(messageDiv);
                closeModal(modal);

                // Това е на ниво ИЗВЕСТИЯ!
                var funStats = forcedActions[week]["options"][i]["statsChange"]["fun"];
                var healthStats = forcedActions[week]["options"][i]["statsChange"]["health"];
                var fmiStats = forcedActions[week]["options"][i]["statsChange"]["uni"];

                // За здравето
                var healthBar = document.getElementById("moodle-iframe").contentWindow.document.getElementsByClassName("health-bar")[0];
                var healthBarReal = document.getElementById("moodle-iframe").contentWindow.document.getElementsByClassName("health-bar-real")[0];

                // За социалния живот
                var funBarReal = document.getElementById("moodle-iframe").contentWindow.document.getElementsByClassName("sleep-bar-real")[0];

                // За университета
                var fmiBarReal = document.getElementById("moodle-iframe").contentWindow.document.getElementsByClassName("fmi-bar-real")[0];

                // Можем да осъществим самата промяна
                // 100 процента считаме дължината на healthBar (примерно)
                var maxWidth = healthBar.offsetWidth;
                var widthPercent = maxWidth / 100;

                var newHealth = healthBarReal.offsetWidth + healthStats * widthPercent;
                if (Math.round(newHealth) > maxWidth - 8) newHealth = maxWidth - 8;
                else if (Math.round(newHealth) <= 0) {
                    newHealth = 0;
                    endGame("health");
                }// Имплементираме логика -- ГУБИТЕ ИГРАТА!    
                healthBarReal.style.width = Math.round(newHealth) + "px";

                var newFun = funBarReal.offsetWidth + funStats * widthPercent;
                if (Math.round(newFun) > maxWidth - 8) newFun = maxWidth - 8;
                else if (Math.round(newFun) <= 0) {
                    newFun = 0;
                    endGame("fun");
                }// Имплементираме логика -- ГУБИТЕ ИГРАТА! 
                funBarReal.style.width = Math.round(newFun) + "px";

                var newFmi = fmiBarReal.offsetWidth + fmiStats * widthPercent;
                if (Math.round(newFmi) > maxWidth - 8) newFmi = maxWidth - 8;
                else if (Math.round(newFmi) <= 0) {
                    newFmi = 0;
                    endGame("fmi");
                } // Имплементираме логика -- ГУБИТЕ ИГРАТА! 
                fmiBarReal.style.width = Math.round(newFmi) + "px";
            })
            modalFooter.appendChild(optButton);
        }
        forceAction(week + 1);
    } else {
        setTimeout(() => { forceAction(week) }, 500);
    }
}

var forcedNotificationAction;
var forcedActions;
var scenario;
var weeksCount;

function loadConfig() {
    fetch("../scenarios/config.json")
        .then(data => data.json())
        .then(result => { 
            scenario = result.scenario;
            weeksCount = result.weeksCount;
            forcedNotificationAction = result.forcedNotificationAction;

            loadForcedActions();
            parseBeginning(0);
            parseWeek(1);
        })
}
///------------------XXXXXXXXXXXXXXXXXX---------------------///

// Main() функционалност
(function () {

    loadConfig();
    
})();

