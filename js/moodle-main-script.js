
/*
(function(){
    // Засега - елементарна функционалност
    // При смяна на day / night mode понякога се получава бонус към някоя статистика
    // Това е отразено в анимирането на статистиките (по-точно -- bar-овете)

    var weekNotificationDOM = document.getElementsByClassName("week-notification")[0];
    let weekNum = Math.floor(Math.random() * 15);
    console.log(weekNum);
    var listWeekNotifications = ["Доживяхте до седмица ", "Настъпи седмица ", "Какво ли ще ни донесе седмица "];
    
    let weekRandom = Math.floor(Math.random() * 3);
    console.log(weekRandom);
    weekNotificationDOM.innerHTML += listWeekNotifications[weekRandom] + weekNum;
    if (weekRandom < 2) {
        weekNotificationDOM.innerHTML += ".";
    } else {
        weekNotificationDOM.innerHTML += "?";
    }

})();
*/
