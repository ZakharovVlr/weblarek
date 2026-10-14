//src/components/View/Modal.ts
import { Component } from '../base/Component'; // Базовый класс 
import { IEvents } from '../base/Events';     // Брокер событий
import { ensureElement } from '../../utils/utils'; // Путь к утилитам

interface IModalData {
    content: HTMLElement;
}

export class Modal extends Component<IModalData> {
    protected _content: HTMLElement;
    protected _closeButton: HTMLButtonElement;
    protected _modalContainer: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        // поиск элементов и слушатели
        this._content = ensureElement<HTMLElement>('.modal__content', this.container);
        this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', this.container);
        this._modalContainer = ensureElement<HTMLElement>('.modal__container', this.container);

        // При клике на крестик — вызываем метод закрытия
        this._closeButton.addEventListener('click', () => this.close());

        // При клике на оверлей — тоже вызываем метод закрытия
        this.container.addEventListener('click', () => this.close());


        this._modalContainer.addEventListener('click', (event) => {
            event.stopPropagation();
        });
    }

    open(){
        this.container.classList.add('modal_active')
        this.events.emit('modal:open');
    }

    close(){
        this.container.classList.remove('modal_active')
        this.events.emit('modal:close');
    }

    set content(value: HTMLElement) {
        this._content.replaceChildren(value);
    }
}

