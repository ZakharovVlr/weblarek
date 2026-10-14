///src/components/View/CardCatalog.ts

import { Card, ICardActions } from './Card'; 
import { ensureElement } from '../../utils/utils'; // Путь к утилитам
import { categoryMap } from '../../utils/constants';

// Дочерний класс
export class CardCatalog extends Card {
    // Добавляем новые значения, которых нет в родителе
    protected _image: HTMLImageElement;
    protected _category: HTMLElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container, actions);

        this._image = ensureElement<HTMLImageElement>('.card__image', this.container);
        this._category = ensureElement<HTMLElement>('.card__category', this.container);
    }

    set image(value: string) {
        this.setImage(this._image, value, this.title); 
    }

    set category(value: string) {
        this._category.textContent = String(value);
        const modifier = categoryMap[value as keyof typeof categoryMap];
        if (modifier) {
            this._category.classList.add(modifier);
        }
    }
}