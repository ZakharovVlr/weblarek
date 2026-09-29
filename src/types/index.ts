export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

// Способ оплаты
export type TPayment = 'card' | 'cash' | '';

// Ошибки валидации форм заказа
export type FormErrors = Partial<Record<keyof IBuyer, string>>;

// Сущность Товар
export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

// Сущность Покупатель
export interface IBuyer {
    payment: TPayment;
    email: string;
    phone: string;
    address: string;
}

// каталог товаров
export interface ICatalogData {
    catalog: IProduct[];               // Список всех товаров
    preview: string | null;            // ID выбранной карточки для модального окна
    setCatalog(products: IProduct[]): void; // Сохранить массив товаров
    setPreview(productId: string): void;   // Сохранить выбранную карточку
    getPreview(): IProduct | null;     // Получить выбранную карточку
}
//корзина с товарами
export interface IBasketData {
    items: IProduct[];                    // Массив товаров в корзине (protected)

    add(product: IProduct): void;         // Добавить товар в корзину
    remove(productId: string): void;      // Удалить товар из корзины по ID
    clear(): void;                        // Полностью очистить корзину после покупки
    getCount(): number;                   // Получить количество товаров (для счетчика на главной)
    getTotal(): number;                   // Посчитать сумму стоимости всех товаров
    isInBasket(productId: string): boolean; // Узнать наличие товара в корзине (чтобы менять кнопку Купить/Удалить)
}
//покупатель
export interface IUserData {
    order: IBuyer;                        // Объект с данными покупателя (protected)
    errors: FormErrors;                   // Ошибки валидации форм (protected)

    setField(field: keyof IBuyer, value: string): void; // Сохранение данных (запись в конкретное поле)
    validateOrder(): boolean;            // Проверка данных первого шага (payment и address)
    validateContacts(): boolean;         // Проверка данных второго шага (email и phone)
    clearOrder(): void;                   // Очистить данные покупателя после успешной оплаты
}

// То, что возвращает сервер при GET запросе на /product/
export interface IProductsResponse {
    total: number;
    items: IProduct[];
}

// Данные заказа, которые мы отправляем на сервер при POST запросе на /order/
// Склеиваем данные покупателя и добавляем поля total и items
export interface IOrderPost extends IBuyer {
    total: number;
    items: string[];
}

// То, что возвращает сервер при успешном ответе на POST-запрос заказа
export interface IOrderResult {
    id: string;
    total: number;
}

