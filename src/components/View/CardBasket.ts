//src/components/View/CardBasket.ts

import { Card, ICardActions } from './Card';
import { ensureElement } from '../../utils/utils'; // Путь к утилитам

// Дочерний класс (корзина)
export class CardBasket extends Card {
    protected _index: HTMLElement;
    protected _deleteButton: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);

        this._index = ensureElement<HTMLElement>('.basket__item-index', this.container);
        this._deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

        if (actions?.onClick) {
            this._deleteButton.addEventListener('click', actions.onClick);
        }
    }

    set index(value: number){
        this._index.textContent = String(value);
    }
}