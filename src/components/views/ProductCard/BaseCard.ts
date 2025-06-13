import { Component } from '../../base/Component';
import { ensureElement } from '../../utils/utils';
import { productCategory } from '../../utils/constants';
import { IProductItem, ICatalogItem, IBasketProduct } from '../../types/products';
import { EventEmitter } from '../../base/events';

export abstract class ProductCard<T extends IProductItem> extends Component<T> {
  protected _title: HTMLElement;
  protected _price: HTMLElement;
  protected _image?: HTMLImageElement;
  protected _category?: HTMLElement;
  protected _description?: HTMLElement;
  protected _button?: HTMLButtonElement;
  protected _id: string;

  constructor(container: HTMLElement, protected events?: EventEmitter) {
    super(container);

    this._title = ensureElement<HTMLElement>('.card__title', container);
    this._price = ensureElement<HTMLElement>('.card__price', container);
    this._image = container.querySelector('.card__image');
    this._category = container.querySelector('.card__category');
    this._description = container.querySelector('.card__text');
    this._button = container.querySelector('.card__button');
  }

  render(data: Partial<T>): HTMLElement {
    if (data.id) this.id = data.id;
    if (data.title) this.title = data.title;
    if (data.price !== undefined) this.price = data.price;
    if (data.image) this.image = data.image;
    if (data.category) this.category = data.category;
    if (data.description) this.description = data.description;
    if (data.button) this.button = data.button;

    return this.container;
  }

  set id(value: string) {
    this._id = value;
    this.container.dataset.id = value;
  }

  get id(): string {
    return this._id || this.container.dataset.id || '';
  }

  set image(value: string) {
    this.setImage(this._image, value, this.title);
  }

  get image() {
    return this._image.src || '';
  }

  set title(value: string) {
    this.setText(this._title, value);
  }

  get title() {
    return this._title.textContent || '';
  }

  set description(value: string) {
    this.setText(this._description, value);
  }

  get description() {
    return this._description.textContent || '';
  }

  set category(value: string) {
    this.setText(this._category, value);
    if (this._category) {
      Object.values(productCategory).forEach((className) => {
        this._category.classList.remove(className);
      });
      const categoryClass = productCategory[value];
      if (categoryClass) {
        this._category.classList.add(categoryClass);
      }
    }
  }

  get category() {
    return this._category?.textContent || '';
  }

  set price(value: string) {
    if (value) {
      this.setText(this._price, `${value} синапсов`);
    } else {
      this.setText(this._price, `Бесценно`);
      this.setDisabled(this._button, true);
    }
  }

  get price() {
    return this._price.textContent;
  }

  set button(value: string) {
    this.setText(this._button, value);
  }
}