/*
    Запуск всей системы в порядке: 
        Этот файл
        Импорт файлов
        Foundry VTT
        Код после импорта
*/

import { ActorTRG } from "./actor.js";
import { ActorSheetTRG } from "./actor-sheet.js";

// Функция отслеживания конца инициализации Foundry VTT
Hooks.once("init", async function() {
    // CONFIG переменная в Foundry VTT
    CONFIG.Combat.initiative = {
        /*Изменить (30.08.2025)*/
        formula: "1d20",
        decimals: 2
    };
    CONFIG.Actor.documentClass = ActorTRG; // Меняет программный функционал стандартного листа на самопис

    Actors.unregisterSheet("core", ActorSheet); // Отключает возможность выбрать стандартный лист 
    Actors.registerSheet("simpletrg", ActorSheetTRG, { makeDefault: true }); // Ставит стандартным листом самопис макет
})