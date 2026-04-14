import type { IProduct } from "../../types";

export class Products {
  private productList: IProduct[];
  private activeProduct: IProduct | null;

  constructor() {
    this.productList = [];
    this.activeProduct = null;
  }

  set productsArr(items: IProduct[]) {
    this.productList = items;
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
  }

  get selectedProduct(): IProduct | null {
    return this.activeProduct;
  }
}
