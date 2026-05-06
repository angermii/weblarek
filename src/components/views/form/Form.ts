import { ensureAllElements, ensureElement } from "../../../utils/utils";
import { Component } from "../../base/Component";
import { IEvents } from "../../base/Events";

export interface IForm {
  errors: string[];
  valid: boolean;
}

export class Form<T extends IForm> extends Component<T> {
  protected submitButton: HTMLButtonElement;
  protected errorElement: HTMLElement;
  protected formInputs: HTMLInputElement[];

  constructor(
    protected events: IEvents,
    container: HTMLFormElement,
  ) {
    super(container);

    this.submitButton = ensureElement<HTMLButtonElement>(
      "[type=submit]",
      this.container,
    );
    this.errorElement = ensureElement<HTMLElement>(
      ".form__errors",
      this.container,
    );

    this.formInputs = ensureAllElements<HTMLInputElement>(
      ".form__input",
      this.container,
    );

    container.addEventListener("input", (e) => {
      const target = e.target as HTMLInputElement;
      const field = target.name;
      const value = target.value;
      this.events.emit(`${container.name}:inputChange`, { field, value });
    });

    container.addEventListener("submit", (e) => {
      e.preventDefault();
      this.events.emit(`${container.name}:submit`);
    });
  }

  set error(value: string[]) {
    this.errorElement.textContent = value.join(", ");
  }

  set valid(value: boolean) {
    this.submitButton.disabled = !value;
  }
}
