// Интерфейс товара
export interface IProductItem {
  id: string;
  image: string;
  title: string;
  description: string;
  category: string;
  price: number | null;
  button: string;
}

// Интерфейс заказа товара
export interface IOrder {
  items: string | string[];
  payment: Payment | string;
  address: string;
  email: string;
  phone: string;
}

// Интерфейс подтверждения заказа
export interface OrderConfirm extends IOrder {
  total: number;
  items: string[];
}

// Интерфейс данных о товарах
export interface IProductData {
  total: number;
  items: IProductItem[];
}

export interface IBasket {
  items: IProductItem[];
  total: number;
  addItem(item: IProductItem): void;
  removeItem(id: string): void;
  clear(): void;
}

// Интерфейс результата заказа
export interface OrderDataResult {
  id: string;
  total: number;
}

export interface IOrderFormData {
  payment: string;
  address: string;
  valid: boolean;
  errors: ValidationErrors;
}

// Интерфейс состояние формы
export interface IForm {
  valid?: boolean;
  errors?: string[];
}

// Тип элемента каталога
export type ICatalogItem = Omit<IProductItem, 'description'>;


// Тип категорий товаров
export type IProductCategory = { [key: string]: string };


// Тип способа оплаты
export type Payment = 'card' | 'cash' | '';


// Тип данных для оплаты
export type OrderPayment = Pick<IOrder, 'payment' | 'address'>;

// Тип контактных данных
export type Contacts = Pick<IOrder, 'email' | 'phone'>;

// Тип ошибок валидации
export type ValidationErrors = Partial<Record<keyof IOrder, string>>;

// Тип для состояния формы
export type OrderFormState = Partial<OrderPayment> & IForm;

// Тип события изменения оплаты
export type PaymentChangeEvent = {
  payment: Payment;
  button: HTMLElement;
};

// Тип события изменения полей
export type OrderInputChangeEvent = {
  field: keyof OrderPayment | keyof Contacts;
  value: string;
};

// Интерфейс модели приложения
export interface IAppModel {
  catalog: IProductItem[];
  preview: string | null;
  basket: IProductItem[];
  order: IOrder | null;
  formErrors: ValidationErrors;

  setCatalog(items: IProductItem[]): void;
  setPreview(item: IProductItem): void;
  getProduct(id: string): IProductItem;
  addProductToBasket(item: IProductItem): void;
  deleteProductFromBasket(item: IProductItem): void;
  toggleBasketItem(item: IProductItem): void;
  getButtonText(item: IProductItem): void;
  getBasketTotal(): number;
  getBasketCount(): number;
  getProductIndex(item: IProductItem): number;
  setOrderField(field: keyof IOrder, value: string): void;
  setOrderPayment(value: string): void;
  getOrderData(): void;
  validateOrder(): boolean;
  clearBasket(): void;
  clearOrder(): void;
}

