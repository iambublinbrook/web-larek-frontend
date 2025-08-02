import { productCategory } from '../utils/constants';
import { ensureElement } from '../utils/utils';
import { Component } from './base/Component';
import { IProductItem, ICatalogItem, IBasket } from '../types';
import { EventEmitter } from './base/events';

interface BasketCardEvents {
  delete: (id: string) => void;
}

/**
 * Базовый класс карточки товара
 */
export class ProductCard<T> extends Component<IProductItem> {
  /**
   * Заголовок товара
   * @protected
   */
  protected _title: HTMLElement;

  /**
   * Цена твара
   * @protected
   */
  protected _price: HTMLElement;

  /**
   * Изображение товара
   * @protected
   */
  protected _image?: HTMLImageElement;

  /**
   * Категория продукта
   * @protected
   */
  protected _category?: HTMLElement;

  /**
   * Описание продукта
   * @protected
   */
  protected _description?: HTMLElement;

  /**
   * Кнопка
   * @protected
   */
  protected _button?: HTMLButtonElement;

  /**
   * ID продукта
   * @protected
   */
  protected _id: string;

  /**
   * Конструктор карточки товара
   * @param container контейнер 
   * @param events менеджер событий
   */
  constructor(container: HTMLElement, protected events: EventEmitter) {
    super(container);

    //Инициализация элементов DOM
    this._title = ensureElement<HTMLElement>('.card__title', container);
    this._price = ensureElement<HTMLElement>('.card__price', container);
    this._image = container.querySelector('.card__image');
    this._category = container.querySelector('.card__category');
    this._description = container.querySelector('.card__text');
    this._button = container.querySelector('.card__button');
    this.container.dataset.id = this._id;

    if (this._button) {
      this._button.addEventListener('click', this.handleButtonClick.bind(this));
    }
  }

  /**
   * Обработчик клика
   * @protected
   * @param event 
   */
  protected handleButtonClick(event: Event) {
    event.preventDefault();
    if (this.events && this.id) {
      this.events.emit('card:button-click', { id: this.id });
    }
  }

  /**
   * Устанавливает ID карточки 
   * @param value Уникальный идентификатор
   */
  set id(value: string) {
    this._id = value;
    this.container.dataset.id = value;
  }

  /**
   * Возрващает текущий ID карточки 
   */
  get id(): string {
    return this._id || this.container.dataset.id || '';
  }

  /**
   * Устанавливает изображения продукта
   * @param value URL картинки
   */
  set image(value: string) {
    if (!this._image) return;
    this._image.src = value;
    this._image.alt = this.title;
  }

  /**
   * Возвращает изображение продукта
   */
  get image() {
    return this._image?.src || '';
  }

  /**
   * Устанавливает заголовок товара
   * @param value Текст
   */
  set title(value: string) {
    this.setText(this._title, value);
  }

  /**
   * Возвращает текущий заголовок
   */
  get title() {
    return this._title.textContent || '';
  }

  /*
  *Устанавливает описание товара
  *@param value Текст описания
  */
  set description(value: string) {
    this.setText(this._description, value);
  }

  /**
   * Возвращает текущее описание товара
   */
  get description() {
    return this._description?.textContent || '';
  }

  set category(value: string) {
    if (!this._category) return;

    this.setText(this._category, value);
    Object.values(productCategory).forEach(className => {
      this._category.classList.remove(className);
    });

    const categoryClass = productCategory[value];
    if (categoryClass) this._category.classList.add(categoryClass);
  }

  get category() {
    return this._category?.textContent || '';
  }

  set price(value: number | string | null) {
    const priceText = value === null ? 'Бесценно' : `${value} синапсов`;
    this.setText(this._price, priceText);

    if (this._button) {
      this.setDisabled(this._button, value === null);
    }
  }

  get price() {
    return this._price.textContent || '';
  }

  set button(value: string) {
    if (this._button) this.setText(this._button, value);
  }

}

/**
 * Карточка католога товаров
 */
export class ProductCardCatalog extends ProductCard<ICatalogItem> {
  constructor(container: HTMLElement, events: EventEmitter) {
    super(container, events);

    if (this._button) {
      this._button.addEventListener('click', (e) => {
        e.preventDefault();
        events.emit('catalog:select', { id: this.id });
      });
    } else {
      container.addEventListener('click', () => {
        events.emit('catalog:select', { id: this.id });
      });
    }
  }
}

export class ProductCardPreview extends ProductCard<IProductItem> {
  constructor(container: HTMLElement, events: EventEmitter) {
    super(container, events);

    if (this._button) {
      this._button.addEventListener('click', () => {
        events.emit('button:status', { id: this.id });
      });
    }
  }
}

export class ProductCardBasket extends ProductCard<IBasket> {
  protected _index: HTMLElement;
  protected _deleteButton: HTMLButtonElement;

  constructor(container: HTMLElement, events: EventEmitter) {
    super(container, events);

    this._index = ensureElement<HTMLElement>(`.basket__item-index`, container);
    this._deleteButton = ensureElement<HTMLButtonElement>(
      `.basket__item-delete`,
      container
    );

    this._deleteButton.addEventListener('click', () => {
      events.emit('basket:delete', { id: this.id });
    });
  }

  set index(value: number) {
    this.setText(this._index, value.toString());
  }
}

