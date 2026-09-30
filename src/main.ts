import './scss/styles.scss';
import { Api } from './components/base/Api';
import { Products } from './components/Models/Products';
import { Basket } from './components/Models/Basket';
import { User } from './components/Models/User';
import { LarekAPI } from './components/LarekAPI';
import { API_URL, CDN_URL } from './utils/constants';
import { apiProducts } from './utils/data';

const productsModel = new Products();
const basketModel = new Basket();
const userModel = new User();

const baseApi = new Api(API_URL);
const api = new LarekAPI(baseApi);

// Проверка методов класса Products
console.group('тест класса Products');
productsModel.setItems(apiProducts.items);
console.log('getItems:', productsModel.getItems());

const firstProduct = productsModel.getItems()[0];
console.log('getProduct:', productsModel.getProduct(firstProduct.id));

productsModel.setPreview(firstProduct);
console.log('getPreview:', productsModel.getPreview());

// Проверка методов класса Basket
console.group('тест класса Basket');
console.log('getCount до добавления:', basketModel.getCount());

const mockItems = productsModel.getItems();
basketModel.add(mockItems[0]);
basketModel.add(mockItems[1]);
console.log('getItems корзины:', basketModel.getItems());
console.log('getCount после добавления:', basketModel.getCount());
console.log('getTotal:', basketModel.getTotal());
console.log('isInBasket:', basketModel.isInBasket(mockItems[0].id));

basketModel.remove(mockItems[0].id);
console.log('getItems после удаления:', basketModel.getItems());

basketModel.clear();
console.log('getItems после очистки:', basketModel.getItems());

// Проверка методов класса User
console.group('тест класса User');
console.log('validateOrder до заполнения:', userModel.validateOrder());

userModel.setField('payment', 'card');
userModel.setField('address', 'ул. Пушкина, д. 1');
console.log('validateOrder после заполнения:', userModel.validateOrder());

userModel.setField('email', 'test@example.com');
userModel.setField('phone', '+79991234567');
console.log('validateContacts:', userModel.validateContacts());
console.log('getUserData:', userModel.getUserData());

userModel.clearUserData();
console.log('getUserData после очистки:', userModel.getUserData());

// Запрос к серверу
console.group('Запрос к серверу');
api.getProducts()
    .then((res) => {
        const productsWithCdn = res.items.map((item) => ({
            ...item,
            image: CDN_URL + item.image,
        }));

        productsModel.setItems(productsWithCdn);
        console.log('Каталог с сервера из модели:', productsModel.getItems());
    })
    .catch((err) => console.error(err));
