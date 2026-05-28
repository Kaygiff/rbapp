import { ChevronLeft, Loader2 } from 'lucide-react'
import { MapPin } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useLangStore } from '../../store'
import { fetchOrder } from '../../api'
import { useOrderTracking } from '../../hooks/useOrderTracking'
import { tr } from '../../i18n'
import { formatPrice } from '../../utils'
import { STATUS_ORDER, STATUS_ICONS } from '../../constants/orderStatus'
import type { Order, OrderStatus } from '../../types'

export default function OrderDetailScreen({ orderId, onBack }: { orderId: number; onBack: () => void }) {
  const { lang } = useLangStore()

  const { data: initialOrder } = useQuery<Order>({
    queryKey: ['order', orderId],
    queryFn: () => fetchOrder(orderId),
  })

  const { order, wsStatus } = useOrderTracking(orderId, initialOrder ?? null)

  const isCancelled = order?.status === 'CANCELLED'
  const currentIdx = order ? STATUS_ORDER.indexOf(order.status as OrderStatus) : -1

  return (
    <div className="page">
      <button className="back-btn" onClick={onBack}><ChevronLeft size={18} /> {tr('myOrders', lang)}</button>

      {!order && (
        <div className="flex-center" style={{ paddingTop: '3rem' }}>
          <Loader2 size={28} className="spin" />
        </div>
      )}

      {order && (
        <div className="tracking-card">
          <div className="tracking-header">
            <div>
              <div className="tracking-order-num">{tr('yourOrder', lang)} #{order.id}</div>
              <div className="text-muted" style={{ fontSize: '0.8rem' }}>
                {new Date(order.createdAt).toLocaleString()}
              </div>
            </div>
            <div className={`ws-badge ws-${wsStatus}`}>
              {wsStatus === 'connected' ? '●' : wsStatus === 'connecting' ? <Loader2 size={10} className="spin" /> : '○'}
              <span>{tr(wsStatus === 'connected' ? 'connected' : wsStatus === 'connecting' ? 'connecting' : 'disconnected', lang)}</span>
            </div>
          </div>

          {isCancelled ? (
            <div className="cancelled-badge">{STATUS_ICONS.CANCELLED} {tr('statusCANCELLED', lang)}</div>
          ) : (
            <div className="stepper">
              {STATUS_ORDER.map((status, idx) => (
                <div key={status} className={`step ${idx <= currentIdx ? 'done' : ''} ${idx === currentIdx ? 'current' : ''}`}>
                  <div className="step-dot">{idx < currentIdx ? '✓' : STATUS_ICONS[status]}</div>
                  <div className="step-label">{tr(`status${status}`, lang)}</div>
                  {idx < STATUS_ORDER.length - 1 && <div className="step-line" />}
                </div>
              ))}
            </div>
          )}

          <div className="tracking-items">
            <div className="tracking-items-title">{tr('orderItems', lang)}</div>
            {order.items.map(item => (
              <div key={item.id} className="summary-row">
                <span>{item.name} × {item.quantity}</span>
                <span>{formatPrice(parseFloat(item.price) * item.quantity)}</span>
              </div>
            ))}
            <div className="summary-total">
              <span>{tr('total', lang)}</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>

          {order.address && (
            <div className="order-address">
              <MapPin size={14} /> {order.address}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
