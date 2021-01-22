(function(){
    var loginButton = document.getElementById("mlogin-button");
    loginButton.addEventListener("click", loginUser);
})();

function loginUser(event) {
    // Забраняваме презареждането, освен ако нямаме success.
    // Тогава отиваме в default view за нашия moodle.
    event.preventDefault();
        
    // вход - Валидираме username и password
    const userName = document.querySelector("[name=mlogin-username]");
    const password = document.querySelector("[name=mlogin-password]");

    // Ако възникнат проблеми с валидацията, <div> с id = mlogin-errors
    var errorDiv = document.getElementById("mlogin-errors");
    errorDiv.style.display = "block";
    errorDiv.innerHTML = "";

    // [TODO]
    // Валидацията -- трябва ни достъп до базата данни.
    // Сигурно пак най-лесно с json файл и асинхранна заявка към него.
    // Лесно -- има ли такъв username, асоциран с такава парола.

    credentials = "username=" + userName.value + "&password=" + password.value;
    var url = "../backend/login-user.php";
    ajax(url, { success: callback, method: "POST", data: credentials });


    userName.value = "";
    password.value = "";
}

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

var callback = function (text) {

    if (text == "Вписахте се успешно!") {

        //moodle-main или както сме кръстили мудъл страницата
        window.location = "../html/moodle-main.html";

        //засега просто принтва съобщението
        // var errorDiv = document.getElementById("mlogin-errors");
        // errorDiv.innerHTML += text;

    } else {
        //ако името/паролата са невалидни, изтрива полетата и принтва съобщението
        var errorDiv = document.getElementById("mlogin-errors");
        const userName = document.querySelector("[name=mregister-username]");
        const password = document.querySelector("[name=mregister-password]");

        // ВЪЗНИКВА ГРЕШКА ПРИ ОПИТ ЗА ЛОГИН!
        // ДА СЕ КОМЕНТИРА С ЛЮБО?
        errorDiv.innerHTML += text;
        userName.value = "";
        password.value = "";

    }

};