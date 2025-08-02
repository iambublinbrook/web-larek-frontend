import { IAppModel, IOrder, IProductItem, ValidationErrors } from '../types';
import { IEvents } from '../components/base/events';


export class AppState<T> implements IAppModel {
  catalog: IProductItem[] = [];
  preview: string | null = null;
  basket: IProductItem[] = [];
  order: IOrder = {
    items: '',
    payment: '',
    address: '',
    email: '',
    phone: ''
  }
  formErrors: ValidationErrors = {};

  constructor(protected data: Partial<T>, protected events: IEvents) {
    Object.assign(this, data);
  }

  // методы дял каталога
  setCatalog(items: IProductItem[]): void {
    this.catalog = [...items];
    this.events.emit('products:changed', { catalog: this.catalog });
  }

  setPreview(item: IProductItem | null) {
    this.preview = item?.id || null;
    if (item) this.events.emit('preview:changed', item);
  }

  //получаем данные товара из каталога по id
  getProduct(id: string): IProductItem | null {
    return this.catalog.find((item) => item.id === id) ?? null;
  }

  // методы для корзины
  addProductToBasket(item: IProductItem): void {
    this.basket.push(item);
    this.events.emit('basket:changed');
  }

  deleteProductFromBasket(item: IProductItem): void {
    this.basket = this.basket.filter((product) => product.id !== item.id);
    this.events.emit('basket:changed');
  }

  // переключаем наличие товара в корзине
  toggleBasketItem(item: IProductItem): boolean {
    const itemInBasket = this.basket.some(product => product.id === item.id);
    if (itemInBasket) {
      this.deleteProductFromBasket(item);
    } else {
      this.addProductToBasket(item);
    }
    return !itemInBasket;
  }

  getBasketTotal(): number {
    return this.basket.reduce((total, item) => total + item.price, 0);
  }

  getBasketCount(): number {
    return this.basket.length;
  }

  clearBasket(): void {
    this.basket = [];
    this.events.emit('basket:changed');
  }

  // возвращает индекс для нумерации списка в корзине
  getProductIndex(item: IProductItem): number {
    return this.basket.findIndex((product) => product.id === item.id) + 1;
  }

  getButtonText(item: IProductItem) {
    if (!item.price) {
      return 'Не продается';
    }

    if (!this.basket.some((product) => product.id === item.id)) {
      return 'Купить';
    } else {
      return 'Удалить из корзины';
    }
  }

  // методы дял заказа
  setOrderField(field: keyof IOrder, value: string): void {
    this.order[field] = value;
    this.validateOrder();
  }

  //назанчаем способ оплаты товара
  setOrderPayment(value: string): void {
    this.order.payment = value;
  }

  validateOrder(): boolean {
    const errors: ValidationErrors = {};
    if (!this.order.payment) {
      errors.payment = 'Необходимо выбрать способ оплаты';
    }

    if (!this.order.address) {
      errors.address = 'Необходимо указать адрес';
    }

    if (!this.order.email) {
      errors.email = 'Необходимо указать email';
    } else if (!this.order.email.includes('@')) {
      errors.email = 'Некорректный email';
    }

    if (!this.order.phone) {
      errors.phone = 'Необходимо указать телефон';
    } else if (!/^\+?[\d\s\-()]{10,15}$/.test(this.order.phone)) {
      errors.phone = 'Некорректный формат телефона';
    }

    this.formErrors = errors;
    this.events.emit('formErrors:changed', this.formErrors);
    return Object.keys(errors).length === 0;
  }

  //формирует данные заказа
  getOrderData(): IOrder & { items: string[]; total: number } {
    return {
      ...this.order,
      items: this.basket.map(item => item.id),
      total: this.getBasketTotal()
    };
  }

  clearOrder(): void {
    this.order = {
      items: '',
      payment: '',
      address: '',
      email: '',
      phone: ''
    };
    this.events.emit('order:changed');
  }
}