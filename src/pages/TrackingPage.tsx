import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Wifi, WifiOff, Loader2 } from 'lucide-react'
import { fetchOrder } from '../api'
import { useOrderTracking } from '../hooks/useOrderTracking'
import { useLangStore } from '../store'
import { tr } from '../i18n'
import { formatPrice } from '../utils'
import { STATUS_ORDER, STATUS_ICONS } from '../constants/orderStatus'
import type { Order, OrderStatus } from '../types'

export default function TrackingPage() {
  const { lang } = useLangStore()
  const { id: routeId } = useParams<{ id?: string }>()
  const navigate = useNavigate()

  const [inputId, setInputId] = useState(routeId ?? '')
  const [activeId, setActiveId] = useState<number | null>(() => routeId ? Number(routeId) : null)

  const { data: initialOrder, isLoading, isError } = useQuery<Order>({
    queryKey: ['order', activeId],
    queryFn: () => fetchOrder(activeId!),
    enabled: activeId !== null,
    retry: false,
  })

  const { order, wsStatus } = useOrderTracking(activeId, initialOrder ?? null)

  function handleTrack() {
    const id = Number(inputId)
    if (!id) return
    setActiveId(id)
    navigate(`/tracking/${id}`, { replace: true })
  }

  const isCancelled = order?.status === 'CANCELLED'
  const currentIdx = order ? STATUS_ORDER.indexOf(order.status as OrderStatus) : -1

  return (
    <div className="page">
      {/* Search */}
      <div className="track-search">
        <input
          className="form-input"
          value={inputId}
          onChange={e => setInputId(e.target.value)}
          placeholder={tr('enterOrderId', lang)}
          type="number"
          onKeyDown={e => e.key === 'Enter' && handleTrack()}
        />
        <button className="btn-primary" onClick={handleTrack}>{tr('track', lang)}</button>
      </div>

      {isLoading && (
        <div className="flex-center" style={{ paddingTop: '3rem' }}>
          <Loader2 size={32} className="spin" />
        </div>
      )}

      {isError && (
        <div className="flex-center" style={{ paddingTop: '3rem' }}>
          <p className="text-muted">{tr('orderNotFound', lang)}</p>
        </div>
      )}

      {order && (
        <div className="tracking-card">
          <div className="tracking-header">
            <div>
              <div className="tracking-order-num">{tr('yourOrder', lang)} #{order.id}</div>
              <div className="text-muted" style={{ fontSize: '0.8rem' }}>
                {order.customerName} · {order.customerPhone}
              </div>
            </div>
            <div className={`ws-badge ws-${wsStatus}`}>
              {wsStatus === 'connected'
                ? <Wifi size={12} />
                : wsStatus === 'connecting'
                  ? <Loader2 size={12} className="spin" />
                  : <WifiOff size={12} />}
              <span>{tr(wsStatus === 'connected' ? 'connected' : wsStatus === 'connecting' ? 'connecting' : 'disconnected', lang)}</span>
            </div>
          </div>

          {isCancelled ? (
            <div className="cancelled-badge">
              {STATUS_ICONS.CANCELLED} {tr('statusCANCELLED', lang)}
            </div>
          ) : (
            <div className="stepper">
              {STATUS_ORDER.map((status, idx) => (
                <div key={status} className={`step ${idx <= currentIdx ? 'done' : ''} ${idx === currentIdx ? 'current' : ''}`}>
                  <div className="step-dot">
                    {idx < currentIdx ? '✓' : STATUS_ICONS[status]}
                  </div>
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

          {wsStatus === 'connected' && (
            <div className="live-badge">● {tr('liveUpdates', lang)}</div>
          )}
        </div>
      )}
    </div>
  )
}
