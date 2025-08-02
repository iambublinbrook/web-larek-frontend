import './scss/styles.scss';
import { EventEmitter } from './components/base/events';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

//модели
import { AppState } from './components/AppState';

// Сервисы
import { ApiService } from './components/ApiService';

// Компоненты UI
import { Page } from './components/Page';
import { Modal } from './components/Modal';
import { OrderForm } from './components/form/OrderForm';
import { OrderContacts } from './components/form/ContactsForm';
import { SuccessView } from './components/SuccessView';
import { Basket } from './components/Basket';

// Карточки товаров
import {
  ProductCardBasket,
  ProductCardCatalog,
  ProductCardPreview
} from './components/ProductCard';

// Типы
import { IProductItem, IOrder } from './types';

// Создаем экземпляры
const events = new EventEmitter();
const api = new ApiService(CDN_URL, API_URL);

// Шаблоны из DOM
const templates = {
  basket: ensureElement<HTMLTemplateElement>('#basket'),
  order: ensureElement<HTMLTemplateElement>('#order'),
  contacts: ensureElement<HTMLTemplateElement>('#contacts'),
  success: ensureElement<HTMLTemplateElement>('#success'),
  cardCatalog: ensureElement<HTMLTemplateElement>('#card-catalog'),
  cardPreview: ensureElement<HTMLTemplateElement>('#card-preview'),
  cardBasket: ensureElement<HTMLTemplateElement>('#card-basket')
};

Object.entries(templates).forEach(([name, template]) => {
  if (!template) throw new Error(`Шаблон ${name} не найден`);
});

// Инициализация компонентов
const components = {
  page: new Page(document.body, events),
  modal: new Modal(ensureElement<HTMLElement>('#modal-container'), events),
  basket: new Basket(cloneTemplate(templates.basket), events),
  orderForm: new OrderForm(cloneTemplate(templates.order), events),
  orderContacts: new OrderContacts(cloneTemplate(templates.contacts), events),
  success: new SuccessView(cloneTemplate(templates.success), events)
};

// Модели
const appState = new AppState({}, events);

// Загружаем список товаров
/*api
  .getProductList()
  .then((items) => {
    appState.setCatalog(items);
  })
  .catch((error) => {
    console.error('Ошибка загрузки товаров:', error);
  });*/

api.getProductList()
  .then((items) => {
    appState.setCatalog(items);
  })
  .catch((error) => {
    console.error('Ошибка загрузки товаров:', error);

    const errorMessage = document.createElement('div');
    errorMessage.classList.add('error-message');
    errorMessage.textContent = 'Не удалось загрузить товары. Попробуйте позже';

    components.modal.render({
      content: errorMessage // Теперь передаем HTMLElement
    });
  });

// События
// Обновление каталога 
events.on('products:changed', () => {
  components.page.catalog = appState.catalog.map((item) => {
    const productCardCatalog = new ProductCardCatalog(
      cloneTemplate(templates.cardCatalog),
      events
    );
    return productCardCatalog.render(item);
  });
});

// При выборе товара в каталоге — показать превью
events.on('catalog:select', ({ id }: { id: string }) => {
  const item = appState.getProduct(id);
  appState.setPreview(item);
});

// Обновление превью товара
events.on('preview:changed', (item: IProductItem) => {
  const productCardPreview = new ProductCardPreview(
    cloneTemplate(templates.cardPreview),
    events
  );
  components.modal.render({
    content: productCardPreview.render({
      ...item,
      button: appState.getButtonText(item),
    }),
  });
});

// Добавление/удаление товара из корзины
events.on('button:status', ({ id }: { id: string }) => {
  const item = appState.getProduct(id);
  if (item) {
    const wasAdded = appState.toggleBasketItem(item);
    if (wasAdded) {
      components.modal.render({
        content: components.basket.render()
      });
    }
  }
});

// Открытие корзины
events.on('basket:open', () => {
  components.modal.render({
    content: components.basket.render(),
  });
});

// Обновление корзины
events.on('basket:changed', () => {
  components.page.counter = appState.getBasketCount();
  components.basket.total = appState.getBasketTotal();
  components.basket.items = appState.basket.map((item) => {
    const productCardBasket = new ProductCardBasket(
      cloneTemplate(templates.cardBasket),
      events
    );
    productCardBasket.index = appState.getProductIndex(item);
    return productCardBasket.render({
      ...item,
    });
  });
});

// Удаление товара из корзины 
events.on('basket:delete', ({ id }: { id: string }) => {
  const item = appState.getProduct(id);
  appState.deleteProductFromBasket(item);
});

// Открытие формы заказа 
events.on('order:open', () => {
  components.orderForm.clearPayment();
  components.modal.render({
    content: components.orderForm.render({
      payment: appState.order.payment,
      address: appState.order.address,
      valid: appState.validateOrder(),
      errors: [],
    }),
  });
});

// Изменение полей формы
events.on(
  'input:change',
  (data: {
    field: keyof Pick<IOrder, 'address' | 'phone' | 'email'>;
    value: string;
  }) => {
    appState.setOrderField(data.field, data.value);
  }
);

// Изменение способа оплаты
events.on(
  'payment:change',
  (data: { payment: keyof Pick<IOrder, 'payment'>; button: HTMLElement }) => {
    components.orderForm.togglePayment(data.button);
    appState.setOrderPayment(data.payment);
    appState.validateOrder();
  }
);

// Обновление ошибок валидации
events.on('formErrors:changed', (errors: Partial<IOrder>) => {
  const { payment, address, email, phone } = errors;
  const createValidationError = (
    errorsObject: Record<string, string>
  ): string =>
    Object.values(errorsObject)
      .filter(Boolean)
      .join(' и ');

  components.orderForm.valid = !payment && !address;
  components.orderForm.errors = createValidationError({ payment, address });
  components.orderContacts.valid = !email && !phone;
  components.orderContacts.errors = createValidationError({ email, phone });
});

// Переход к форме контактов
events.on('order:submit', () => {
  components.modal.render({
    content: components.orderContacts.render({
      email: appState.order.email,
      phone: appState.order.phone,
      valid: appState.validateOrder(),
      errors: [],
    }),
  });
});

// Отправка заказа
events.on('contacts:submit', () => {
  api
    .orderItems(appState.getOrderData())
    .then(() => {
      components.modal.render({
        content: components.success.render({
          total: appState.getBasketTotal(),
        }),
      });
      appState.clearBasket();
      appState.clearOrder();
    })
    .catch(err => {
      console.error('Ошибка заказа:', err);
    });
});

// Закрытие успешного заказа
events.on('order:finished', () => {
  components.modal.close();
});

// Блокировка страницы при открытом модальном окне
events.on('modal:open', () => {
  components.page.locked = true;
});

events.on('modal:close', () => {
  components.page.locked = false;
});
