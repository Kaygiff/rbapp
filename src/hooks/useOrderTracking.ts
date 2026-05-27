import { useEffect, useRef, useState } from 'react'
import { WS_BASE } from '../api'
import type { Order } from '../types'

type WsStatus = 'connecting' | 'connected' | 'disconnected'

export function useOrderTracking(orderId: number | null, initialOrder: Order | null) {
  const [order, setOrder] = useState<Order | null>(initialOrder)
  const [wsStatus, setWsStatus] = useState<WsStatus>('disconnected')
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const reconnectDelay = useRef(2000)
  const mountedRef = useRef(true)

  useEffect(() => { setOrder(initialOrder) }, [initialOrder])

  useEffect(() => {
    if (!orderId) return
    mountedRef.current = true

    function connect() {
      if (!mountedRef.current) return
      if (wsRef.current && wsRef.current.readyState < 2) {
        wsRef.current.close()
      }

      setWsStatus('connecting')
      let ws: WebSocket
      try {
        ws = new WebSocket(`${WS_BASE}/ws?role=client&orderId=${orderId}`)
      } catch {
        scheduleReconnect()
        return
      }
      wsRef.current = ws

      const pingInterval = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          try { ws.send('ping') } catch {}
        }
      }, 25000)

      ws.onopen = () => {
        if (!mountedRef.current) return ws.close()
        reconnectDelay.current = 2000
        setWsStatus('connected')
      }

      ws.onmessage = (e) => {
        if (!mountedRef.current) return
        if (e.data === 'pong') return
        try {
          const msg = JSON.parse(e.data)
          if (
            (msg.event === 'order:updated' || msg.event === 'order:cancelled') &&
            msg.data?.id === orderId
          ) {
            setOrder(msg.data)
          }
        } catch {}
      }

      ws.onclose = () => {
        clearInterval(pingInterval)
        if (!mountedRef.current) return
        setWsStatus('disconnected')
        scheduleReconnect()
      }

      ws.onerror = () => {
        clearInterval(pingInterval)
        ws.close()
      }
    }

    function scheduleReconnect() {
      if (!mountedRef.current) return
      reconnectTimer.current = setTimeout(() => {
        reconnectDelay.current = Math.min(reconnectDelay.current * 1.5, 30000)
        connect()
      }, reconnectDelay.current)
    }

    connect()

    return () => {
      mountedRef.current = false
      clearTimeout(reconnectTimer.current)
      wsRef.current?.close()
    }
  }, [orderId])

  return { order, wsStatus }
}
