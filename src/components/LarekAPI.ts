import { Api } from './base/Api'; // Импортируем сам класс Api вместо IApi
import { IProduct, IProductsResponse, IOrderPost, IOrderResult } from '../types';

export class LarekAPI {
    protected api: Api; // Указываем тип Api (композиция)
    protected cdn: string;

    // Конструктор принимает экземпляр класса Api
    constructor(api: Api, cdn: string) {
        this.api = api;
        this.cdn = cdn;
    }

    // Получение массива товаров с сервера
    getProducts(): Promise<IProduct[]> {
        return this.api.get('/product/').then((data) => {
            const res = data as IProductsResponse;
            return res.items.map((item) => ({
                ...item,
                image: this.cdn + item.image,
            }));
        });
    }

    // Отправка данных заказа на сервер
    orderProducts(order: IOrderPost): Promise<IOrderResult> {
        return this.api.post('/order/', order).then((data) => data as IOrderResult);
    }
}



