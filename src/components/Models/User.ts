//src/components/Models/User.ts

import { IBuyer, FormErrors } from '../../types';
import { IEvents } from '../base/Events';     // Рация-брокер событий

export class User {
    protected order: IBuyer = {
        payment: '',
        address: '',
        email: '',
        phone: '',
    };

    constructor(protected events: IEvents) { }

    // Точечное сохранение данных формы в модель
    setField(field: keyof IBuyer, value: string): void {
        // 1. Сначала просто точечно сохраняем данные в объект заказа
        this.order[field] = value as any;

        // 2. А теперь проверяем, какое поле изменилось, и запускаем нужную валидацию
        if (field === 'payment' || field === 'address') {
            this.validateOrder();
        } else if (field === 'email' || field === 'phone') {
            this.validateContacts();
        }
    }


    // Получение всех накопленных данных покупателя
    getUserData(): IBuyer {
        return this.order;
    }

    // Очистка данных после успешной оплаты
    clearUserData(): void {
        this.order = { payment: '', address: '', email: '', phone: '' };
    }

    // Проверка полей первого шага оформления (Способ оплаты и Адрес)
    validateOrder(): FormErrors {
        const errors: FormErrors = {};

        if (!this.order.payment) {
            errors.payment = 'Необходимо выбрать способ оплаты';
        }
        if (!this.order.address) {
            errors.address = 'Необходимо указать адрес доставки';
        }

        this.events.emit('formErrors:change', errors);

        return errors;
    }


    // Проверка полей второго шага оформления (Email и Телефон)
    validateContacts(): FormErrors {
        const errors: FormErrors = {};

        if (!this.order.email.trim()) {
            errors.email = 'Укажите email';
        }
        if (!this.order.phone.trim()) {
            errors.phone = 'Введите номер телефона';
        }

        this.events.emit('formErrors:change', errors);

        return errors;
    }
}
