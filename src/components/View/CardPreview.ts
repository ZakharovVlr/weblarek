//src/components/View/CardPreview.ts

import { ICardActions } from './Card';
import { CardCatalog } from './CardCatalog'; 
import { ensureElement } from '../../utils/utils'; // Путь к утилитам

// Дочерний класс
export class CardPreview extends CardCatalog {
    // Добавляем новые значения, которых нет в родителе
    protected _description: HTMLElement;
    protected _buyButton: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
            super(container);
    
        this._description = ensureElement<HTMLElement>('.card__text', this.container);
        this._buyButton = ensureElement<HTMLButtonElement>('.card__button', this.container);

        if (actions?.onClick) {
            this._buyButton.addEventListener('click', actions.onClick);
        }
        }

    set price(value: number | null) {
        super.price = value; // Отдаем родителю, чтобы он написал "X синапсов" или "Бесценно"

        if (value === null) {
            this._buyButton.disabled = true; // Блокируем кнопку для нажатия
            this._buyButton.textContent = 'Недоступно';
        } else {
            this._buyButton.disabled = false; 
        }
    }    

    set description(value: string) {
        this._description.textContent = String(value);
    }

    set buttonText(value: string) {
        this._buyButton.textContent = String(value);
    }
}