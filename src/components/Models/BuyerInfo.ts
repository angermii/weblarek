import type { IBuyer } from "../../types";
import type { TPayment } from "../../types";

export class BuyerInfo implements IBuyer {
  _payment: TPayment;
  _address: string;
  _phone: string;
  _email: string;

  constructor() {
    this._payment = "";
    this._address = "";
    this._phone = "";
    this._email = "";
  }

  set payment(payment: TPayment) {
    this._payment = payment;
  }

  set address(address: string) {
    this._address = address;
  }

  set phone(phone: string) {
    this._phone = phone;
  }

  set email(email: string) {
    this._email = email;
  }

  get BuyerInfo(): IBuyer {
    return {
      payment: this._payment,
      address: this._address,
      phone: this._phone,
      email: this._email,
    };
  }

  clearBuyerInfo() {
    this._payment = "";
    this._address = "";
    this._phone = "";
    this._email = "";
  }

  validate(): {
    isValid: boolean;
    error: {
      payment?: string;
      address?: string;
      phone?: string;
      email?: string;
    };
  } {
    const errors: {
      payment?: string;
      address?: string;
      phone?: string;
      email?: string;
    } = {};

    if (this._payment === "") {
      errors.payment = "Выберите способ оплаты";
    }
    if (!this._address || this._address.trim() === "") {
      errors.address = "Необходимо указать адрес";
    }
    if (!this._phone || this._phone.trim() === "") {
      errors.phone = "Необходимо указать телефон";
    }
    if (!this._email || this._email.trim() === "") {
      errors.email = "Необходимо указать email";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      error: errors,
    };
  }
}
