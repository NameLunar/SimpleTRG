/*
    Скрипт помощник.
    Безопасно обновляет и возрощает значения. 
    Так же собирает атрибуты в персонажах.  
        Для использования в баре отдельных персонажей
*/
export class SimpleTokenDocument extends TokenDocument {
    // barName - название бара
    // {alternative} - определённый атрибут
    getBarAttribute(barName, {alternative}={}) {
        // Возрощает значение бара ("hp.min, hp.max, hp.value system.armor"... и тд). Так же вернёт определённый
        const data = super.getBarAttribute(barName, {alternative});
        // Определяет путь к атрибуту "attr" или получает путь определённого
        const attr = alternative || this[barName]?.attribute;
        if ( !data || !attr || !this.actor ) return data;
        // Получение атрибута без прямого доступа (Просто обработчик ошибок)
        const current = foundry.utils.getProperty(this.actor.system, attr);
        // Измененяет min на тот, что ввели или ставит 0 (если не получилось преобразовать)
        if ( current?.dtype === "Resource" ) data.min = parseInt(current.min || 0);
        // Разрешает редактировать
        data.editable = true;
        // Возрощает обновленный объект
        return data;
    }
    // data - объект данных персонажа
    // _path - массив путей ["hp", "armor" ...]
    static getTrackedAttributes(data, _path=[]) {
        // Обход рекурсии (если объект есть в объекте как hp.value) или ошибки "getTrackedAttributes({ attributes: { hp: 10 } }, ["attributes"])"
        if ( data || _path.length ) return super.getTrackedAttributes(data, _path);
        // Ещё один обход ошибок
        data = {};
        // Обходит все значения в template.json "Actor"
        for ( const model of Object.values(game.system.model.Actor) ) {
            // Записывает все значения
            foundry.utils.mergeObject(data, model);
        }
        // Обход всех персонажей 
        for ( const actor of game.actors ) {
            // Проверяет, шаблонный ли актер. 
            // Преобразует актёра в JS-объект и добавляет ему кастомные значения 
            if ( actor.isTemplate ) foundry.utils.mergeObject(data, actor.toObject());
        }
        // Возрощает атрибуты как из template.json, как и кастомные из персонажа
        return super.getTrackedAttributes(data);
    }
}
export class SimpleToken extends Token {
    // Рисует полоску, если включена
    _drawBar(number, bar, data) {
        if ( "min" in data ) {
            // Копирует дату (Обработчик ошибки)
            data = {...data};
            data.value -= data.min;
            data.max -= data.min;
        }
        return super._drawBar(number, bar, data);
    }
}