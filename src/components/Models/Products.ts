import { IProduct } from '../../types';

export class Products {
    protected items: IProduct[] = [];
    protected preview: IProduct | null = null; 

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
    getProduct(id: string): IProduct | undefined {
         return this.items.find(item => item.id === id);
    }

    // Сохранение товара для подробного отображения
    setPreview(item: IProduct | null): void {
        this.preview = item;
    }

    // Получение товара для подробного отображения
    getPreview(): IProduct | null {
        return this.preview;
    }
}


