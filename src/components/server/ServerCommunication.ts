import { IProductResponce, type IApi } from "../../types";
import { IOrderRequest } from "../../types";
import { IOrderResponse } from "../../types";
import { IProduct } from "../../types";

export class ServerCommunication {
  _data: IApi;

  constructor(obj: IApi) {
    this._data = obj;
  }

  async getProducts(): Promise<IProduct[]> {
    const responce = await this._data.get<IProductResponce>("/product/");
    return responce.items;
  }

  async createOrder(data: IOrderRequest): Promise<IOrderResponse> {
    return this._data.post<IOrderResponse>("/order/", data);
  }
}
