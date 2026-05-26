import { useEffect, useRef, useState } from 'react'
import { WS_BASE } from '../api'
import type { Order } from '../types'

type WsStatus = 'connecting' | 'connected' | 'disconnected'

export function useOrderTracking(orderId: number | null, initialOrder: Order | null) {
  const [order, setOrder] = useState<Order | null>(initialOrder)
  const [wsStatus, setWsStatus] = useState<WsStatus>('disconnected')
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimer = useRef<number | undefined>(undefined)

  useEffect(() => { setOrder(initialOrder) }, [initialOrder])

  useEffect(() => {
    if (!orderId) return
    function connect() {
      setWsStatus('connecting')
      const ws = new WebSocket(`${WS_BASE}/ws?role=client&orderId=${orderId}`)
      wsRef.current = ws
      ws.onopen = () => setWsStatus('connected')
      ws.onmessage = (e) => {
        try {
          const msg = JSON.parse(e.data)
          if ((msg.event === 'order:updated' || msg.event === 'order:cancelled') && msg.data?.id === orderId) {
            setOrder(msg.data)
          }
        } catch {}
      }
      ws.onclose = () => { setWsStatus('disconnected'); reconnectTimer.current = setTimeout(connect, 3000) }
      ws.onerror = () => ws.close()
    }
    connect()
    return () => { clearTimeout(reconnectTimer.current); wsRef.current?.close() }
  }, [orderId])

  return { order, wsStatus }
}
