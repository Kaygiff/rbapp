import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { CheckCircle } from 'lucide-react'
import { createOrder } from '../api'
import { useCartStore, useLangStore } from '../store'
import { tr } from '../i18n'
import type { OrderType } from '../types'

export default function CheckoutPage() {
  const { lang } = useLangStore()
  const { items, totalPrice, clearCart } = useCartStore()
  const navigate = useNavigate()

  const [type, setType] = useState<OrderType>('DINE_IN')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [table, setTable] = useState('')
  const [address, setAddress] = useState('')
  const [comment, setComment] = useState('')
  const [errors, setErrors] = useState<Record<string, boolean>>({})
  const [placedOrderId, setPlacedOrderId] = useState<number | null>(null)

  const mutation = useMutation({
    mutationFn: createOrder,
    onSuccess: (order) => {
      clearCart()
      setPlacedOrderId(order.id)
    },
  })

  function validate() {
    const e: Record<string, boolean> = {}
    if (!name.trim()) e.name = true
    if (!phone.trim()) e.phone = true
    if (type === 'DINE_IN' && !table.trim()) e.table = true
    if (type === 'DELIVERY' && !address.trim()) e.address = true
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function submit() {
    if (!validate()) return
    mutation.mutate({
      type,
      customerName: name.trim(),
      customerPhone: phone.trim(),
      tableNumber: type === 'DINE_IN' ? table.trim() : undefined,
      address: type === 'DELIVERY' ? address.trim() : undefined,
      comment: comment.trim() || undefined,
      items: items.map(i => ({ menuItemId: i.menuItem.id, quantity: i.quantity })),
    })
  }

  if (placedOrderId !== null) return (
    <div className="page flex-center flex-col gap-5" style={{ paddingTop: '4rem' }}>
      <div className="success-icon"><CheckCircle size={56} /></div>
      <h2 className="success-title">{tr('orderPlaced', lang)}</h2>
      <p className="text-muted">{tr('orderNumber', lang)}: <strong>#{placedOrderId}</strong></p>
      <button className="btn-primary btn-lg" onClick={() => navigate(`/tracking?id=${placedOrderId}`)}>
        {tr('trackOrder', lang)}
      </button>
    </div>
  )

  return (
    <div className="page">
      <div className="checkout-form">

        {/* Type selector */}
        <div className="form-group">
          <label className="form-label">{tr('orderType', lang)}</label>
          <div className="type-toggle">
            <button
              className={`type-btn ${type === 'DINE_IN' ? 'active' : ''}`}
              onClick={() => setType('DINE_IN')}
            >
              🍽 {tr('dineIn', lang)}
            </button>
            <button
              className={`type-btn ${type === 'DELIVERY' ? 'active' : ''}`}
              onClick={() => setType('DELIVERY')}
            >
              🛵 {tr('delivery', lang)}
            </button>
          </div>
        </div>

        {/* Name */}
        <div className="form-group">
          <label className="form-label">{tr('yourName', lang)}</label>
          <input
            className={`form-input ${errors.name ? 'input-error' : ''}`}
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder={tr('yourName', lang)}
          />
          {errors.name && <span className="field-error">{tr('required', lang)}</span>}
        </div>

        {/* Phone */}
        <div className="form-group">
          <label className="form-label">{tr('yourPhone', lang)}</label>
          <input
            className={`form-input ${errors.phone ? 'input-error' : ''}`}
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="+993 ..."
            type="tel"
          />
          {errors.phone && <span className="field-error">{tr('required', lang)}</span>}
        </div>

        {/* Table or Address */}
        {type === 'DINE_IN' ? (
          <div className="form-group">
            <label className="form-label">{tr('tableNumber', lang)}</label>
            <input
              className={`form-input ${errors.table ? 'input-error' : ''}`}
              value={table}
              onChange={e => setTable(e.target.value)}
              placeholder="1, 2, 3..."
            />
            {errors.table && <span className="field-error">{tr('required', lang)}</span>}
          </div>
        ) : (
          <div className="form-group">
            <label className="form-label">{tr('address', lang)}</label>
            <input
              className={`form-input ${errors.address ? 'input-error' : ''}`}
              value={address}
              onChange={e => setAddress(e.target.value)}
              placeholder={tr('address', lang)}
            />
            {errors.address && <span className="field-error">{tr('required', lang)}</span>}
          </div>
        )}

        {/* Comment */}
        <div className="form-group">
          <label className="form-label">{tr('comment', lang)}</label>
          <textarea
            className="form-input form-textarea"
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder={tr('commentPlaceholder', lang)}
            rows={3}
          />
        </div>

        {/* Order summary */}
        <div className="order-summary">
          {items.map(({ menuItem, quantity }) => (
            <div key={menuItem.id} className="summary-row">
              <span className="summary-name">{menuItem.name} × {quantity}</span>
              <span className="summary-price">{(parseFloat(menuItem.price) * quantity).toLocaleString()} ₸</span>
            </div>
          ))}
          <div className="summary-total">
            <span>{tr('total', lang)}</span>
            <span>{totalPrice().toLocaleString()} ₸</span>
          </div>
        </div>

        {mutation.isError && (
          <p className="field-error text-center">{(mutation.error as Error).message}</p>
        )}

        <button
          className="btn-primary btn-lg"
          onClick={submit}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? tr('loading', lang) : tr('placeOrder', lang)}
        </button>
      </div>
    </div>
  )
}
