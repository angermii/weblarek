import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IModalWindow {
  content: HTMLElement;
}

export class ModalWindow extends Component<IModalWindow> {
  protected closeButton: HTMLButtonElement;
  protected contentElement: HTMLElement;

  constructor(
    container: HTMLElement,
    protected events: IEvents,
  ) {
    super(container);

    this.closeButton = ensureElement<HTMLButtonElement>(
      ".modal__close",
      this.container,
    );
    this.contentElement = ensureElement<HTMLElement>(
      ".modal__content",
      this.container,
    );

    this.closeButton.addEventListener("click", () => {
      this.events.emit("modal:close");
    });

    this.container.addEventListener("click", (e) => {
      if (e.target === this.container) {
        this.events.emit("modal:close");
      }
    });
  }

  set content(value: HTMLElement) {
    this.contentElement.replaceChildren(value);
  }

  open() {
    this.container.classList.add("modal_active");
  }

  close() {
    this.container.classList.remove("modal_active");
    this.contentElement.replaceChildren();
  }
}
