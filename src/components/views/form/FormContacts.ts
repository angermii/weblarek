import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";
import { Form, IForm } from "./Form";

interface IFormContacts {
  phone: string;
  email: string;
}

type TFormContacts = IForm & IFormContacts;

export class FormContacts extends Form<TFormContacts> {
  protected emailInput: HTMLInputElement;
  protected phoneInput: HTMLInputElement;

  constructor(
    container: HTMLFormElement,
    protected events: IEvents,
  ) {
    super(events, container);

    this.emailInput = ensureElement<HTMLInputElement>(
      "[name=email]",
      this.container,
    );

    this.phoneInput = ensureElement<HTMLInputElement>(
      "[name=phone]",
      this.container,
    );
  }

  set phone(value: string) {
    this.phoneInput.value = value;
  }

  set email(value: string) {
    this.emailInput.value = value;
  }
}
