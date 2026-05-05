import { TPayment } from "../../../types";
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";
import { Form, IForm } from "./Form";

interface IFormOrder {
  address: string;
  paymentMethod: TPayment | null;
}

type TFormOrder = IForm & IFormOrder;

export class FormOrder extends Form<TFormOrder> {
  protected cardButton: HTMLButtonElement;
  protected cashButton: HTMLButtonElement;
  protected addressInput: HTMLInputElement;

  constructor(
    container: HTMLFormElement,
    protected events: IEvents,
  ) {
    super(events, container);

    this.cardButton = ensureElement<HTMLButtonElement>(
      "[name=card]",
      this.container,
    );

    this.cashButton = ensureElement<HTMLButtonElement>(
      "[name=cash]",
      this.container,
    );

    this.addressInput = ensureElement<HTMLInputElement>(
      "[name=address]",
      this.container,
    );

    // Обработчики выбора оплаты
    this.cardButton.addEventListener("click", () => {
      this.events.emit("order:payment-change", { payment: "card" });
    });
    this.cashButton.addEventListener("click", () => {
      this.events.emit("order:payment-change", { payment: "cash" });
    });
  }

  set paymentMethod(value: TPayment | null) {
    this.cardButton.classList.toggle("button_alt-active", value === "card");
    this.cashButton.classList.toggle("button_alt-active", value === "cash");
  }

  set address(value: string) {
    this.addressInput.value = value;
  }
}
