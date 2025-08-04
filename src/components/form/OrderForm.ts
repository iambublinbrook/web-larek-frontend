import { Form } from '../Form';
import { EventEmitter } from '../base/events';
import { OrderPayment, OrderFormState, PaymentChangeEvent } from '../../types';


// Класс выбора способа оплаты и адреса
export class OrderForm extends Form<OrderPayment> {

  protected _cardButton: HTMLButtonElement;
  protected _cashButton: HTMLButtonElement;
  protected _address: HTMLInputElement;
  protected _nextButton: HTMLButtonElement;

  constructor(container: HTMLFormElement, protected events: EventEmitter) {
    super(container, events);

    // Получаем элементы формы
    this._cardButton = this.container.elements.namedItem(
      'card'
    ) as HTMLButtonElement;
    this._cashButton = this.container.elements.namedItem('cash') as HTMLButtonElement;
    this._address = this.container.elements.namedItem('address') as HTMLInputElement;
    this._nextButton = this.container.querySelector('.modal__actions .button') as HTMLButtonElement;

    // Обработчики
    this._cardButton.addEventListener('click', () => {
      events.emit('payment:change', {
        payment: 'card',
        button: this._cardButton
      } as PaymentChangeEvent);
    });

    this._cashButton.addEventListener('click', () => {
      events.emit('payment:change', {
        payment: 'cash',
        button: this._cashButton
      } as PaymentChangeEvent);
    });
  }

  set valid(value: boolean) {
    this._nextButton.disabled = !value;
  }

  // Устанавливаем значение адреса
  set address(value: string) {
    this._address.value = value;
  }

  // Переключаем активный стиль у кнопок способа оплаты
  togglePayment(value: HTMLElement) {
    this.clearPayment();
    this.toggleClass(value, 'button_alt-active', true);
  }

  // Сбрасываем выбор способа оплаты
  clearPayment() {
    this.toggleClass(this._cardButton, 'button_alt-active', false);
    this.toggleClass(this._cashButton, 'button_alt-active', false);
  }

  render(state: OrderFormState): HTMLFormElement {
    return super.render(state);
  }
}
