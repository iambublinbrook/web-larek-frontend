import { Component } from './base/Component';
import { EventEmitter } from './base/events';
import { ensureElement } from '../utils/utils';

export class Basket extends Component<HTMLElement> {
  protected _list: HTMLElement;
  protected _total: HTMLElement;
  protected _button: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: EventEmitter) {
    super(container);

    this._list = ensureElement<HTMLElement>('.basket__list', this.container);
    this._total = ensureElement<HTMLElement>('.basket__price', this.container);
    this._button = ensureElement<HTMLButtonElement>('.basket__button', this.container);

    this._button.addEventListener('click', () => {
      this.events.emit('order:open');
    });
  }

  set items(items: HTMLElement[]) {
    if (items.length > 0) {
      this._list.replaceChildren(...items);
    } else {
      this._list.textContent = 'Корзина пуста';
    }
    this.setDisabled(this._button, items.length === 0);
  }

  set total(value: number) {
    this.setText(this._total, `${value} синапсов`);
  }

  set block(value: boolean) {
    this.setDisabled(this._button, value);
  }
}
