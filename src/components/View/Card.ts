//src/components/View/Card.ts
import { Component } from '../base/Component'; // Базовый класс 
import { IProduct } from '../../types';
import { ensureElement } from '../../utils/utils'; // Путь к утилитам
// Это данные, которые могут прийти в render карточки
export interface ICardData extends IProduct {
    index?: number;
    buttonText?: string;
}

export interface ICardActions {
    onClick: (event: MouseEvent) => void;
}
// Pодительский класс
export class Card extends Component<ICardData> {
    // Общие для всех карточек 2 класса
    protected _title: HTMLElement;
    protected _price: HTMLElement;

    constructor(container: HTMLElement, actions?: ICardActions){
        super(container);

        this._title = ensureElement<HTMLElement>('.card__title', this.container);
        this._price = ensureElement<HTMLElement>('.card__price', this.container);

        if (actions?.onClick) {
            container.addEventListener('click', actions.onClick);
        }
    }

    set title(value: string) {
        this._title.textContent = String(value);
    }

    get title(): string {
        return this._title.textContent ?? '';
    }

    set price(value: number | null) {
        if (value) {
            this._price.textContent = `${value} синапсов`;
        } else if (value === null) {
            this._price.textContent = 'Бесценно';
        }
    }
}

