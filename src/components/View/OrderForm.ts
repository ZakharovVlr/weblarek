//src/components/View/OrderForm.ts 

import { Form } from './Form';
import { IBuyer } from '../../types';
import { IEvents } from '../base/Events';     // Рация-брокер событий
import { ensureElement } from '../../utils/utils'; // Утилита для поиска в DOM


export class OrderForm extends Form<IBuyer> {
    protected _cardButton: HTMLButtonElement;
    protected _cashButton: HTMLButtonElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        this._cardButton = ensureElement<HTMLButtonElement>('.button[name=card]', this.container);
        this._cashButton = ensureElement<HTMLButtonElement>('.button[name=cash]', this.container);
        
        this._cardButton.addEventListener('click', () => {
            this.events.emit('order.payment:change', { field: 'payment', value: 'card' });
        });

        this._cashButton.addEventListener('click', () => {
            this.events.emit('order.payment:change', { field: 'payment', value: 'cash' });
        });
    }

    set payment(value: string){
            // Кнопка Онлайн подсветится, ТОЛЬКО если value равно 'card'
            this._cardButton.classList.toggle('button_alt-active', value === 'card');

            // Кнопка При получении подсветится, ТОЛЬКО если value равно 'cash'
            this._cashButton.classList.toggle('button_alt-active', value === 'cash');
        }
}  
