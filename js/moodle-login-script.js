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

    userName.value = "";
    password.value = "";
}