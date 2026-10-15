//src/components/View/OrderForm.ts 

import { Form } from './Form';
import { IBuyer } from '../../types';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export class OrderForm extends Form<IBuyer> {
    protected _cardButton: HTMLButtonElement;
    protected _cashButton: HTMLButtonElement;
    protected _addressInput: HTMLInputElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        this._cardButton = ensureElement<HTMLButtonElement>('.button[name=card]', this.container);
        this._cashButton = ensureElement<HTMLButtonElement>('.button[name=cash]', this.container);
        this._addressInput = ensureElement<HTMLInputElement>('input[name=address]', this.container);

        this._cardButton.addEventListener('click', () => {
            this.events.emit('order.payment:change', { field: 'payment', value: 'card' });
        });

        this._cashButton.addEventListener('click', () => {
            this.events.emit('order.payment:change', { field: 'payment', value: 'cash' });
        });
    }

    set payment(value: string) {
        this._cardButton.classList.toggle('button_alt-active', value === 'card');
        this._cashButton.classList.toggle('button_alt-active', value === 'cash');
    }

    set address(value: string) {
        this._addressInput.value = value;
    }
}
