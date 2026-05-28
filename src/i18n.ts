import type { Lang } from './types'

const translations = {
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
  clearCart: { ru: 'Очистить корзину', tk: 'Sebedi arassala', en: 'Clear cart' },

  // Checkout
  yourName: { ru: 'Ваше имя', tk: 'Adyňyz', en: 'Your name' },
  yourPhone: { ru: 'Телефон', tk: 'Telefon', en: 'Phone' },
  address: { ru: 'Адрес доставки', tk: 'Eltip beriş salgysy', en: 'Delivery address' },
  comment: { ru: 'Комментарий', tk: 'Bellik', en: 'Comment' },
  commentPlaceholder: { ru: 'Пожелания, аллергии...', tk: 'Islegler, allergýa...', en: 'Wishes, allergies...' },
  placeOrder: { ru: 'Сделать заказ', tk: 'Sargyt ber', en: 'Place order' },
  required: { ru: 'Обязательное поле', tk: 'Hökman dolduryň', en: 'Required field' },
  invalidPhone: { ru: 'Неверный формат телефона', tk: 'Nädogry telefon formaty', en: 'Invalid phone format' },
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
  connecting: { ru: 'Подключение...', tk: 'Birikýär...', en: 'Connecting...' },
  connected: { ru: 'Онлайн', tk: 'Onlaýn', en: 'Online' },
  disconnected: { ru: 'Офлайн', tk: 'Oflaýn', en: 'Offline' },
  notFound: { ru: 'Страница не найдена', tk: 'Sahypa tapylmady', en: 'Page not found' },
  goHome: { ru: 'На главную', tk: 'Baş sahypa', en: 'Go home' },

  // Auth & Profile
  login: { ru: 'Войти', tk: 'Gir', en: 'Login' },
  register: { ru: 'Регистрация', tk: 'Hasap aç', en: 'Register' },
  profile: { ru: 'Профиль', tk: 'Profil', en: 'Profile' },
  firstName: { ru: 'Имя', tk: 'Ady', en: 'First name' },
  lastName: { ru: 'Фамилия', tk: 'Familiýasy', en: 'Last name' },
  password: { ru: 'Пароль', tk: 'Açar söz', en: 'Password' },
  passwordMin: { ru: 'Минимум 6 символов', tk: 'Iň az 6 nyşan', en: 'Minimum 6 characters' },
  balance: { ru: 'Баланс', tk: 'Balans', en: 'Balance' },
  balanceSub: { ru: 'Пополняется через промокоды', tk: 'Promo kodlar arkaly doldurylýar', en: 'Topped up via promo codes' },
  myOrders: { ru: 'Мои заказы', tk: 'Meniň sargytlarym', en: 'My orders' },
  myAddresses: { ru: 'Мои адреса', tk: 'Meniň salgylarym', en: 'My addresses' },
  language: { ru: 'Язык', tk: 'Dil', en: 'Language' },
  callOperator: { ru: 'Звонок оператору', tk: 'Operatora jaň et', en: 'Call operator' },
  aboutUs: { ru: 'О нас', tk: 'Biz hakda', en: 'About us' },
  logout: { ru: 'Выйти', tk: 'Çyk', en: 'Log out' },
  save: { ru: 'Сохранить', tk: 'Sakla', en: 'Save' },
  saved: { ru: 'Сохранено', tk: 'Saklandy', en: 'Saved' },
  noOrders: { ru: 'Заказов пока нет', tk: 'Heniz sargyt ýok', en: 'No orders yet' },
  noAddresses: { ru: 'Адресов пока нет', tk: 'Heniz salgyt ýok', en: 'No addresses yet' },
  label_home: { ru: 'Дом', tk: 'Öý', en: 'Home' },
  label_work: { ru: 'Работа', tk: 'Iş', en: 'Work' },
  label_other: { ru: 'Другое', tk: 'Başga', en: 'Other' },
} as const

export type TranslationKey = keyof typeof translations

export function tr(key: TranslationKey | string, lang: Lang): string {
  return (translations as Record<string, Record<Lang, string>>)[key]?.[lang] ?? key
}
