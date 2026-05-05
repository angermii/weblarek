import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IBasket {
  price: number;
  listItems: [];
}

export class Basket extends Component<IBasket> {
  protected buyButton: HTMLButtonElement;
  protected priceElement: HTMLElement;
  protected listElement: HTMLElement;

  constructor(
    container: HTMLElement,
    protected events: IEvents,
  ) {
    super(container);

    this.buyButton = ensureElement<HTMLButtonElement>(
      ".basket__button",
      this.container,
    );

    this.priceElement = ensureElement<HTMLElement>(
      ".basket__price",
      this.container,
    );

    this.listElement = ensureElement<HTMLElement>(
      ".basket__list",
      this.container,
    );

    this.buyButton.addEventListener("click", () => {
      this.events.emit("order:open");
    });
  }

  set totalPrice(value: number) {
    this.priceElement.textContent = `${value} синапсов`;
  }

  set listItem(items: HTMLElement[]) {
    this.listElement.replaceChildren(...items);
    this.buyButton.disabled = items.length === 0;
  }
}
