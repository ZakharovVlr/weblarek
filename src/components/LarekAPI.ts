import { IApi, IProductsResponse, IOrderPost, IOrderResult } from '../types';

export class LarekAPI {
    protected api: IApi;

    // Конструктор принимает только экземпляр, соответствующий интерфейсу IApi
    constructor(api: IApi) {
        this.api = api;
    }

    // Получение массива товаров с сервера (без преобразования CDN)
    getProducts(): Promise<IProductsResponse> {
        return this.api.get('/product/').then((data) => data as IProductsResponse);
    }

    // Отправка данных заказа на сервер
    orderProducts(order: IOrderPost): Promise<IOrderResult> {
        return this.api.post('/order/', order).then((data) => data as IOrderResult);
    }
}



