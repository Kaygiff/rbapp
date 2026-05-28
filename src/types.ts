export type OrderStatus = 'NEW' | 'CONFIRMED' | 'COOKING' | 'READY' | 'DELIVERED' | 'CANCELLED'
export type OrderType = 'DELIVERY'
export type Lang = 'ru' | 'tk' | 'en'

export interface Category {
  id: number
  name: string
  slug: string
  order: number
  items: MenuItem[]
}

export interface MenuItem {
  id: number
  categoryId: number | null
  name: string
  description: string | null
  price: string
  imageUrl: string | null
  available: boolean
  order: number
}

export interface OrderItem {
  id: number
  orderId: number
  menuItemId: number | null
  name: string
  price: string
  quantity: number
}

export interface Order {
  id: number
  type: OrderType
  status: OrderStatus
  customerName: string
  customerPhone: string
  address: string | null
  tableNumber: string | null
  comment: string | null
  total: string
  createdAt: string
  updatedAt: string
  items: OrderItem[]
}

export interface CartItem {
  menuItem: MenuItem
  quantity: number
}
