function ajax(url, settings) {

    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.status == 200) {
            settings.success(xhr.responseText);
        } else {
            console.error(xhr.responseText);
        }
    };
    xhr.open(settings.method || 'GET', url, /* async */ true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send(settings.data || null);
}

function callback(text) {

    stats = JSON.parse(text);

    var healthBarValue = document.getElementsByClassName("health-bar-real")[0];
    var funBarValue = document.getElementsByClassName("sleep-bar-real")[0];
    var fmiBarValue = document.getElementsByClassName("fmi-bar-real")[0];

    healthBarValue.style.width = stats.health + "px";
    funBarValue.style.width = stats.fun + "px";
    fmiBarValue.style.width = stats.uni + "px";

}


(function(){

    var url = "../backend/get-stats.php";
    console.log("id is " + parent.window.id);

    ajax(url, { success: callback, method: "POST", data: "id=" + parent.window.id });
})();

