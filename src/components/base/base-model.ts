import { IEvents } from "./events";

/**
 * Type guard: проверяет является ли объект экземпляром Model
 */
export const isModel = (obj: unknown): obj is Model<any> => {
  return obj instanceof Model;
}

/**
 * Абстрактный базовый клсс для всех моделей приложения
 * @template T — тип данных модели
 */
export abstract class Model<T> {
  /**
   * Создает можель с начальными данными и подключает шину событий
   * @param data — данные для инициализации
   * @param events — экзепляр шины события
   */
  constructor(data: Partial<T>, protected events: IEvents) {
    Object.assign(this, data);
  }

  /**
   * Уведомляет о произошедшем изменении
   * @param event — имя события
   * @param payload — дополнительные данные
   */
  emitChanges(event: string, payload?: object) {
    this.events.emit(event, payload ?? {});
  }
}