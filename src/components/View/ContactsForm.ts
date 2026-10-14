//src/components/View/ContactsForm.ts

import { Form } from './Form';
import { IBuyer } from '../../types';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export class ContactsForm extends Form<IBuyer> {
    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
    }

    set email(value: string) {
        const input = ensureElement<HTMLInputElement>('input[name=email]', this.container);
        input.value = value;
    }

    set phone(value: string) {
        const input = ensureElement<HTMLInputElement>('input[name=phone]', this.container);
        input.value = value;
    }
}
