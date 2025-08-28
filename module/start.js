/*
    Запуск всей системы в порядке: 
        Этот файл
        Импорт файлов
        Foundry VTT
        Код после импорта
*/

// Функция отслеживания конца инициализации Foundry VTT
Hooks.once("init", async function() {
    // CONFIG переменная в Foundry VTT
    CONFIG.Combat.initiative = {
        formula: "1d20", // Изменить на пользовательскую позже
        decimals: 2
    };
})