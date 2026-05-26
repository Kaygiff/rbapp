const BASE = 'https://resulberdybackend-production.up.railway.app'
export const WS_BASE = BASE.replace('https://', 'wss://').replace('http://', 'ws://')

export async function fetchMenu() {
  const res = await fetch(`${BASE}/menu`)
  if (!res.ok) throw new Error('Failed to fetch menu')
  return res.json()
}

export async function fetchOrder(id: number) {
  const res = await fetch(`${BASE}/orders/${id}`)
  if (!res.ok) throw new Error('Order not found')
  return res.json()
}

export interface CreateOrderPayload {
  type: 'DINE_IN' | 'DELIVERY'
  customerName: string
  customerPhone: string
  address?: string
  tableNumber?: string
  comment?: string
  items: { menuItemId: number; quantity: number }[]
}

export async function createOrder(payload: CreateOrderPayload) {
  const res = await fetch(`${BASE}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error ?? 'Failed to create order')
  }
  return res.json()
}
