import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

interface IOrderSuccess {
  price: number;
}

export interface IOrderSuccessActions {
  onClick: (event: MouseEvent) => void;
}

export class OrderSuccess extends Component<IOrderSuccess> {
  protected closeButton: HTMLButtonElement;
  protected priceElement: HTMLElement;

  constructor(container: HTMLElement, actions: IOrderSuccessActions) {
    super(container);

    this.closeButton = ensureElement<HTMLButtonElement>(
      ".order-success__close",
      this.container,
    );

    this.priceElement = ensureElement<HTMLElement>(
      ".order-success__description",
      this.container,
    );

    // действие "За новыми покупками!"
    this.container.addEventListener("click", actions.onClick);
  }

  set totalPrice(value: number) {
    this.priceElement.textContent = `Списано ${value} синапсов`;
  }
}
