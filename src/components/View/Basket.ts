//src/components/View/Basket.ts
import { Component } from '../base/Component'; // Наш базовый чертеж для View
import { IEvents } from '../base/Events';     // Рация-брокер событий
import { ensureElement, createElement } from '../../utils/utils'; // Утилита для поиска в DOM

interface IBasketView {
    items: HTMLElement[];
    total: number;
}

export class Basket extends Component<IBasketView> {
    protected _list: HTMLElement;
    protected _price: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
            super(container);

        this._list = ensureElement<HTMLElement>('.basket__list', this.container);
        this._price = ensureElement<HTMLElement>('.basket__price', this.container);
        this._button = ensureElement<HTMLButtonElement>('.basket__button', this.container);

        this._button.addEventListener('click', () => {
            this.events.emit('order:open')
        })
    }

    set total(value: number) {
        this._price.textContent = `${value} синапсов`;
    }

    set items(items: HTMLElement[]) {
        if(items.length > 0) {
            this._button.disabled = false;
            this._list.replaceChildren(...items);
        } else if (items.length === 0){
            this._button.disabled = true;
            this._list.replaceChildren(createElement('p', {
                textContent: 'Корзина пуста'
            }));
        }
    }
}