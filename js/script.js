const openModalButtons = document.querySelectorAll('[data-modal-target]')
const closeModalButtons = document.querySelectorAll('[data-close-button]')
const overlay = document.getElementById('overlay')
   
openModalButtons.forEach(button => {
    button.addEventListener('click', () => {
    const modal = document.querySelector(button.dataset.modalTarget)
    openModal(modal)
    })
})

overlay.addEventListener('click', () => {
    const modals = document.querySelectorAll('.modal.active')
    modals.forEach(modal => {
    closeModal(modal)
    })
})

closeModalButtons.forEach(button => {
    button.addEventListener('click', () => {
    const modal = button.closest('.modal')
    closeModal(modal)
    })
})

function openModal(modal) {
    if (modal == null) return
    modal.classList.add('active')
    overlay.classList.add('active')
}

function closeModal(modal) {
    if (modal == null) return
    modal.classList.remove('active')
    overlay.classList.remove('active')
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
    } else if(counterActionsObj["flag"]) {
        var currAction = document.getElementById("action-" + (counterActionsObj["counterActions"]) % 10);
        currAction.style.backgroundColor = "blue";
        currAction.style.boxShadow = "0 0 5px red";
        counterActionsObj["counterActions"]++;
        console.log(counterActionsObj["counterActions"]);

        if(counterActionsObj["counterActions"] % 10 == 0) {
            counterActionsObj["flag"] = false;
        }
    }
}

function parseWeeks() {
    fetch("../scenarios/week-0.json")
    .then(data => data.json())
    .then(result => console.log(result))
}

(function(){
    // Да се направи на отделна функция, а IIFE да служи за main()

    var toggleMode = document.getElementById("toggle-day-night");
    var counterToggle = 0;

    toggleMode.onclick = () => {
        document.querySelector("body").classList.toggle("active");
        console.log(counterToggle);
        if(counterToggle % 2 == 0) {
            // Добавяме рамка в night mode
            var iframeVar = document.getElementById("moodle-iframe").contentWindow;
            var moodleRoot = iframeVar.document.getElementById("root");
            
            moodleRoot.style.border = "2px solid #FDD835";
            moodleRoot.style.borderRadius = "0.5rem";

            var currAddress = iframeVar.location.href;
            var targetAddress = currAddress.substring(0, currAddress.lastIndexOf('/'));

            // Нуждаем се от код, който да прави видимо съдържанието на moodle-main
            if(iframeVar.location.href === targetAddress + "/moodle-main.html") {
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

            if(iframeVar.location.href === targetAddress + "/moodle-main.html") {
                moodleRoot.style.border = "2px solid black";
                moodleRoot.style.backgroundColor = "white";
            }
        }
        counterToggle++;
    }

    parseWeeks();

    //var message = "A semester begins at FMI!"
    //setInterval(printMessage, 500, message);
    // setTimeout(printMessage, 5000, message);
})();