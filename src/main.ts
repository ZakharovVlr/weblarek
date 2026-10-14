import './scss/styles.scss';
import { Page } from './components/View/Page';
import { CardCatalog } from './components/View/CardCatalog';
import { cloneTemplate } from './utils/utils'; 
import { EventEmitter } from './components/base/Events';
import { Api } from './components/base/Api';
import { LarekAPI } from './components/LarekAPI';
import { Products } from './components/Models/Products';
import { Basket as BasketModel } from './components/Models/Basket';
import { User } from './components/Models/User';
import { API_URL, CDN_URL } from './utils/constants';
import { Modal } from './components/View/Modal';
import { CardPreview } from './components/View/CardPreview';
import { IProduct, IBuyer, IOrderPost, FormErrors } from './types';
import { ensureElement } from './utils/utils'; 
import { Basket as BasketView } from './components/View/Basket';
import { CardBasket } from './components/View/CardBasket';
import { OrderForm } from './components/View/OrderForm';
import { ContactsForm } from './components/View/ContactsForm';
import { Success } from './components/View/Success';
// Клонируем темплейт первой формы из HTML по её id
const orderTemplate = cloneTemplate<HTMLFormElement>('#order');

// Инициализируем брокер событий (нашу рацию)
const events = new EventEmitter();

const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
// Создаем экземпляр представления формы заказа
const orderForm = new OrderForm(orderTemplate, events);
// Клонируем темплейт самой корзины
const basketTemplate = cloneTemplate<HTMLElement>('#basket');
// Создаем экземпляр отображения корзины
const basketView = new BasketView(basketTemplate, events);

function renderBasketItems(): void {
    const items = basketModel.getItems();
    const basketCards = items.map((item, index) => {
        const cardTemplate = cloneTemplate<HTMLElement>('#card-basket');
        const card = new CardBasket(cardTemplate, {
            onClick: () => events.emit('card:remove', item)
        });
        return card.render({
            title: item.title,
            price: item.price,
            index: index + 1
        });
    });

    basketView.items = basketCards;
    basketView.total = basketModel.getTotal();
}

// Инициализируем модели данных, передавая им рацию
const productsModel = new Products(events);
const basketModel = new BasketModel(events);
const userModel = new User(events);

// Инициализируем коммуникационный слой
const baseApi = new Api(API_URL);
const api = new LarekAPI(baseApi);

// Запрос к серверу за товарами 
api.getProducts()
    .then((res) => {
        const productsWithCdn = res.items.map((item) => ({
            ...item,
            image: CDN_URL + item.image,
        }));

        // Сохраняем товары в модель — это вызовет событие 'items:changed'
        productsModel.setItems(productsWithCdn);
    })
    .catch((err) => console.error(err));


const page = new Page(document.body, events);

events.on('items:changed', () => {
    //Получиаем массив товаров из модели
    const items = productsModel.getItems();

    // Сохраняем результат map в переменную cards, чтобы получился массив готовых HTML-элементов
    const cards = items.map(item => {
        // Клонируем шаблон для конкретной карточки
        const cardTemplate = cloneTemplate<HTMLButtonElement>('#card-catalog');

        // Создаем экземпляр View-компонента карточки витрины
        const card = new CardCatalog(cardTemplate, {
            // При клике на карточку — «кричим» в эфир событие выбора карточки
            onClick: () => events.emit('card:select', item)
        });

        // Вызываем метод render, чтобы заполнить карточку данными, и возвращаем этот HTMLElement наружу
        return card.render({
            title: item.title,
            image: item.image,
            price: item.price,
            category: item.category
        });
    });

    // После того как map завершился, передаем весь массив cards в сеттер главной страницы:
    page.catalog = cards;
})

events.on('card:select', (item: IProduct) => {
    productsModel.setPreview(item)
});

