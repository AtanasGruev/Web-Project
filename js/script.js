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

(function(){
    setInterval(printMessage, 500, message);
    // setTimeout(printMessage, 5000, message);
})();
