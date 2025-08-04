import { IAppModel, IOrder, IProductItem, ValidationErrors, Payment } from '../types';
import { IEvents } from '../components/base/events';
import { Model } from './base/base-model';

export class Product extends Model<IProductItem> {
  id: string;
  image: string;
  title: string;
  description: string;
  category: string;
  price: number | null;
  button: string;
}

export class AppState extends Model<IAppModel> {
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

  // методы дял каталога
  setCatalog(items: IProductItem[]): void {
    this.catalog = [...items];
    this.emitChanges('products:changed', { catalog: this.catalog });
  }

  setPreview(item: IProductItem | null) {
    this.preview = item?.id || null;
    if (item) {
      this.emitChanges('preview:changed', item);
    }
  }

  //получаем данные товара из каталога по id
  getProduct(id: string): IProductItem | null {
    return this.catalog.find((item) => item.id === id) ?? null;
  }

  // методы для корзины
  //добавляем товар в корзину
  addProductToBasket(item: IProductItem): void {
    this.basket.push(item);
    this.emitChanges('basket:changed');
  }

  //удаляем товар из корзины
  deleteProductFromBasket(item: IProductItem): void {
    this.basket = this.basket.filter((product) => product.id !== item.id);
    this.emitChanges('basket:changed');
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

  //считаем общую сумму товаров
  getBasketTotal(): number {
    return this.basket.reduce((sum, item) => sum + (item.price ?? 0), 0);
  }

  //считаем количество товаров в корзине
  getBasketCount(): number {
    return this.basket.length;
  }

  //очищаем корзину
  clearBasket(): void {
    this.basket = [];
    this.emitChanges('basket:changed');
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

  // методы для заказа
  setOrderField(field: keyof IOrder, value: string): void {
    this.order[field] = value;
    if (field === 'email' || field === 'phone') {
      this.validateContacts();
    } else {
      this.validateOrder();
    }
  }

  //назанчаем способ оплаты товара и запускаем валидацию товара
  setOrderPayment(value: Payment): void {
    this.order.payment = value;
    this.validateOrder();
  }

  validateOrder(): boolean {
    const errors: ValidationErrors = {};
    if (!this.order.payment) {
      errors.payment = 'Необходимо выбрать способ оплаты';
    }

    if (!this.order.address) {
      errors.address = 'Необходимо указать адрес';
    }

    this.formErrors = errors;
    this.emitChanges('orderFormErrors:change', this.formErrors);
    return Object.keys(errors).length === 0;
  }

  validateContacts(): boolean {
    const errors: ValidationErrors = {};
    if (!this.order.email) {
      errors.email = 'Необходимо указать email';
    } else if (!this.order.email.includes('@')) {
      errors.email = 'Некорректный email';
    }

    const phone = this.order.phone;


    if (!this.order.phone) {
      errors.phone = 'Необходимо указать телефон';
    } else {
      const normalizedPhone = phone.trim().replace(/\s+/g, ' ').replace(/[\u00A0]/g, ' ');
      const phoneRegex = /^(\+7|8)[\d\s\-\(\)]{9,15}$/;

      if (!phoneRegex.test(normalizedPhone)) {
        errors.phone = 'Некорректный формат телефона';
      }
    }

    this.formErrors = errors;
    this.emitChanges('contactsFormErrors:change', this.formErrors);
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
    this.emitChanges('order:changed');
  }
}