events.on('preview:changed', (data: { item: IProduct }) => {
    // Достаем конкретный товар из прилетевших данных
    const item = data.item;

    if (item) {
        const cardTemplate = cloneTemplate<HTMLElement>('#card-preview');

        // 1. Проверяем, находится ли ТОВАР УЖЕ В КОРЗИНЕ
        const isAlreadyInBasket = basketModel.isInBasket(item.id);

        // 2. Создаем экземпляр превью карточки
        const card = new CardPreview(cardTemplate, {
            onClick: () => {
                // Если товар уже в корзине — удаляем его, иначе — покупаем
                if (isAlreadyInBasket) {
                    events.emit('card:remove', item); // Вызываем наше готовое удаление
                } else {
                    events.emit('card:buy', item);    // Вызываем нашу покупку
                }
                modal.close(); // В обоих случаях закрываем модалку по ТЗ
            }
        });

        // Передаем данные, читая их ИМЕННО из переменной item!
        modal.content = card.render({
            title: item.title,
            image: item.image,
            price: item.price,
            category: item.category,
            description: item.description
        });

        // МЕНЯЕМ ТЕКСТ КНОПКИ, только если товар доступен к покупке
        if (item.price !== null) {
            if (isAlreadyInBasket) {
                card.buttonText = 'Удалить из корзины';
            } else {
                card.buttonText = 'В корзину';
            }
        }

        modal.open();
    }
});

// Слушаем клик по кнопке «В корзину» в модалке превью
events.on('card:buy', (item: IProduct) => {
    basketModel.add(item); // Добавляем в модель данных
    modal.close();        // Закрываем модальное окно по ТЗ
});

events.on('basket:open', () => {
    renderBasketItems();
    modal.content = basketView.render();
    modal.open();
});

events.on('card:remove', (item: IProduct) => {
    basketModel.remove(item.id);
});

events.on('basket:changed', () => {
    page.counter = basketModel.getCount();
    renderBasketItems();
});

events.on('order:open', () => {
    userModel.clearUserData();
    orderForm.clear();
    modal.content = orderForm.render({
        valid: false,
        errors: []
    });
});

// Ловим любые изменения полей в форме order
events.on(/^order\..*:change/, (data: { field: keyof IBuyer, value: string }) => {
    userModel.setField(data.field, data.value);

    // Если пользователь изменил именно способ оплаты, сразу передаем его в сеттер формы для подсветки!
    if (data.field === 'payment') {
        orderForm.payment = data.value;
    }
});


events.on('order:submit', () => {
    events.emit('contacts:open');
});

const contactsTemplate = cloneTemplate<HTMLFormElement>('#contacts');
const contactsForm = new ContactsForm(contactsTemplate, events);

const successTemplate = cloneTemplate<HTMLElement>('#success');
// В Success по ТЗ мы передаем объект с коллбеком для кнопки «За покупками!»
const successView = new Success(successTemplate, {
    onClick: () => modal.close() // Просто закрываем модалку при клике
});

// 1. Открытие второго шага оформления
events.on('contacts:open', () => {
    contactsForm.clear();
    modal.content = orderForm.render({
        valid: false,
        errors: ''
    });
});

// 2. Ловим любые изменения полей в форме контактов
events.on(/^contacts\..*:change/, (data: { field: keyof IBuyer, value: string }) => {
    userModel.setField(data.field, data.value);
});

// обработчик ошибок 
events.on('formErrors:change', (errors: FormErrors) => {
    const { payment, address, email, phone } = errors;

    // Валидация первой формы
    orderForm.valid = !payment && !address;
    orderForm.errors = Object.values({ payment, address }).filter(Boolean).join(', ');

    // Валидация второй формы
    contactsForm.valid = !email && !phone;
    contactsForm.errors = Object.values({ email, phone }).filter(Boolean).join(', ');
});

// 4. Сабмит второй формы — отправка заказа на сервер!
events.on('contacts:submit', () => {
    // Формируем объект заказа по строгому типу IOrderPost для сервера
    const orderData: IOrderPost = {
        ...userModel.getUserData(),
        total: basketModel.getTotal(),
        items: basketModel.getItems().map(item => item.id)
    };

    // Отправляем данные через сетевой слой
    api.orderProducts(orderData)
        .then((result) => {
            // Если сервер ответил успехом:
            // 1. Очищаем корзину и модель пользователя
            basketModel.clear();
            userModel.clearUserData();

            // 2. Рендерим окно успеха, передавая туда списанную сумму
            modal.content = successView.render({
                total: result.total
            });
        })
        .catch((err) => {
            console.error(err);
        });
});
