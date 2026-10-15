//src/components/Models/User.ts

import { IBuyer, FormErrors } from '../../types';
import { IEvents } from '../base/Events';

export class User {
    protected order: IBuyer = {
        payment: '',
        address: '',
        email: '',
        phone: '',
    };

    constructor(protected events: IEvents) { }

    setField(field: keyof IBuyer, value: string): void {
        this.order[field] = value as any;
        this.events.emit('user:changed');
    }

    getUserData(): IBuyer {
        return this.order;
    }

    clearUserData(): void {
        this.order = { payment: '', address: '', email: '', phone: '' };
        this.events.emit('user:changed');
    }

    // Единый метод проверки всех полей сразу, без привязки к шагам формы
    validate(): FormErrors {
        const errors: FormErrors = {};

        if (!this.order.payment) {
            errors.payment = 'Необходимо выбрать способ оплаты';
        }
        if (!this.order.address) {
            errors.address = 'Необходимо указать адрес доставки';
        }
        if (!this.order.email.trim()) {
            errors.email = 'Укажите email';
        }
        if (!this.order.phone.trim()) {
            errors.phone = 'Введите номер телефона';
        }

        return errors;
    }
}