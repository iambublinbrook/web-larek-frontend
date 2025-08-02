import { Api, ApiListResponse } from './base/api';
import {
  IProductItem,
  OrderConfirm,
  OrderDataResult,
} from '../types';

// Интерфейс API сервиса
export interface IApiService {
  getProductItem: (id: string) => Promise<IProductItem>;
  getProductList: () => Promise<IProductItem[]>;
  orderItems(order: OrderConfirm): Promise<OrderDataResult>;
}

export class ApiService extends Api implements IApiService {
  readonly cdn: string;

  constructor(cdn: string, baseUrl: string, options?: RequestInit) {
    super(baseUrl, options);
    this.cdn = cdn;
  }

  getProductItem(id: string): Promise<IProductItem> {
    return this.get(`/product/${id}`).then((item: IProductItem) => ({
      ...item,
      image: this.cdn + item.image,
    }));
  }

  getProductList(): Promise<IProductItem[]> {
    return this.get('/product').then((data: ApiListResponse<IProductItem>) =>
      data.items.map((item) => ({
        ...item,
        image: this.cdn + item.image.replace('.svg', '.png'),
      }))
    );
  }

  // Отправка заказа
  orderItems(order: OrderConfirm): Promise<OrderDataResult> {
    return this.post('/order', order).then((data: OrderDataResult) => data);
  }
}