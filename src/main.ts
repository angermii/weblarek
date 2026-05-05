import "./scss/styles.scss";
import { Products } from "./components/Models/Products";
import { Cart } from "./components/Models/Cart";
import { BuyerInfo } from "./components/Models/BuyerInfo";
// import { apiProducts } from "./utils/data";
import { ServerCommunication } from "./components/server/ServerCommunication";
import { Api } from "./components/base/Api";
import { API_URL } from "./utils/constants";
import { EventEmitter } from "./components/base/Events";
import { CardCatalog } from "./components/views/card/CardCatalog";
import { ModalWindow } from "./components/views/ModalWindow";
import { Header } from "./components/views/Header";
import { cloneTemplate, ensureElement } from "./utils/utils";
import { Gallery } from "./components/views/Gallery";
import { OrderSuccess } from "./components/views/OrderSuccess";
import { CardPreview } from "./components/views/card/CardPreview";
import { CardBasket } from "./components/views/card/CardBasket";
import { Basket } from "./components/views/Basket";
import { FormOrder } from "./components/views/form/FormOrder";
import { FormContacts } from "./components/views/form/FormContacts";
import { IOrderRequest, IProduct, TErrors, TPayment } from "./types";
import { Form } from "./components/views/form/Form";

// инициализация

// Запрос на сервер
const api = new Api(API_URL);
const Server = new ServerCommunication(api);
Server.getProducts()
  .then((products) => {
    productsModel.productsArr = products.items;
    console.log("продукты с сервера", productsModel.productsArr);
  })
  .catch((error) => {
    console.error("Произошла ошибка:", error);
  });

// событие
const events = new EventEmitter();

// модели
const productsModel = new Products(events);
const buyerModel = new BuyerInfo(events);
const cartModel = new Cart(events);

// элементы страницы
const header = new Header(events, ensureElement<HTMLElement>(".header"));
const gallery = new Gallery(ensureElement<HTMLElement>(".gallery"));
const modal = new ModalWindow(ensureElement<HTMLElement>(".modal"), events);

// templates
const successTemplate = ensureElement<HTMLTemplateElement>("#success");
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>("#card-catalog");
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>("#card-preview");
const cardBasketTemplate = ensureElement<HTMLTemplateElement>("#card-basket");
const basketTemplate = ensureElement<HTMLTemplateElement>("#basket");
const orderTemplate = ensureElement<HTMLTemplateElement>("#order");
const contactsTemplate = ensureElement<HTMLTemplateElement>("#contacts");

// производство клонов для неповторяемых сущностей
const successView = new OrderSuccess(cloneTemplate(successTemplate), {
  onClick: () => {
    modal.close();
    cartModel.clearCart();
    buyerModel.clearBuyerInfo();
    orderView.reset();
    contactsView.reset();
  },
});
const cardPreviewView = new CardPreview(cloneTemplate(cardPreviewTemplate), {
  onBuy: () => {
    if (!currentProduct) return;
    if (currentProduct.price === null) return;
    if (cartModel.hasProduct(currentProduct.id)) return;

    cartModel.addProduct(currentProduct);
    modal.close();
  },
});
const basketView = new Basket(cloneTemplate(basketTemplate), events);
const orderView = new FormOrder(cloneTemplate(orderTemplate), events);
const contactsView = new FormContacts(cloneTemplate(contactsTemplate), events);

//функция открытия карточки
let currentProduct: IProduct | null = null;
function openCardPreview(product: IProduct) {
  currentProduct = product;

  cardPreviewView.title = product.title;
  cardPreviewView.price =
    product.price === null ? "Бесценно" : `${product.price} синапсов`;
  cardPreviewView.image = product.image;
  cardPreviewView.description = product.description;
  cardPreviewView.category = product.category;

  const canAddToCart =
    product.price !== null && !cartModel.hasProduct(product.id);
  cardPreviewView.buttonDisabled = !canAddToCart;
  cardPreviewView.buttonText = canAddToCart ? "Купить" : "Недоступно";

  modal.content = cardPreviewView.render();
  modal.open();
}

// подписки на изменение модели продуктов
events.on("products:loaded", () => {
  const products = productsModel.productsArr;
  if (!products.length) return;

  const cardElements = products.map((product) => {
    const card = new CardCatalog(cloneTemplate(cardCatalogTemplate), {
      onClick: () => openCardPreview(product),
    });

    // Заполняем карточку данными
    card.title = product.title;
    card.price =
      product.price === null ? "Бесценно" : `${product.price} синапсов`;
    card.image = product.image;
    card.category = product.category;

    // Возвращаем корневой элемент карточки (render() из Component)
    return card.render();
  });

  // Передаём массив элементов в галерею
  gallery.catalog = cardElements;
});

