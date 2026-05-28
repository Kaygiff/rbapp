import { ChevronLeft, Loader2, Package } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useAuthStore, useLangStore } from '../../store'
import { fetchClientOrders } from '../../api'
import { tr } from '../../i18n'
import { formatPrice } from '../../utils'
import { STATUS_COLORS } from '../../constants/orderStatus'
import type { Order } from '../../types'

export default function OrdersScreen({ onBack, onSelect }: { onBack: () => void; onSelect: (id: number) => void }) {
  const { lang } = useLangStore()
  const { token, logout } = useAuthStore()

  const { data: orders, isLoading, isError, error } = useQuery<Order[]>({
    queryKey: ['client-orders'],
    queryFn: () => fetchClientOrders(token!),
  })

  if (isError && (error as Error).message === 'Unauthorized') {
    logout()
    return null
  }

  return (
    <div className="page">
      <button className="back-btn" onClick={onBack}><ChevronLeft size={18} /> {tr('profile', lang)}</button>
      <h2 className="section-title">{tr('myOrders', lang)}</h2>

      {isLoading && (
        <div className="flex-center" style={{ paddingTop: '3rem' }}>
          <Loader2 size={28} className="spin" />
        </div>
      )}

      {!isLoading && orders?.length === 0 && (
        <div className="flex-center flex-col gap-4" style={{ paddingTop: '3rem' }}>
          <Package size={40} strokeWidth={1} className="text-muted" />
          <p className="text-muted">{tr('noOrders', lang)}</p>
        </div>
      )}

      <div className="orders-list">
        {orders?.map(order => (
          <button key={order.id} className="order-card" onClick={() => onSelect(order.id)}>
            <div className="order-card-top">
              <span className="order-card-id">#{order.id}</span>
              <span className="order-status-badge" style={{ color: STATUS_COLORS[order.status] }}>
                {tr(`status${order.status}`, lang)}
              </span>
            </div>
            <div className="order-card-items">
              {order.items.slice(0, 2).map(i => `${i.name} ×${i.quantity}`).join(', ')}
              {order.items.length > 2 && ` +${order.items.length - 2}`}
            </div>
            <div className="order-card-footer">
              <span className="order-card-total">{formatPrice(order.total)}</span>
              <span className="order-card-date">{new Date(order.createdAt).toLocaleDateString()}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
