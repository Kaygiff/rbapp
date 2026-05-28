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
  type: 'DELIVERY'
  customerName: string
  customerPhone: string
  address: string
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
    throw new Error((err as any).error ?? 'Failed to create order')
  }
  return res.json()
}

// ── Client Auth ───────────────────────────────────────────────────────────────

export async function clientRegister(payload: { phone: string; password: string; firstName?: string; lastName?: string }) {
  const res = await fetch(`${BASE}/clients/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error((e as any).error ?? 'Registration failed') }
  return res.json()
}

export async function clientLogin(payload: { phone: string; password: string }) {
  const res = await fetch(`${BASE}/clients/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error((e as any).error ?? 'Login failed') }
  return res.json()
}

export async function fetchClientMe(token: string) {
  const res = await fetch(`${BASE}/clients/me`, { headers: { Authorization: `Bearer ${token}` } })
  if (!res.ok) throw new Error('Unauthorized')
  return res.json()
}

export async function updateClientMe(token: string, data: { firstName?: string; lastName?: string }) {
  const res = await fetch(`${BASE}/clients/me`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Update failed')
  return res.json()
}

export async function fetchClientOrders(token: string) {
  const res = await fetch(`${BASE}/clients/me/orders`, { headers: { Authorization: `Bearer ${token}` } })
  if (!res.ok) throw new Error('Unauthorized')
  return res.json()
}

export async function fetchClientAddresses(token: string) {
  const res = await fetch(`${BASE}/clients/me/addresses`, { headers: { Authorization: `Bearer ${token}` } })
  if (!res.ok) throw new Error('Unauthorized')
  return res.json()
}

export async function addClientAddress(token: string, data: { label: 'home' | 'work' | 'other'; address: string }) {
  const res = await fetch(`${BASE}/clients/me/addresses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed')
  return res.json()
}

export async function deleteClientAddress(token: string, id: number) {
  const res = await fetch(`${BASE}/clients/me/addresses/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error('Failed')
  return res.json()
}
