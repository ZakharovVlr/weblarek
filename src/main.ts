import './scss/styles.scss';
import { Api } from './components/base/Api';
import { Products } from './components/Models/Products';
import { Basket } from './components/Models/Basket';
import { User } from './components/Models/User';
import { LarekAPI } from './components/LarekAPI';
import { API_URL, CDN_URL } from './utils/constants';

// 1. ИНИЦИАЛИЗАЦИЯ КЛАССОВ И МОДЕЛЕЙ ДАННЫХ
const productsModel = new Products();
const basketModel = new Basket();
const userModel = new User();

// Настройка сетевого слоя через композицию
const baseApi = new Api(API_URL);
const api = new LarekAPI(baseApi, CDN_URL);

// 2. ИЗОЛИРОВАННОЕ ТЕСТИРОВАНИЕ МОДЕЛЕЙ 
// Краткий тест модели Корзины (Basket)
console.log('--- ТЕСТ МОДЕЛИ BASKET ---');
console.log('Начальное количество товаров в корзине:', basketModel.getCount());

// Краткий тест модели Покупателя (User)
console.log('--- ТЕСТ МОДЕЛИ USER ---');
const isOrderValid = userModel.validateOrder();
console.log('Проверка пустой формы (должно быть false):', isOrderValid);
console.log('Ошибки валидации пустой формы:', userModel.getErrors());

// 3. СЕТЕВОЙ ЗАПРОС И ЗАПОЛНЕНИЕ КАТАЛОГА
api.getProducts()
    .then((products) => {
        // Сохраняем полученный массив товаров в модель каталога
        productsModel.setItems(products);

        console.log('--- ТЕСТ СЛОЯ КОММУНИКАЦИИ И МОДЕЛИ PRODUCTS ---');
        console.log('Данные успешно получены с сервера через LarekAPI и сохранены в модель Products!');
        console.log('Актуальный каталог товаров, извлеченный из модели:', productsModel.getItems());
    })
    .catch((err) => {
        console.error('Ошибка при получении данных с сервера:', err);
    });

