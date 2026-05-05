import type { IBuyer, TPayment, TErrors } from "../../types";
import { IEvents } from "../base/Events";

export class BuyerInfo {
  private personPayment: TPayment;
  private personAddress: string;
  private personPhone: string;
  private personEmail: string;

  constructor(protected events: IEvents) {
    this.personPayment = "";
    this.personAddress = "";
    this.personPhone = "";
    this.personEmail = "";
  }

  private emitChanged() {
    this.events.emit("buyer:changed");
  }

  set payment(payment: TPayment) {
    this.personPayment = payment;
    this.emitChanged();
  }

  set address(address: string) {
    this.personAddress = address;
    this.emitChanged();
  }

  set phone(phone: string) {
    this.personPhone = phone;
    this.emitChanged();
  }

  set email(email: string) {
    this.personEmail = email;
    this.emitChanged();
  }

  get buyerInfo(): IBuyer {
    return {
      payment: this.personPayment,
      address: this.personAddress,
      phone: this.personPhone,
      email: this.personEmail,
    };
  }

  clearBuyerInfo() {
    this.personPayment = "";
    this.personAddress = "";
    this.personPhone = "";
    this.personEmail = "";
    this.emitChanged();
  }

  validate(): TErrors {
    const errors: TErrors = {};

    if (this.personPayment === "") {
      errors.payment = "Выберите способ оплаты";
    }
    if (!this.personAddress || this.personAddress.trim() === "") {
      errors.address = "Необходимо указать адрес";
    }
    if (!this.personPhone || this.personPhone.trim() === "") {
      errors.phone = "Необходимо указать телефон";
    }
    if (!this.personEmail || this.personEmail.trim() === "") {
      errors.email = "Необходимо указать email";
    }

    return errors;
  }
}
