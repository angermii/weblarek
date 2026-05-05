import type { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class Cart {
  private _addedToCartArr: IProduct[];

  constructor(protected events: IEvents) {
    this._addedToCartArr = [];
  }

  private emitChanged() {
    this.events.emit("basket:changed");
  }

  get addedToCartArr(): IProduct[] {
    return this._addedToCartArr;
  }

  addProduct(item: IProduct) {
    if (!this.hasProduct(item.id)) {
      this._addedToCartArr.push(item);
    }
    this.emitChanged();
  }

  deleteCartProduct(item: IProduct) {
    const index = this._addedToCartArr.findIndex(
      (cartItem) => cartItem.id === item.id,
    );
    if (index !== -1) {
      this._addedToCartArr.splice(index, 1);
    }
    this.emitChanged();
  }

  clearCart() {
    this._addedToCartArr = [];
    this.emitChanged();
  }

  getTotalPrice(): number {
    const total = this._addedToCartArr.reduce((sum, product) => {
      return sum + (product.price ?? 0);
    }, 0);
    return total;
  }

  getTotalAmount(): number {
    return this._addedToCartArr.length;
  }

  hasProduct(id: string): boolean {
    const product = this._addedToCartArr.find((item) => item.id === id);
    return product !== undefined;
  }
}
