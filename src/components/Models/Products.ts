import { IProduct } from '../../types';

export class Products {
    protected items: IProduct[] = [];
    protected preview: string | null = null;

    constructor() { }

    // Сохранение массива товаров, полученного в параметрах метода
    setItems(items: IProduct[]): void {
        this.items = items;
    }

    // Получение массива товаров из модели
    getItems(): IProduct[] {
        return this.items;
    }

    // Получение одного товара по его id
    getProduct(id: string): IProduct | null {
        return this.items.find(item => item.id === id) || null;
    }

    // Сохранение товара для подробного отображения
    setPreview(id: string | null): void {
        this.preview = id;
    }

    // Получение товара для подробного отображения
    getPreview(): IProduct | null {
        if (!this.preview) return null;
        return this.getProduct(this.preview);
    }
}

