import { Component } from './base/Component';
import { ensureElement } from '../utils/utils';
import { EventEmitter } from './base/events';

// Интерфейс данных для модального окна(используется только внутри модалки)
interface IModal {
  content: HTMLElement;
}

/**Модальное окно приложения
 * @description Управляет отображением и поведением модального окна
 */
export class Modal extends Component<IModal> {
  /**
   * контейнер для содержимого модального окна 
   * */
  protected _content: HTMLElement;

  /**
   * кнопка закрытия модального окна
   * */
  protected _closeButton: HTMLButtonElement;

  /**
     * создает экземпляр модального окна
     * @param container - контейнер для рендеринга модального окна
     * @param events - менеджер событий для взаимодействия с другими компонентами
     */
  constructor(container: HTMLElement, protected events: EventEmitter) {
    super(container);

    // находим элементы 
    this._content = ensureElement<HTMLElement>(
      '.modal__content',
      this.container
    );
    this._closeButton = ensureElement<HTMLButtonElement>(
      '.modal__close',
      this.container
    );

    // добавляем орбаботчики событий
    this._closeButton.addEventListener('click', this.close.bind(this));
    this.container.addEventListener('click', this.close.bind(this));
    this._content.addEventListener('click', (event) => event.stopPropagation());
  }

  /** устанавливаем новое содержимое модального окна
   * @param value — элемент с новым содержимым
   * */
  set content(value: HTMLElement) {
    this._content.replaceChildren(value);
  }

  /**открываем модальное окно */
  open(): void {
    this.container.classList.add('modal_active');
    document.body.style.overflow = 'hidden';
    document.body.style.width = '100%';
    this.events.emit('modal:open');
  }

  /**закрываем модальное окно */
  close(): void {
    this.container.classList.remove('modal_active');
    document.body.style.overflow = '';
    document.body.style.width = '';
    this._content.replaceChildren();
    this.events.emit('modal:close');
  }

  /**отрисовываем модальное окно и открываем его 
   * @param data — данные для инициализации модального окна
   * @returns Контейнер модального окна
  */
  render(data: IModal): HTMLElement {
    super.render(data);
    this.open();
    return this.container;
  }
}