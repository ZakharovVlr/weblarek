import { IProduct } from '../../types';

export class Basket {
    protected items: IProduct[] = [];

    constructor() { }

    // Получение массива товаров, которые находятся в корзине
    getItems(): IProduct[] {
        return this.items;
    }

    // Добавление товара, который был получен в параметре, в массив корзины
    add(product: IProduct): void {
        // Делаем проверку, чтобы один и тот же товар не добавился дважды
        if (!this.isInBasket(product.id)) {
            this.items.push(product);
        }
    }

    // Удаление товара, полученного в параметре из массива корзины (по id)
    remove(id: string): void {
        this.items = this.items.filter(item => item.id !== id);
    }

    // Очистка корзины
    clear(): void {
        this.items = [];
    }

    // Получение стоимости всех товаров в корзине
    getTotal(): number {
        return this.items.reduce((sum, item) => sum + (item.price || 0), 0);
    }

    // Получение количества товаров в корзине
    getCount(): number {
        return this.items.length;
    }

    // Проверка наличия товара в корзине по его id, полученного в параметр метода
    isInBasket(id: string): boolean {
        return this.items.some(item => item.id === id);
    }
}
