import { Form } from '../Form';
import { EventEmitter } from '../base/events';
import { Contacts } from '../../types';

/**
 * Класс формы контактов для обработки информации от контактов заказа
 */
export class OrderContacts extends Form<Contacts> {
  /**
   * Элемент формы для ввода электронной почты
   */
  protected _email: HTMLInputElement;
  /**
   * Элемент формы для ввода номера телефона
   */
  protected _phone: HTMLInputElement;

  /**
   * Конструктор формы контактов
   * @param container Родительский элемент формы
   * @param events Менеджер событий для взаимодействия с формой
   */
  constructor(container: HTMLFormElement, events: EventEmitter) {
    super(container, events);

    // Получаем ссылки на элементы формы
    this._email = container.elements.namedItem('email') as HTMLInputElement;
    this._phone = container.elements.namedItem('phone') as HTMLInputElement;

    this.container.addEventListener('submit', (e) => {
      e.preventDefault();
      this.events.emit('contacts:submit');
    });
  }

  /**
   * Установка значения электронной почты
   * @param value Адрес электронной почты
   */
  set email(value: string) {
    this._email.value = value;
  }

  /**
   * Установка значения телефона
    * 
   * @param value Номер телефона
   */
  set phone(value: string) {
    this._phone.value = value;
  }

  set valid(value: boolean) {
    this._submit.disabled = !value;
  }
}
