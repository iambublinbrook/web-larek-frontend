import { Component } from './base/Component';
import { EventEmitter } from './base/events';
import { ensureElement } from '../utils/utils';
import { IForm } from '../types';

/**Абстрактный класс формы
 * @description базовый клсс для всех форм
 * @template Т — тип данных формы
 */
export abstract class Form<T> extends Component<IForm> {
  /**
   * Кнопка отправки формы
   */
  protected _submit: HTMLButtonElement;
  /**
   * Элемент для отображения ошибок 
   * */
  protected _errors: HTMLElement;
  /*
  *Элемент для кнопки оплаты 
  */
  protected _buttons: HTMLButtonElement[];

  /**
   * Создает экземляр формы
   * @param container: HTMLFormElement
   * @param events: EventEmitter
   */
  constructor(
    protected container: HTMLFormElement,
    protected events: EventEmitter
  ) {
    super(container);

    // Bнициализация элементов
    this._submit = ensureElement<HTMLButtonElement>(
      'button[type=submit]',
      this.container
    );
    this._errors = ensureElement<HTMLElement>('.form__errors', this.container);
    this._buttons = Array.from(
      container.querySelectorAll<HTMLButtonElement>('.button_alt')
    );

    // Обработчики событий ввода
    container.addEventListener('input', (e: Event) => {
      const target = e.target as HTMLInputElement;
      const field = target.name as keyof T;
      const value = target.value;
      this.onInputChange(field, value);
    });

    // Обработчик отправки формы
    container.addEventListener('submit', (e: Event) => {
      e.preventDefault();
      this.events.emit(`${this.container.name}:submit`);
    });
  }

  /**
   * Обработчик изменения поля формы
   * @param field — имя поля(ключ Т)
   * @param value — новое значение
   */
  protected onInputChange(field: keyof T, value: string): void {
    this.events.emit(`orderInput:change`, {
      field,
      value,
    });
  }

  /**
   * Управляет доступностью кнопки отправления
   * @param value — флаг валидности
   */
  set valid(value: boolean) {
    this._submit.disabled = !value;
  }

  /**
   * Устанавливает текст ошибок
   * @param value — текст ошибки
   */
  set errors(value: string) {
    this.setText(this._errors, value);
  }

  /**
   * Отрисовывет форму с текущим состоянием
   * @param state — сотстояние формы
   * @returns HTMLElement формы
   */
  render(state: Partial<T> & IForm): HTMLFormElement {
    super.render(state);
    return this.container;
  }
}