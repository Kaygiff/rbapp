import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Loader2, MapPin } from 'lucide-react'
import { createOrder, fetchClientAddresses } from '../api'
import { useCartStore, useLangStore, useAuthStore, selectTotalPrice } from '../store'
import { tr } from '../i18n'
import { formatPrice, isValidPhone } from '../utils'

export default function CheckoutPage() {
  const { lang } = useLangStore()
  const { items, clearCart } = useCartStore()
  const total = useCartStore(selectTotalPrice)
  const { client, token } = useAuthStore()
  const navigate = useNavigate()

  const [name, setName] = useState(client?.firstName ? [client.firstName, client.lastName].filter(Boolean).join(' ') : '')
  const [phone, setPhone] = useState(client?.phone ?? '')
  const [address, setAddress] = useState('')
  const [comment, setComment] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Guard against double-submit
  const submittingRef = useRef(false)

  // Сохранённые адреса для авторизованных пользователей
  const { data: savedAddresses } = useQuery<any[]>({
    queryKey: ['client-addresses'],
    queryFn: () => fetchClientAddresses(token!),
    enabled: !!token,
  })

  const mutation = useMutation({
    mutationFn: () =>
      createOrder({
        type: 'DELIVERY',
        customerName: name.trim(),
        customerPhone: phone.trim(),
        address: address.trim(),
        comment: comment.trim() || undefined,
        items: items.map(i => ({ menuItemId: i.menuItem.id, quantity: i.quantity })),
      }),
    onSuccess: (data) => {
      clearCart()
      navigate(`/tracking/${data.id}`)
    },
    onSettled: () => { submittingRef.current = false },
  })

  function validate() {
    const e: Record<string, string> = {}
    if (!name.trim()) e.name = tr('required', lang)
    if (!phone.trim()) e.phone = tr('required', lang)
    else if (!isValidPhone(phone)) e.phone = tr('invalidPhone', lang)
    if (!address.trim()) e.address = tr('required', lang)
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function submit() {
    if (submittingRef.current || mutation.isPending) return
    if (!validate()) return
    submittingRef.current = true
    mutation.mutate()
  }

  if (items.length === 0) {
    navigate('/')
    return null
  }

  return (
    <div className="page">
      <div className="checkout-form">
        {/* Name */}
        <div className="form-group">
          <label className="form-label">{tr('yourName', lang)}</label>
          <input
            className={`form-input ${errors.name ? 'input-error' : ''}`}
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder={tr('yourName', lang)}
          />
          {errors.name && <span className="field-error">{errors.name}</span>}
        </div>

        {/* Phone */}
        <div className="form-group">
          <label className="form-label">{tr('yourPhone', lang)}</label>
          <input
            className={`form-input ${errors.phone ? 'input-error' : ''}`}
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="+993 61 00 00 00"
            type="tel"
          />
          {errors.phone && <span className="field-error">{errors.phone}</span>}
        </div>

        {/* Address — с выбором из сохранённых */}
        <div className="form-group">
          <label className="form-label">{tr('address', lang)}</label>
          {savedAddresses && savedAddresses.length > 0 && (
            <div className="saved-addresses">
              {savedAddresses.map(a => (
                <button
                  key={a.id}
                  type="button"
                  className={`saved-address-btn ${address === a.address ? 'active' : ''}`}
                  onClick={() => setAddress(a.address)}
                >
                  <MapPin size={12} />
                  <span>{a.address}</span>
                </button>
              ))}
            </div>
          )}
          <input
            className={`form-input ${errors.address ? 'input-error' : ''}`}
            value={address}
            onChange={e => setAddress(e.target.value)}
            placeholder={tr('address', lang)}
          />
          {errors.address && <span className="field-error">{errors.address}</span>}
        </div>

        {/* Comment */}
        <div className="form-group">
          <label className="form-label">{tr('comment', lang)}</label>
          <textarea
            className="form-input"
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
              <span>{menuItem.name} × {quantity}</span>
              <span>{formatPrice(parseFloat(menuItem.price) * quantity)}</span>
            </div>
          ))}
          <div className="summary-total">
            <span>{tr('total', lang)}</span>
            <span>{formatPrice(total)}</span>
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
          {mutation.isPending
            ? <Loader2 size={18} className="spin" />
            : tr('placeOrder', lang)}
        </button>
      </div>
    </div>
  )
}
