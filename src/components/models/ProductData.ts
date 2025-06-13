import { productCategory } from '../../utils/constants';

export interface IProductItem {
  id: string;
  image: string;
  title: string;
  description: string;
  category: string;
  price: number | null;
  button?: string;
}

export interface ICatalogItem extends Omit<IProductItem, 'description'> { }
export interface IBasketProduct extends Pick<IProductItem, 'id' | 'title' | 'price'> {
  index?: number;
}

export class ProductModel implements IProductItem {
  constructor(
    public id: string,
    public image: string,
    public title: string,
    public description: string,
    public category: string,
    public price: number | null
  ) { }

  get categoryClass(): string {
    return productCategory[this.category] || '';
  }
}