import { ensureElement } from "../../../utils/utils";
import { Component } from "../../base/Component";

export interface ICard {
  price: string;
  titlle: string;
}

export interface ICardActions {
  onClick?: (event: MouseEvent) => void;
}

export class Card<T extends ICard> extends Component<T> {
  protected priceElement: HTMLElement;
  protected titleElement: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);

    this.priceElement = ensureElement<HTMLElement>(
      ".card__price",
      this.container,
    );
    this.titleElement = ensureElement<HTMLElement>(
      ".card__title",
      this.container,
    );
  }

  set title(value: string) {
    this.titleElement.textContent = value;
  }

  set price(value: string) {
    this.priceElement.textContent = value;
  }
}
