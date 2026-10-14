//src/components/View/Page.ts
import { Component } from '../base/Component'; // Базовый класс 
import { IEvents } from '../base/Events';     // Брокер событий
import { ensureElement } from '../../utils/utils'; // Путь к утилитам

interface IPageState {
    counter: number;
    catalog: HTMLElement[];
    locked: boolean;
}

export class Page extends Component<IPageState> {
    protected _counter: HTMLElement;
    protected _catalog: HTMLElement;
    protected _wrapper: HTMLElement;
    protected _basket: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        // поиск элементов и слушатели
        this._counter = ensureElement<HTMLElement>('.header__basket-counter', this.container);
        this._catalog = ensureElement<HTMLElement>('.gallery', this.container);
        this._wrapper = ensureElement<HTMLElement>('.page__wrapper', this.container);
        this._basket = ensureElement<HTMLButtonElement>('.header__basket', this.container);

        this._basket.addEventListener('click', () => {
            this.events.emit('basket:open')
        })
    }

    // Сеттер для счётчика товаров в корзине
    set counter(value: number) {
        this._counter.textContent = String(value);
    }

    set catalog(cards: HTMLElement[]){
        this._catalog.replaceChildren(...cards);
    }

    set locked(value: boolean) {
        if (value === true){
            this._wrapper.classList.add('page__wrapper_locked')
        } else {
            this._wrapper.classList.remove('page__wrapper_locked')
        }
    }
}