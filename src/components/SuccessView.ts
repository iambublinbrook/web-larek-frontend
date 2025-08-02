import { EventEmitter } from './base/events';
import { ensureElement } from '../utils/utils';
import { Component } from './base/Component';

interface ISuccess {
  total: number;
}

/**Экран успешного завершения заказа
 * @description Отображает информацию о завершенном заказе
 */
export class SuccessView extends Component<ISuccess> {
  /**Элемент для отображения описания суммы заказа */
  protected _description: HTMLElement;
  /**Кнопка для закрытия окна */
  protected _closeButton: HTMLButtonElement;

  private _total: number = 0;

  /**Создаем экземляр успешного заказа 
   * @param container — котейнер для рендеринга компонента
   * @param events — менеджер событий для взаимодействия с другими компонентами
  */
  constructor(container: HTMLElement, protected events: EventEmitter) {
    super(container);

    this._description = ensureElement<HTMLElement>(
      '.order-success__description',
      this.container
    );

    this._closeButton = ensureElement<HTMLButtonElement>(
      '.order-success__close',
      this.container
    );

    this._closeButton.addEventListener('click', () => {
      this.events.emit('order:finished');
    });
  }

  get total(): number {
    return this._total;
  }

  set total(value: number) {
    this._total = value;
    this.events.emit('success:total-changed', { total: value });
  }

}