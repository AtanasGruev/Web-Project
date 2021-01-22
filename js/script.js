var narrationField = document.getElementById("narration");
var messageQueue = [];
var message = "A semester begins at FMI!"

function printMessage(message) {
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

(function(){
    var toggleMode = document.getElementById("toggle-day-night");
    var counterToggle = 0;
    toggleMode.onclick = () => {
        document.querySelector("body").classList.toggle("active");
        console.log(counterToggle);
        if(counterToggle % 2 == 0) {
            // Добавяме рамка в night mode
            var iframeVar = document.getElementById("moodle-iframe").contentWindow;
            var moodleRoot = iframeVar.document.getElementById("root");
            moodleRoot.style.border = "4px solid #FDD835";
            moodleRoot.style.borderRadius = "2rem";

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
            moodleRoot.style.border = "none";
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

    var counterActionsObj = {counterActions : 0, flag: true};
    var actionBtn = document.getElementById("btn-actions");
    actionBtn.addEventListener("click", function() {
        incrementActions(counterActionsObj)
    });


    setInterval(printMessage, 500, message);
    // setTimeout(printMessage, 5000, message);
})();
