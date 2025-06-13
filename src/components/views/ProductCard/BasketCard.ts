import { ProductCard } from './BaseCard';
import { EventEmitter } from '../../base/events';
import { IBasketProduct } from '../../types/products';

export class BasketCard extends ProductCard<IBasketProduct> {
  protected _index: HTMLElement;
  protected _deleteButton: HTMLButtonElement;

  constructor(container: HTMLElement, events: EventEmitter) {
    super(container, events);

    this._index = ensureElement('.basket__item-index', container);
    this._deleteButton = ensureElement('.basket__item-delete', container);

    this._deleteButton.addEventListener('click', () => {
      events.emit('basket:delete', { id: this.id });
    });
  }

  set index(value: number) {
    this.setText(this._index, value.toString());
  }
}