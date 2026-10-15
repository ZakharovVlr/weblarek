//src/components/View/CardPreview.ts

import { ICardActions } from './Card';
import { CardCatalog, ICatalogCardData } from './CardCatalog';
import { ensureElement } from '../../utils/utils';

export interface IPreviewCardData extends ICatalogCardData {
    description: string;
}

export class CardPreview extends CardCatalog<IPreviewCardData> {
    protected _description: HTMLElement;
    protected _buyButton: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);

        this._description = ensureElement<HTMLElement>('.card__text', this.container);
        this._buyButton = ensureElement<HTMLButtonElement>('.card__button', this.container);

        if (actions?.onClick) {
            this._buyButton.addEventListener('click', actions.onClick);
        }
    }

    set description(value: string) {
        this._description.textContent = value;
    }

    set buttonText(value: string) {
        this._buyButton.textContent = value;
    }

    set buyButtonDisabled(value: boolean) {
        this._buyButton.disabled = value;
    }
}