import type { Lang } from './types'

type Translations = Record<string, Record<Lang, string>>

export const t: Translations = {
  // Nav
  menu: { ru: 'Меню', tk: 'Menýu', en: 'Menu' },
  cart: { ru: 'Корзина', tk: 'Sebet', en: 'Cart' },
  order: { ru: 'Заказ', tk: 'Sargyt', en: 'Order' },
  tracking: { ru: 'Трекинг', tk: 'Yzarlamak', en: 'Tracking' },

  // Menu
  allCategories: { ru: 'Все', tk: 'Hemmesi', en: 'All' },
  addToCart: { ru: 'В корзину', tk: 'Sebede', en: 'Add' },
  unavailable: { ru: 'Нет в наличии', tk: 'Ýok', en: 'Unavailable' },
  search: { ru: 'Поиск блюд...', tk: 'Nahar gözle...', en: 'Search dishes...' },

  // Cart
  emptyCart: { ru: 'Корзина пуста', tk: 'Sebet boş', en: 'Cart is empty' },
  emptyCartSub: { ru: 'Добавьте блюда из меню', tk: 'Menýudan nahar goşuň', en: 'Add dishes from the menu' },
  total: { ru: 'Итого', tk: 'Jemi', en: 'Total' },
  checkout: { ru: 'Оформить заказ', tk: 'Sargyt et', en: 'Place order' },
  remove: { ru: 'Удалить', tk: 'Aýyr', en: 'Remove' },

  // Checkout
  orderType: { ru: 'Тип заказа', tk: 'Sargyt görnüşi', en: 'Order type' },
  dineIn: { ru: 'В зале', tk: 'Zalda', en: 'Dine in' },
  delivery: { ru: 'Доставка', tk: 'Eltip bermek', en: 'Delivery' },
  yourName: { ru: 'Ваше имя', tk: 'Adyňyz', en: 'Your name' },
  yourPhone: { ru: 'Телефон', tk: 'Telefon', en: 'Phone' },
  tableNumber: { ru: 'Номер стола', tk: 'Stol belgisi', en: 'Table number' },
  address: { ru: 'Адрес доставки', tk: 'Eltip beriş salgysy', en: 'Delivery address' },
  comment: { ru: 'Комментарий', tk: 'Bellik', en: 'Comment' },
  commentPlaceholder: { ru: 'Пожелания, аллергии...', tk: 'Islegler, allergýa...', en: 'Wishes, allergies...' },
  placeOrder: { ru: 'Сделать заказ', tk: 'Sargyt ber', en: 'Place order' },
  required: { ru: 'Обязательное поле', tk: 'Hökman dolduryň', en: 'Required field' },
  orderPlaced: { ru: 'Заказ принят!', tk: 'Sargyt kabul edildi!', en: 'Order placed!' },
  orderNumber: { ru: 'Номер заказа', tk: 'Sargyt belgisi', en: 'Order number' },
  trackOrder: { ru: 'Отслеживать заказ', tk: 'Sargyt yzarla', en: 'Track order' },

  // Tracking
  trackYourOrder: { ru: 'Отслеживание заказа', tk: 'Sargydy yzarlamak', en: 'Track your order' },
  enterOrderId: { ru: 'Номер заказа', tk: 'Sargyt belgisi', en: 'Order number' },
  track: { ru: 'Найти', tk: 'Tap', en: 'Find' },
  orderNotFound: { ru: 'Заказ не найден', tk: 'Sargyt tapylmady', en: 'Order not found' },
  yourOrder: { ru: 'Ваш заказ', tk: 'Siziň sargytyňyz', en: 'Your order' },
  orderItems: { ru: 'Состав заказа', tk: 'Sargyt mazmuny', en: 'Order items' },
  liveUpdates: { ru: 'Обновляется в реальном времени', tk: 'Hakyky wagtda täzelenýär', en: 'Live updates' },

  // Statuses
  statusNEW: { ru: 'Новый', tk: 'Täze', en: 'New' },
  statusCONFIRMED: { ru: 'Принят', tk: 'Kabul edildi', en: 'Confirmed' },
  statusCOOKING: { ru: 'Готовится', tk: 'Taýýarlanýar', en: 'Cooking' },
  statusREADY: { ru: 'Готов', tk: 'Taýýar', en: 'Ready' },
  statusDELIVERED: { ru: 'Доставлен', tk: 'Eltildi', en: 'Delivered' },
  statusCANCELLED: { ru: 'Отменён', tk: 'Ýatyryldy', en: 'Cancelled' },

  // Misc
  loading: { ru: 'Загрузка...', tk: 'Ýüklenýär...', en: 'Loading...' },
  error: { ru: 'Ошибка загрузки', tk: 'Ýükleme ýalňyşlygy', en: 'Loading error' },
  retry: { ru: 'Попробовать снова', tk: 'Täzeden synanyş', en: 'Retry' },
  manTenge: { ru: 'TMT', tk: 'TMT', en: 'TMT' },
  items: { ru: 'позиций', tk: 'haryt', en: 'items' },
  connecting: { ru: 'Подключение...', tk: 'Birikýär...', en: 'Connecting...' },
  connected: { ru: 'Онлайн', tk: 'Onlaýn', en: 'Online' },
  disconnected: { ru: 'Офлайн', tk: 'Oflaýn', en: 'Offline' },
}

export function tr(key: string, lang: Lang): string {
  return t[key]?.[lang] ?? key
}
