import type { IProduct } from "../../types";

export class Cart {
  _addedToCartArr: IProduct[];

  constructor() {
    this._addedToCartArr = [];
  }

  get addedToCartArr(): IProduct[] {
    return this._addedToCartArr;
  }

  addProduct(item: IProduct) {
    if (this._addedToCartArr.includes(item) === false) {
      this._addedToCartArr.push(item);
    }
  }

  deleteCartProduct(item: IProduct) {
    const index = this._addedToCartArr.findIndex(
      (cartItem) => cartItem.id === item.id,
    );
    if (index !== -1) {
      this._addedToCartArr.splice(index, 1);
    }
  }

  clearCart() {
    return (this._addedToCartArr = []);
  }

  getTotalPrice(): string {
    const total = this._addedToCartArr.reduce((sum, product) => {
      return sum + (product.price ?? 0);
    }, 0);
    return total.toString();
  }

  getTotalAmount(): number {
    return this._addedToCartArr.length;
  }

  hasProduct(id: string): boolean {
    const product = this._addedToCartArr.find((item) => item.id === id);
    return product !== undefined;
  }
}
