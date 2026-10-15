//src/components/View/Basket.ts

import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

interface IBasketView {
    items: HTMLElement[];
    total: number;
    buttonDisabled: boolean;
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
            this.events.emit('order:open');
        });
    }

    set total(value: number) {
        this._price.textContent = `${value} синапсов`;
    }

    set items(items: HTMLElement[]) {
        this._list.replaceChildren(...items);
    }

    set buttonDisabled(value: boolean) {
        this._button.disabled = value;
    }
}