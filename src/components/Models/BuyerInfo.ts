import type { IBuyer, TPayment, TErrors } from "../../types";

export class BuyerInfo {
  private personPayment: TPayment;
  private personAddress: string;
  private personPhone: string;
  private personEmail: string;

  constructor() {
    this.personPayment = "";
    this.personAddress = "";
    this.personPhone = "";
    this.personEmail = "";
  }

  set payment(payment: TPayment) {
    this.personPayment = payment;
  }

  set address(address: string) {
    this.personAddress = address;
  }

  set phone(phone: string) {
    this.personPhone = phone;
  }

  set email(email: string) {
    this.personEmail = email;
  }

  get BuyerInfo(): IBuyer {
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
