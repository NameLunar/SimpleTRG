/*
    Скрипт помощник. 
    Автоматически генерирует скрипт в списке скриптов и добавляет его в панель быстрого доступа,
        при перетаскивание элемента из HTML листа.  
    data - объект с данными (например, { roll: "1d20 + @str", label: "Сила" });
    slot - слот, куда надо поместить макрос
*/
export async function createMacro(data, slot) {
    if ( !data.roll || !data.label ) return false; 
    const command = `const roll = new Roll("${data.roll}", actor ? actor.getRollData() : {}); roll.toMessage({speaker, flavor: "${data.label}"});`;
    let macro = game.macros.find(m => (m.name === data.label) && (m.command === command));
    if (!macro) {
        macro = await Macro.create({
            name: data.label,
            type: "script",
            command: command,
            flags: { "simpletrg.macro": true } // "Метка", для обращений и подобного.
        });
    }
    game.user.assignHotbarMacro(macro, slot);
    return false;
}