import type { IProduct } from "../../types";

export class Products {
  _productsArr: IProduct[];
  _selectedProduct: IProduct | null;

  constructor() {
    this._productsArr = [];
    this._selectedProduct = null;
  }

  set productsArr(items: IProduct[]) {
    this._productsArr = items;
  }

  get productsArr(): IProduct[] {
    return this._productsArr;
  }

  getProductbyID(id: string): IProduct {
    const product = this._productsArr.find((item) => item.id === id);
    if (!product) {
      throw new Error(`Товар с id ${id} не найден`);
    }
    return product;
  }

  set selectedProduct(item: IProduct) {
    this._selectedProduct = item;
  }

  get selectedProduct(): IProduct | null {
    return this._selectedProduct;
  }
}
