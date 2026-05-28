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
  const pingIntervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined)

  useEffect(() => { setOrder(initialOrder) }, [initialOrder])

  useEffect(() => {
    if (!orderId) return
    mountedRef.current = true

    function connect() {
      if (!mountedRef.current) return

      // Close existing connection
      if (wsRef.current && wsRef.current.readyState < 2) {
        wsRef.current.close()
      }
      // Clear any existing ping interval
      clearInterval(pingIntervalRef.current)

      setWsStatus('connecting')
      let ws: WebSocket
      try {
        ws = new WebSocket(`${WS_BASE}/ws?role=client&orderId=${orderId}`)
      } catch {
        scheduleReconnect()
        return
      }
      wsRef.current = ws

      ws.onopen = () => {
        if (!mountedRef.current) { ws.close(); return }
        reconnectDelay.current = 2000
        setWsStatus('connected')
        // Start ping only after connection is open
        pingIntervalRef.current = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            try { ws.send('ping') } catch {}
          }
        }, 25000)
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
        clearInterval(pingIntervalRef.current)
        if (!mountedRef.current) return
        setWsStatus('disconnected')
        scheduleReconnect()
      }

      ws.onerror = () => {
        clearInterval(pingIntervalRef.current)
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
      reconnectDelay.current = 2000
      clearTimeout(reconnectTimer.current)
      clearInterval(pingIntervalRef.current)
      wsRef.current?.close()
    }
  }, [orderId])

  return { order, wsStatus }
}
