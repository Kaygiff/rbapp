# Resulberdy PWA

Клиентское PWA-приложение для ресторана Resulberdy.

## Стек
- React 18 + Vite + TypeScript
- TanStack Query — кэш и загрузка данных
- Zustand — корзина (persisted) + язык
- React Router v6 — навигация
- vite-plugin-pwa (Workbox) — Service Worker, офлайн, установка
- lucide-react — иконки

## Запуск (dev)
```bash
bun install   # или npm install
bun run dev   # или npm run dev
```

## Билд
```bash
npm run build
# Собранное приложение в dist/
```

## Деплой на Vercel
1. Загрузи этот репозиторий на GitHub
2. Подключи к Vercel → New Project
3. Framework preset: Vite
4. Build command: `npm run build`
5. Output dir: `dist`
6. Деплой!

## Деплой на Netlify
```
Build command: npm run build
Publish dir: dist
```
Добавь файл `public/_redirects`:
```
/* /index.html 200
```

## Бэкенд
`https://resulberdybackend-production.up.railway.app`

## Экраны
- `/` — Меню (категории, поиск, корзина)
- `/cart` — Корзина
- `/checkout` — Оформление заказа
- `/tracking` — Трекинг статуса по WebSocket

## Установка как приложение
- **iOS**: Safari → Поделиться → «На экран Домой»
- **Android**: Chrome → ⋮ → «Добавить на главный экран»
