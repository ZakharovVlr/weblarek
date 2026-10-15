///src/components/View/CardCatalog.ts

import { Card, ICardActions, ICardData } from './Card';
import { ensureElement } from '../../utils/utils';
import { categoryMap } from '../../utils/constants';

export interface ICardImage {
    src: string;
    alt: string;
}

export interface ICatalogCardData extends ICardData {
    image: ICardImage;
    category: string;
}

export class CardCatalog<T extends ICatalogCardData = ICatalogCardData> extends Card<T> {
    protected _image: HTMLImageElement;
    protected _category: HTMLElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);

        this._image = ensureElement<HTMLImageElement>('.card__image', this.container);
        this._category = ensureElement<HTMLElement>('.card__category', this.container);

        if (actions?.onClick) {
            container.addEventListener('click', actions.onClick);
        }
    }

    set image(value: ICardImage) {
        this.setImage(this._image, value.src, value.alt);
    }

    set category(value: string) {
        this._category.textContent = value;
        const modifier = categoryMap[value as keyof typeof categoryMap];
        if (modifier) {
            this._category.classList.add(modifier);
        }
    }
}