import {
  IProductResponce,
  type IApi,
  IOrderRequest,
  IOrderResponse,
} from "../../types";

export class ServerCommunication {
  private data: IApi;

  constructor(obj: IApi) {
    this.data = obj;
  }

  async getProducts(): Promise<IProductResponce> {
    const responce = await this.data.get<IProductResponce>("/product/");
    return responce;
  }

  async createOrder(data: IOrderRequest): Promise<IOrderResponse> {
    return this.data.post<IOrderResponse>("/order/", data);
  }
}
