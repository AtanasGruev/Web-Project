(function(){

    var registerButton = document.getElementById("mregister-button");
    registerButton.addEventListener("click", registerUser);
    
    // ТУК ВЕЧЕ ТРЯБВА ДА СЕ ДОБАВИ ИНФОРМАЦИЯТА ЗА ПОТРЕБИТЕЛЯ В БАЗАТА ДАННИ
    // Вариант - export json file, с php да се бръкне и да се напише в db.
    // Ще обсъдим.
})();

function registerUser(event) {
    // Да забраним презареждането, освен ако нямаме success.
    // Тогава ще ни пренасочи към входната форма.
    event.preventDefault();

    // [TODO] Трябва да се добави проверка в базата данни дали такъв потребител вече не е 
    // регистриран (в moodle, все пак). Може би тази проверка да се прави на php или да се 
    // export-не в json до файл, който да обработим с JS.
        
    // РЕГИСТРАЦИЯ - Валидираме username, email, password, password(again)
    const userName = document.querySelector("[name=mregister-username]");
    const emailAddress = document.querySelector("[name=mregister-email]");
    const password = document.querySelector("[name=mregister-password]");
    const passwordAgain = document.querySelector("[name=mregister-password-again");

    // Ако възникнат проблеми с валидацията, <div> с id = mregister-errors
    var errorDiv = document.getElementById("mregister-errors");
    errorDiv.innerHTML = "";
    
    // Валидация на username -- ПОДЛЕЖИ НА ПРОМЯНА
    if (userName.value.length < 3) errorDiv.innerHTML += "Невалидно потребителско име (въведете поне 3 символа)<br/>";
    else if(userName.value.length > 30) errorDiv.innerHTML += "Невалидно потребителско име (надхвърлен лимит от 30 символа)<br/>";

    // Валидация на email -- ПОДЛЕЖИ НА ПРОМЯНА
    // Забележка - регулярния израз няма да работи при използването 
    // на single quotes (' ') и double quotes (" ").
    const emaillRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]{1,64}@[a-zA-Z0-9\.]+[a-zA-Z0-9-\.]*$/g;
    if(!emaillRegex.test(emailAddress.value)) {
        errorDiv.innerHTML += "Невалиден e-mail адрес.<br/>";
    }

    // Валидация на password - ПОДЛЕЖИ НА ПРОМЯНА
    // Засега - съдържа поне 8 символа, поне 1 главна буква и поне 1 цифра.
    let containsUpper = /[A-Z]/.test(password.value);
    let containsDigit = /[0-9]/.test(password.value);
    if(!containsUpper) errorDiv.innerHTML += "Невалидна парола (трябва да съдържа поне 1 главна буква)<br/>";
    else if(!containsDigit) errorDiv.innerHTML += "Невалидна парола (трябва да съдържа поне 1 цифра)<br/>";
    else if(password.value.length < 8) errorDiv.innerHTML += "Невалидна парола (въведете поне 8 символа)<br/>";

    // Валидация на password(again) 
    // На практика просто проверка дали двете пароли съвпадат.
    if(password.value !== passwordAgain.value) errorDiv.innerHTML += "Грешка при повторно въвеждане на паролата<br/>";

    if(errorDiv.innerHTML !== "") {
        userName.value = "";
        emailAddress.value = "";
        password.value = "";
        passwordAgain.value = "";
    }
    else{
        // Add user to db?
        // Export to json?
        window.location = "moodle-login.html"
    }
}