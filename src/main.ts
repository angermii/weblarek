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
    events.emit("modal:close");
  },
});
const cardPreviewView = new CardPreview(cloneTemplate(cardPreviewTemplate), {
  onBuy: () => {
    const product = productsModel.selectedProduct;
    if (!product) return;

    // товар в корзине
    if (cartModel.hasProduct(product.id)) {
      cartModel.deleteCartProduct(product);
    } else {
      events.emit("cart:add", product);
    }

    events.emit("modal:close");
  },
});
const basketView = new Basket(cloneTemplate(basketTemplate), events);
const orderView = new FormOrder(cloneTemplate(orderTemplate), events);
const contactsView = new FormContacts(cloneTemplate(contactsTemplate), events);

// подписки на изменение модели продуктов
events.on("products:loaded", () => {
  const products = productsModel.productsArr;
  if (!products.length) return;

  const cardElements = products.map((product) => {
    const card = new CardCatalog(cloneTemplate(cardCatalogTemplate), {
      onClick: () => {
        productsModel.selectedProduct = product;
      },
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

events.on("product:selected", (product: IProduct) => {
  events.emit("cardPreview:open", product);
});

events.on("cardPreview:open", (product: IProduct) => {
  cardPreviewView.title = product.title;
  cardPreviewView.price =
    product.price === null ? "Бесценно" : `${product.price} синапсов`;
  cardPreviewView.image = product.image;
  cardPreviewView.description = product.description;
  cardPreviewView.category = product.category;

  // проверяем наличие цены, блок кнопки
  const canAddToCart = product.price !== null;
  cardPreviewView.buttonDisabled = !canAddToCart;
  cardPreviewView.buttonText = canAddToCart ? "Купить" : "Недоступно";

  // в корзине ли?
  const inCart = cartModel.hasProduct(product.id);
  cardPreviewView.buttonText = inCart ? "Удалить из корзины" : "Купить";

  // открытие модального окна
  modal.content = cardPreviewView.render();
  modal.open();
});

// добавление товара в корзину

events.on("cart:add", (product: IProduct) => {
  if (cartModel.hasProduct(product.id)) {
    cartModel.deleteCartProduct(product);
  } else {
    cartModel.addProduct(product);
  }
  events.emit("basket:changed");
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
    card.price = `${product.price} синапсов`;

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
  updateFormValidity(contactsView, ["phone", "email"]);

  orderView.address = buyerModel.buyerInfo.address;
  orderView.paymentMethod = buyerModel.buyerInfo.payment;
  contactsView.phone = buyerModel.buyerInfo.phone;
  contactsView.email = buyerModel.buyerInfo.email;
});

// тип оплаты, триггер ивента модели
events.on("order:payment-change", ({ payment }: { payment: TPayment }) => {
  buyerModel.payment = payment;
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
      successView.totalPrice = cartModel.getTotalPrice();
      modal.content = successView.render();
      modal.open();

      // очищение
      cartModel.clearCart();
      buyerModel.clearBuyerInfo();
    })
    .catch((error) => {
      console.error(error);
      alert("Не удалось оформить заказ");
    });
});
