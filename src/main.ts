import './scss/styles.scss';
import { Page } from './components/View/Page';
import { CardCatalog } from './components/View/CardCatalog';
import { cloneTemplate, ensureElement } from './utils/utils';
import { EventEmitter } from './components/base/Events';
import { Api } from './components/base/Api';
import { LarekAPI } from './components/LarekAPI';
import { Products } from './components/Models/Products';
import { Basket as BasketModel } from './components/Models/Basket';
import { User } from './components/Models/User';
import { API_URL, CDN_URL } from './utils/constants';
import { Modal } from './components/View/Modal';
import { CardPreview } from './components/View/CardPreview';
import { IProduct, IBuyer, IOrderPost } from './types';
import { Basket as BasketView } from './components/View/Basket';
import { CardBasket } from './components/View/CardBasket';
import { OrderForm } from './components/View/OrderForm';
import { ContactsForm } from './components/View/ContactsForm';
import { Success } from './components/View/Success';

const orderTemplate = cloneTemplate<HTMLFormElement>('#order');
const basketTemplate = cloneTemplate<HTMLElement>('#basket');
const contactsTemplate = cloneTemplate<HTMLFormElement>('#contacts');
const successTemplate = cloneTemplate<HTMLElement>('#success');
const previewTemplate = cloneTemplate<HTMLElement>('#card-preview');

const events = new EventEmitter();

const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const orderForm = new OrderForm(orderTemplate, events);
const contactsForm = new ContactsForm(contactsTemplate, events);
const basketView = new BasketView(basketTemplate, events);

const successView = new Success(successTemplate, {
    onClick: () => events.emit('success:close')
});

// Единственный экземпляр превью — переиспользуется, обновляется через render/сеттеры
const previewCard = new CardPreview(previewTemplate, {
    onClick: () => events.emit('preview:toggle')
});

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
    basketView.buttonDisabled = items.length === 0;
}

const productsModel = new Products(events);
const basketModel = new BasketModel(events);
const userModel = new User(events);

const baseApi = new Api(API_URL);
const api = new LarekAPI(baseApi);

api.getProducts()
    .then((res) => {
        const productsWithCdn = res.items.map((item) => ({
            ...item,
            image: CDN_URL + item.image,
        }));
        productsModel.setItems(productsWithCdn);
    })
    .catch((err) => console.error(err));

const page = new Page(document.body, events);

events.on('items:changed', () => {
    const items = productsModel.getItems();

    const cards = items.map(item => {
        const cardTemplate = cloneTemplate<HTMLButtonElement>('#card-catalog');
        const card = new CardCatalog(cardTemplate, {
            onClick: () => events.emit('card:select', item)
        });
        return card.render({
            title: item.title,
            image: { src: item.image, alt: item.title },
            price: item.price,
            category: item.category
        });
    });

    page.catalog = cards;
});

events.on('card:select', (item: IProduct) => {
    productsModel.setPreview(item);
});

events.on('preview:changed', (data: { item: IProduct }) => {
    const item = data.item;
    if (!item) return;

    const isAlreadyInBasket = basketModel.isInBasket(item.id);
    const isAvailable = item.price !== null;

    modal.content = previewCard.render({
        title: item.title,
        image: { src: item.image, alt: item.title },
        price: item.price,
        category: item.category,
        description: item.description
    });

    previewCard.buyButtonDisabled = !isAvailable;
    previewCard.buttonText = !isAvailable
        ? 'Недоступно'
        : isAlreadyInBasket ? 'Удалить из корзины' : 'В корзину';

    modal.open();
});

// Клик по кнопке превью — товар берём из модели, а не из замыкания
events.on('preview:toggle', () => {
    const item = productsModel.getPreview();
    if (!item) return;

    if (basketModel.isInBasket(item.id)) {
        basketModel.remove(item.id);
    } else {
        basketModel.add(item);
    }

    modal.close();
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

// Открытие формы — без очистки модели и форм
events.on('order:open', () => {
    modal.content = orderForm.render();
});

events.on(/^order\..*:change/, (data: { field: keyof IBuyer, value: string }) => {
    userModel.setField(data.field, data.value);
});

// Переход ко второму шагу — прямое действие, без повторного emit
events.on('order:submit', () => {
    modal.content = contactsForm.render();
});

events.on(/^contacts\..*:change/, (data: { field: keyof IBuyer, value: string }) => {
    userModel.setField(data.field, data.value);
});

// Единая точка синхронизации модели покупателя и обеих форм
events.on('user:changed', () => {
    const user = userModel.getUserData();
    const errors = userModel.validate();

    orderForm.payment = user.payment;
    orderForm.address = user.address;
    orderForm.errors = Object.values({ payment: errors.payment, address: errors.address }).filter(Boolean).join(', ');
    orderForm.valid = !errors.payment && !errors.address;

    contactsForm.email = user.email;
    contactsForm.phone = user.phone;
    contactsForm.errors = Object.values({ email: errors.email, phone: errors.phone }).filter(Boolean).join(', ');
    contactsForm.valid = !errors.email && !errors.phone;
});

events.on('contacts:submit', () => {
    const orderData: IOrderPost = {
        ...userModel.getUserData(),
        total: basketModel.getTotal(),
        items: basketModel.getItems().map(item => item.id)
    };

    api.orderProducts(orderData)
        .then((result) => {
            basketModel.clear();
            userModel.clearUserData(); // эмитит user:changed — формы обнулятся сами через сеттеры

            modal.content = successView.render({
                total: result.total
            });
        })
        .catch((err) => {
            console.error(err);
        });
});

events.on('success:close', () => {
    modal.close();
});