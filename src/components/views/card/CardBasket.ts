import { ensureElement } from "../../../utils/utils";
import { Card, ICard, ICardActions } from "./Card";

interface ICardBasket {
  index: number;
}

export type TCardBasket = ICard & ICardBasket;
export interface ICardBasketActions extends ICardActions {
  onRemove?: (event: MouseEvent) => void;
}

export class CardBasket extends Card<TCardBasket> {
  indexElement: HTMLElement;
  deleteFromCartButton: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: ICardBasketActions) {
    super(container);
    this.indexElement = ensureElement<HTMLElement>(
      ".basket__item-index",
      this.container,
    );
    this.deleteFromCartButton = ensureElement<HTMLButtonElement>(
      ".basket__item-delete",
      this.container,
    );

    if (actions?.onRemove) {
      this.deleteFromCartButton.addEventListener("click", actions.onRemove);
    }
  }

  set index(value: number) {
    this.indexElement.textContent = String(value);
  }
}