events.on("cardPreview:open", (product: IProduct) => {
  currentProduct = product;

  cardPreviewView.title = product.title;
  cardPreviewView.price =
    product.price === null ? "Бесценно" : `${product.price} синапсов`;
  cardPreviewView.image = product.image;
  cardPreviewView.description = product.description;
  cardPreviewView.category = product.category;

  // проверяем наличие в корзине и наличие цены, блок кнопки
  const canAddToCart =
    product.price !== null && !cartModel.hasProduct(product.id);
  cardPreviewView.buttonDisabled = !canAddToCart;
  cardPreviewView.buttonText = canAddToCart ? "Купить" : "Недоступно";

  // открытие модального окна
  modal.content = cardPreviewView.render();
  modal.open();
});

events.on("modal:close", () => {
  modal.close();
});

// корзина
events.on("basket:open", () => {
  modal.content = basketView.render();
  modal.open();
});

events.on("basket:changed", () => {
  const items = cartModel.addedToCartArr;

  const cardElements = items.map((product, index) => {
    const card = new CardBasket(cloneTemplate(cardBasketTemplate), {
      onRemove: () => {
        cartModel.deleteCartProduct(product);
      },
    });
    card.index = index + 1;
    card.title = product.title;
    card.price = String(product.price);

    return card.render();
  });

  basketView.listItem = cardElements;
  basketView.totalPrice = cartModel.getTotalPrice();

  header.counter = cartModel.getTotalAmount(); // счетчик
});

// оформление заказа
events.on("order:open", () => {
  modal.content = orderView.render();
  modal.open();
});

// функция для проверки валидности

function updateFormValidity(form: Form<any>, fields: (keyof TErrors)[]) {
  const allErrors = buyerModel.validate();
  const filteredErrors = Object.fromEntries(
    Object.entries(allErrors).filter(([key]) =>
      fields.includes(key as keyof TErrors),
    ),
  );

  const isValid = Object.keys(filteredErrors).length === 0;
  form.error = Object.values(filteredErrors);
  form.valid = isValid;
}

events.on("buyer:changed", () => {
  updateFormValidity(orderView, ["payment", "address"]);

  if (modal.content === contactsView.render()) {
    updateFormValidity(contactsView, ["phone", "email"]);
  }
});

// тип оплаты
events.on("order:payment-change", ({ payment }: { payment: TPayment }) => {
  buyerModel.payment = payment;
  orderView.paymentMethod = payment;
});

// адрес
events.on(
  "order:inputChange",
  ({ field, value }: { field: string; value: string }) => {
    if (field === "address") {
      buyerModel.address = value;
    }
  },
);

// форма контактов
events.on("order:submit", () => {
  modal.content = contactsView.render();
  modal.open();
});

events.on(
  "contacts:inputChange",
  ({ field, value }: { field: string; value: string }) => {
    if (field === "phone") {
      buyerModel.phone = value;
    }

    if (field === "email") {
      buyerModel.email = value;
    }
    updateFormValidity(contactsView, ["phone", "email"]);
  },
);

// передача данных серверу и успех
events.on("contacts:submit", () => {
  const orderData: IOrderRequest = {
    payment: buyerModel.buyerInfo.payment,
    total: cartModel.getTotalPrice(),
    items: cartModel.addedToCartArr.map((product) => product.id),
    email: buyerModel.buyerInfo.email,
    phone: buyerModel.buyerInfo.phone,
    address: buyerModel.buyerInfo.address,
  };

  Server.createOrder(orderData)
    .then((res) => {
      console.log("успешный заказ", res);

      // открытие модалки успеха
      modal.content = successView.render();
      modal.open();
      successView.totalPrice = cartModel.getTotalPrice();
    })
    .catch((error) => {
      console.error(error);
      alert("Не удалось оформить заказ");
    });
});

/* // Проверка методов продукта
productsModel.productsArr = apiProducts.items;
console.log("Массив товаров из каталога: ", productsModel.productsArr);
console.log(productsModel.getProductbyID(apiProducts.items[1].id));

productsModel.selectedProduct = apiProducts.items[3]; // конкретный продукт
console.log("Товар для отображения: ", productsModel.selectedProduct);

// Проверка методов корзины
cartModel.addProduct(apiProducts.items[1]);
cartModel.addProduct(apiProducts.items[2]);
console.log("Добавление товара в корзину", cartModel.addedToCartArr);
console.log("Цена", cartModel.getTotalPrice());
console.log("Количество", cartModel.getTotalAmount());

cartModel.deleteCartProduct(apiProducts.items[1]); // удалили 1 продукт
console.log("Удалили 1 продукт", cartModel.addedToCartArr);
console.log(
  "есть ли продукт в корзине",
  cartModel.hasProduct(apiProducts.items[1].id),
);

cartModel.clearCart(); // очистка всей корзины
console.log("Очистка корзины", cartModel.addedToCartArr);

// Проверка методов покупателя
buyerModel.payment = "cash";
buyerModel.address = "1111";
buyerModel.phone = "telephone";
buyerModel.email = "test@test.test";
console.log(buyerModel, " - покупатель");

buyerModel.clearBuyerInfo();
console.log("метод очистки", buyerModel);
console.log(buyerModel.validate()); */

// const ServerProducts = new Products(events);
