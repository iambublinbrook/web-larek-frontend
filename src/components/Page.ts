import { Component } from './base/Component';
import { EventEmitter } from './base/events';
import { ensureElement } from '../utils/utils';

interface IPageState {
  catalog: HTMLElement[];
  counter: number;
  locked: boolean;
}

/**
 * Базовый класс страницы приложения, компонент UI-слоя
 * @description Управляет состоянием и поведением страницы
 */

export class Page extends Component<IPageState> {
  protected _gallery: HTMLElement;
  protected _basketCounter: HTMLElement;
  protected _basketButton: HTMLButtonElement;

  /**Создает экземпляр страницы
   * @param container — контейнер для рендеринга 
   * @param events — менеджер событий
   */
  constructor(container: HTMLElement, protected events: EventEmitter) {
    super(container);

    this._gallery = ensureElement<HTMLElement>('.gallery', this.container);
    this._basketCounter = ensureElement<HTMLElement>(
      '.header__basket-counter',
      this.container
    );
    this._basketButton = ensureElement<HTMLButtonElement>(
      '.header__basket',
      this.container
    );

    this._basketButton.addEventListener('click', () => {
      this.events.emit('basket:open');
    });
  }

  /**Устанавливает список элементов галлерии
   * @param items — масиив элементов для отображения
   */
  set catalog(items: HTMLElement[]) {
    this._gallery.replaceChildren(...items);
  }

  /**Обновляет счетчик товаров в корзине
   * @param value — новое значение счетчика
   */
  set counter(value: number) {
    this.setText(this._basketCounter, String(value));
  }

  /**Блокирует и разблокирует страницу
   * @param value — флаг блокировки
   */
  set locked(value: boolean) {
    if (value) {
      this.container.classList.add('page__wrapper_locked');
    } else {
      this.container.classList.remove('page__wrapper_locked');
    }
  }
}