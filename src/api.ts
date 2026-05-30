const BASE = 'https://resulberdybackend-production.up.railway.app'
export const WS_BASE = BASE.replace('https://', 'wss://').replace('http://', 'ws://')

// ── Shared helpers ────────────────────────────────────────────────────────────

async function apiFetch(path: string, options?: RequestInit) {
  const isBodyRequest = options?.method && options.method !== 'GET'
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      ...(isBodyRequest ? { 'Content-Type': 'application/json' } : {}),
      ...options?.headers,
    },
  })
  return res
}

async function authFetch(token: string, path: string, options?: RequestInit) {
  return apiFetch(path, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...options?.headers,
    },
  })
}

// ── Menu & Orders ─────────────────────────────────────────────────────────────

export async function fetchMenu() {
  const res = await apiFetch('/menu')
  if (!res.ok) throw new Error('Failed to fetch menu')
  return res.json()
}

export async function fetchOrder(id: number) {
  const res = await apiFetch(`/orders/${id}`)
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

export async function createOrder(payload: CreateOrderPayload, token?: string) {
  // Если пользователь авторизован — передаём токен, чтобы заказ привязался к аккаунту
  const headers: Record<string, string> = {}
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await apiFetch('/orders', {
    method: 'POST',
    body: JSON.stringify(payload),
    headers,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error((err as any).error ?? 'Failed to create order')
  }
  return res.json()
}

// ── Client Auth ───────────────────────────────────────────────────────────────

export async function clientRegister(payload: { phone: string; password: string; firstName?: string; lastName?: string }) {
  const res = await apiFetch('/clients/register', { method: 'POST', body: JSON.stringify(payload) })
  if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error((e as any).error ?? 'Registration failed') }
  return res.json()
}

export async function clientLogin(payload: { phone: string; password: string }) {
  const res = await apiFetch('/clients/login', { method: 'POST', body: JSON.stringify(payload) })
  if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error((e as any).error ?? 'Login failed') }
  return res.json()
}

export async function fetchClientMe(token: string) {
  const res = await authFetch(token, '/clients/me')
  if (!res.ok) throw new Error('Unauthorized')
  return res.json()
}

export async function updateClientMe(token: string, data: { firstName?: string; lastName?: string }) {
  const res = await authFetch(token, '/clients/me', { method: 'PATCH', body: JSON.stringify(data) })
  if (!res.ok) throw new Error('Update failed')
  return res.json()
}

export async function fetchClientOrders(token: string) {
  const res = await authFetch(token, '/clients/me/orders')
  if (!res.ok) throw new Error('Unauthorized')
  return res.json()
}

export async function fetchClientAddresses(token: string) {
  const res = await authFetch(token, '/clients/me/addresses')
  if (!res.ok) throw new Error('Unauthorized')
  return res.json()
}

export async function addClientAddress(token: string, data: { label: 'home' | 'work' | 'other'; address: string }) {
  const res = await authFetch(token, '/clients/me/addresses', { method: 'POST', body: JSON.stringify(data) })
  if (!res.ok) throw new Error('Failed')
  return res.json()
}

export async function deleteClientAddress(token: string, id: number) {
  const res = await authFetch(token, `/clients/me/addresses/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Failed')
  return res.json()
}
