# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```
Описание проекта: 
основные функции проекта:
Архитектура проекта:

Типы данных:

Тип способа оплаты:
export type Payment = 'card' | 'cash' | '';

Тип данных для оплаты:
export type OrderPayment = Pick<IOrder, 'payment' | 'address'>;

Тип контактных данных:
export type Contacts = Pick<IOrder, 'email' | 'phone'>;



## ApiService
Класс для взаимодействия с API магазина

### Поля:
- `cdn`: URL CDN для изображений
- `baseUrl`: базовый URL API

### Методы:
- `getProductItem(id: string)`: получение продукта по ID
- `getProductList()`: получение каталога товаров
- `orderItems(order: OrderConfirm)`: оформление заказа

## Form
Общий класс ддя всех форм приложения

### Свойства:
- `_submit`: кнопка отправки
- `_errors`: элемент для ошибок
- `_buttons`: кнопка оплаты

### Методы:
- `onInputChange`: обработка изменения полей
- `valid`: управление доступностью кнопки
- `errors`: установка текста ошибок
- `render`: отрисовка формы

## Modal
Модальное окно приложения

### Свойства:
- `_content`: контейнер для содержимого
- `_closeButton`: кнопка закрытия

### Методы:
- `content`: установка содержимого
- `open()`: открытие окна
- `close()`: закрытие окна
- `render()`: отрисовка и открытие модального окна

## Page
Класс страницы приложения

### Свойства:
- `_gallery`: контейнер галереи
- `_basketCounter`: счетчик товаров
- `_basketButton`: кнопка корзины

### Методы:
- `catalog`: установка элементов галереи
- `counter`: обновление счетчика
- `locked`: блокировка/разблокировка страницы

## SuccessView
Экран успешного заказа

### Свойства:
- `_description`: элемент для отображения суммы
- `_closeButton`: кнопка закрытия

### Методы:
- `total`: установка суммы заказа
