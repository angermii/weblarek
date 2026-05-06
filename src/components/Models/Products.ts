import type { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class Products {
  private productList: IProduct[];
  private activeProduct: IProduct | null;

  constructor(protected events: IEvents) {
    this.productList = [];
    this.activeProduct = null;
  }

  private emitChanged(value: string, item?: IProduct) {
    this.events.emit(value, item);
  }

  set productsArr(items: IProduct[]) {
    this.productList = items;
    this.emitChanged("products:loaded");
  }

  get productsArr(): IProduct[] {
    return this.productList;
  }

  getProductbyID(id: string): IProduct | undefined {
    const product = this.productList.find((item) => item.id === id);
    return product;
  }

  set selectedProduct(item: IProduct) {
    this.activeProduct = item;
    this.emitChanged("product:selected", item);
  }

  get selectedProduct(): IProduct | null {
    return this.activeProduct;
  }
}
