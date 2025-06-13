//Типы товаров и каталога

//Интерфейс товара
export interface IProductItem {
  id: string;
  image: string;
  title: string;
  description: string;
  category: string;
  price: number | null;
  button?: string;
}

//Интерфейс данных о товарах
export interface IProductData {
  total: number;
  items: IProductItem[];
}

// Типы для UI компонентов
export type ICatalogItem = Omit<IProductItem, 'description'>;
export type IBasketProduct = Pick<IProductItem, 'id' | 'title' | 'price'>;
export type IProductCategory = { [key: string]: string };