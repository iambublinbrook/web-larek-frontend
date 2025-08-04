//базовый абстрактный класс для всех UI-компонентов

export abstract class Component<T> {
  protected constructor(protected readonly container: HTMLElement) { }

  // Переключаем класс у элемента
  toggleClass(element: HTMLElement, className: string, force?: boolean) {
    element.classList.toggle(className, force);
  }

  // Устанавливаем текстовое содержимое элемента
  protected setText(element: HTMLElement | null, value: string): void {
    if (element) element.textContent = value;
  }

  // Скрываем элемент
  protected setHidden(element: HTMLElement) {
    element.style.display = 'none';
  }

  // Показываем элемент
  protected setVisible(element: HTMLElement) {
    element.style.removeProperty('display');
  }

  // Включаем или выключаем disabled
  setDisabled(element: HTMLElement, state: boolean): void {
    if (element) {
      if (state) element.setAttribute('disabled', 'disabled');
      else element.removeAttribute('disabled');
    }
  }

  // Устанавливаем изображение у элемента
  protected setImage(element: HTMLImageElement, src: string, alt?: string) {
    if (element) {
      element.src = src;
      if (alt) {
        element.alt = alt;
      }
    }
  }

  // Принимаем данные, обновляем поля класса и возвращаем корневой элемент
  render(data?: Partial<T>): HTMLElement {
    Object.assign(this as object, data ?? {});
    return this.container;
  }
}