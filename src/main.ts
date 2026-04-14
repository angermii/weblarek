import "./scss/styles.scss";
import { Products } from "./components/Models/Products";
import { Cart } from "./components/Models/Cart";
import { BuyerInfo } from "./components/Models/BuyerInfo";
import { apiProducts } from "./utils/data";
import { ServerCommunication } from "./components/server/ServerCommunication";
import { Api } from "./components/base/Api";
import { API_URL } from "./utils/constants";

const productsModel = new Products();
const buyerModel = new BuyerInfo();
const cartModel = new Cart();

// Проверка методов продукта
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
console.log(buyerModel.validate());

// Запрос на сервер
const api = new Api(API_URL);
const Server = new ServerCommunication(api);
const ServerProducts = new Products();

Server.getProducts()
  .then((products) => {
    ServerProducts.productsArr = products.items;
    console.log("продукты с сервера", ServerProducts.productsArr);
  })
  .catch((error) => {
    console.error("Произошла ошибка:", error);
  });
