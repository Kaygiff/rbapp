import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, MenuItem, Lang } from './types'

interface CartStore {
  items: CartItem[]
  addItem: (menuItem: MenuItem) => void
  removeItem: (menuItemId: number) => void
  updateQty: (menuItemId: number, qty: number) => void
  clearCart: () => void
  totalItems: () => number
  totalPrice: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (menuItem) => {
        const existing = get().items.find(i => i.menuItem.id === menuItem.id)
        if (existing) {
          set(s => ({ items: s.items.map(i => i.menuItem.id === menuItem.id ? { ...i, quantity: i.quantity + 1 } : i) }))
        } else {
          set(s => ({ items: [...s.items, { menuItem, quantity: 1 }] }))
        }
      },
      removeItem: (id) => set(s => ({ items: s.items.filter(i => i.menuItem.id !== id) })),
      updateQty: (id, qty) => {
        if (qty <= 0) { get().removeItem(id); return }
        set(s => ({ items: s.items.map(i => i.menuItem.id === id ? { ...i, quantity: qty } : i) }))
      },
      clearCart: () => set({ items: [] }),
      totalItems: () => get().items.reduce((s, i) => s + i.quantity, 0),
      totalPrice: () => get().items.reduce((s, i) => s + parseFloat(i.menuItem.price) * i.quantity, 0),
    }),
    { name: 'resulberdy-cart' }
  )
)

interface LangStore {
  lang: Lang
  setLang: (l: Lang) => void
}

export const useLangStore = create<LangStore>()(
  persist(
    (set) => ({ lang: 'ru', setLang: (l) => set({ lang: l }) }),
    { name: 'resulberdy-lang' }
  )
)

// ── Auth store ────────────────────────────────────────────────────────────────

interface ClientProfile {
  id: number
  phone: string
  firstName: string | null
  lastName: string | null
  balance: string
  createdAt: string
}

interface AuthStore {
  token: string | null
  client: ClientProfile | null
  setAuth: (token: string, client: ClientProfile) => void
  updateClient: (client: ClientProfile) => void
  logout: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      token: null,
      client: null,
      setAuth: (token, client) => set({ token, client }),
      updateClient: (client) => set({ client }),
      logout: () => set({ token: null, client: null }),
    }),
    { name: 'resulberdy-auth' }
  )
)
