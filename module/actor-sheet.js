/*
    Код для макета листа персонажа
*/
export class SimpleActorSheet extends ActorSheet {
    // Выполняется при обращению к классу 
    // Возрощает настройки листа персонажа
    
    /*Изменить (30.08.2025) */
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ["simpletrg", "sheet", "actor"], // Классы в HTML
            template: "systems/worldbuilding/templates/actor-sheet.html",
            width: 600,
            height: 600,
            tabs: [{navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description"}], // Конфигурация вкладок
            scrollY: [".biography", ".items", ".attributes"], // Включает возможность скролла для этих классов
            dragDrop: [{dragSelector: ".item-list .item", dropSelector: null}] // Возможность переноса элементов (Задержать и вытащить)
        });
    }

    // Передаёт в HTML даныне и рендерит его
    /*Изменить (30.08.2025)*/
    async getData(options) {
        const context = await super.getData(options);
        EntitySheetHelper.getAttributeData(context.data);
        context.shorthand = !!game.settings.get("worldbuilding", "macroShorthand");
        context.systemData = context.data.system;
        context.dtypes = ATTRIBUTE_TYPES;
        context.biographyHTML = await TextEditor.enrichHTML(context.systemData.biography, {
            secrets: this.document.isOwner,
            async: true
        });
        return context;
    }

    // Вешает обработчики событий
    /*Изменить (30.08.2025)*/
    activateListeners(html) {
        super.activateListeners(html);
        if ( !this.isEditable ) return;
        html.find(".attributes").on("click", ".attribute-control", EntitySheetHelper.onClickAttributeControl.bind(this));
        html.find(".groups").on("click", ".group-control", EntitySheetHelper.onClickAttributeGroupControl.bind(this));
        html.find(".attributes").on("click", "a.attribute-roll", EntitySheetHelper.onAttributeRoll.bind(this));
        html.find(".item-control").click(this._onItemControl.bind(this));
        html.find(".items .rollable").on("click", this._onItemRoll.bind(this));
        html.find(".attributes a.attribute-roll").each((i, a) => {
            a.setAttribute("draggable", true);
            a.addEventListener("dragstart", ev => {
                let dragData = ev.currentTarget.dataset;
                ev.dataTransfer.setData('text/plain', JSON.stringify(dragData));
            }, false);
        });
    }
    /* Пример события
    _onItemControl(event) {
        event.preventDefault();
        const button = event.currentTarget;
        const li = button.closest(".item");
        const item = this.actor.items.get(li?.dataset.itemId);
        switch ( button.dataset.action ) {
            case "create":
                const cls = getDocumentClass("Item");
                return cls.create({name: game.i18n.localize("SIMPLE.ItemNew"), type: "item"}, {parent: this.actor});
            case "edit":
                return item.sheet.render(true);
            case "delete":
                return item.delete();
        }
    }
    _onItemRoll(event) {
        let button = $(event.currentTarget);
        const li = button.parents(".item");
        const item = this.actor.items.get(li.data("itemId"));
        let r = new Roll(button.data('roll'), this.actor.getRollData());
        return r.toMessage({
            user: game.user.id,
            speaker: ChatMessage.getSpeaker({ actor: this.actor }),
            flavor: `<h2>${item.name}</h2><h3>${button.text()}</h3>`
        });
    }
    _getSubmitData(updateData) {
        let formData = super._getSubmitData(updateData);
        formData = EntitySheetHelper.updateAttributes(formData, this.object);
        formData = EntitySheetHelper.updateGroups(formData, this.object);
        return formData;
    }
    */
}
