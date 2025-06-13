import { EventEmitter } from '../../base/events';
import { ProductCard } from './BaseCard';
import { ICatalogItem } from '../../models/ProductData';

export class CatalogCard extends ProductCard<ICatalogItem> {
  constructor(container: HTMLElement, events: EventEmitter) {
    super(container);

    container.addEventListener('click', () => {
      events.emit('catalog:select', { id: this.container.dataset.id });
    });
  }
}