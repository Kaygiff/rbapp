import type { OrderStatus } from '../types'

export const STATUS_ORDER: OrderStatus[] = ['NEW', 'CONFIRMED', 'COOKING', 'READY', 'DELIVERED']

export const STATUS_ICONS: Record<OrderStatus, string> = {
  NEW: '📋',
  CONFIRMED: '✅',
  COOKING: '👨‍🍳',
  READY: '🔔',
  DELIVERED: '🎉',
  CANCELLED: '❌',
}

export const STATUS_COLORS: Record<string, string> = {
  NEW: '#9a8f7e',
  CONFIRMED: '#4a9eca',
  COOKING: '#e6a817',
  READY: '#27ae60',
  DELIVERED: '#27ae60',
  CANCELLED: '#c0392b',
}
