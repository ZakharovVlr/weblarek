import { IBuyer, TPayment, FormErrors } from '../../types';

export class User {
    protected order: IBuyer = {
        payment: '',
        address: '',
        email: '',
        phone: '',
    };

    constructor() { }

    // Точечное сохранение данных формы в модель
    setField(field: keyof IBuyer, value: string): void {
        if (field === 'payment') {
            this.order.payment = value as TPayment;
        } else {
            this.order[field] = value;
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
            errors.payment = 'Не выбран способ оплаты';
        }
        if (!this.order.address.trim()) {
            errors.address = 'Необходимо заполнить адрес доставки';
        }

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

        return errors;
    }
}
