//src/components/View/Form.ts

import { Component } from '../base/Component'; // Наш базовый чертеж для View
import { IEvents } from '../base/Events';     // Рация-брокер событий
import { ensureElement } from '../../utils/utils'; // Утилита для поиска в DOM

interface IFormState {
    valid: boolean;
    errors: string;
}

export class Form<T> extends Component<IFormState> {
    protected _submit: HTMLButtonElement;
    protected _errors: HTMLElement;

    constructor(container: HTMLFormElement, protected events: IEvents) {
        super(container);

        this._errors = ensureElement<HTMLElement>('.form__errors', this.container);
        this._submit = ensureElement<HTMLButtonElement>('.button[type=submit]', this.container);

        this.container.addEventListener('submit', (e: Event) => {
            e.preventDefault(); // Останавливаем перезагрузку сайта
            this.events.emit(`${(this.container as HTMLFormElement).name}:submit`);
        });

        this.container.addEventListener('input', (e: Event) => {
            const target = e.target as HTMLInputElement; // Узнаем, какой именно инпут вызвал событие
            const field = target.name as keyof T;        // Забираем его имя (например, 'address')
            const value = target.value;                  // Забираем то, что ввёл пользователь

            // Отправляем пароль: "имяФормы.имяПоля:change"
            this.events.emit(`${(this.container as HTMLFormElement).name}.${String(field)}:change`, {
                field,
                value
            });
        });
    }

    set valid(value: boolean){
        if (value === false){
            this._submit.disabled = true;
        } else {
            this._submit.disabled = false;
        }
    }

    set errors(value: string) {
        this._errors.textContent = String(value);
    }

    clear() {
        (this.container as HTMLFormElement).reset();
    }

}