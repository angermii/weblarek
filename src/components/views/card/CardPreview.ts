import { IProduct } from "../../../types";
import { categoryMap, CDN_URL } from "../../../utils/constants";
import { ensureElement } from "../../../utils/utils";
import { Card, ICard, ICardActions } from "./Card";

type CategoryKey = keyof typeof categoryMap;
export type TCardPreview = ICard &
  Pick<IProduct, "image" | "category" | "description"> & {
    inCart?: boolean;
  };

export interface ICardPreviewActions extends ICardActions {
  onBuy?: (event: MouseEvent) => void;
}

export class CardPreview extends Card<TCardPreview> {
  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLElement;
  protected descriptionElement: HTMLElement;
  protected toCartButton: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: ICardPreviewActions) {
    super(container);

    this.imageElement = ensureElement<HTMLImageElement>(
      ".card__image",
      this.container,
    );

    this.categoryElement = ensureElement<HTMLElement>(
      ".card__category",
      this.container,
    );

    this.descriptionElement = ensureElement<HTMLElement>(
      ".card__text",
      this.container,
    );

    this.toCartButton = ensureElement<HTMLButtonElement>(
      ".card__button",
      this.container,
    );

    if (actions?.onBuy) {
      this.toCartButton.addEventListener("click", actions.onBuy);
    }
  }

  set category(value: string) {
    this.categoryElement.textContent = value;

    for (const key in categoryMap) {
      this.categoryElement.classList.toggle(
        categoryMap[key as CategoryKey],
        key === value,
      );
    }
  }

  set image(value: string) {
    const scr = CDN_URL + value;
    this.setImage(this.imageElement, scr, this.title);
  }

  set description(value: string) {
    this.categoryElement.textContent = value;
  }

  set buttonText(value: string) {
    this.toCartButton.textContent = value;
  }

  set buttonDisabled(value: boolean) {
    this.toCartButton.disabled = value;
  }
}
