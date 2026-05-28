import { useNavigate } from 'react-router-dom'
import { Trash2, ShoppingBag, Plus, Minus } from 'lucide-react'
import { useCartStore, useLangStore, selectTotalPrice } from '../store'
import { tr } from '../i18n'
import { formatPrice } from '../utils'

export default function CartPage() {
  const { lang } = useLangStore()
  const { items, removeItem, updateQty, clearCart } = useCartStore()
  const total = useCartStore(selectTotalPrice)
  const navigate = useNavigate()

  if (items.length === 0) return (
    <div className="page flex-center flex-col gap-4" style={{ paddingTop: '5rem' }}>
      <div className="empty-icon"><ShoppingBag size={48} strokeWidth={1} /></div>
      <p className="empty-title">{tr('emptyCart', lang)}</p>
      <p className="text-muted">{tr('emptyCartSub', lang)}</p>
      <button className="btn-primary" onClick={() => navigate('/')}>{tr('menu', lang)}</button>
    </div>
  )

  return (
    <div className="page">
      <div className="cart-list">
        {items.map(({ menuItem, quantity }) => (
          <div key={menuItem.id} className="cart-item">
            {menuItem.imageUrl && (
              <img src={menuItem.imageUrl} alt={menuItem.name} className="cart-img" />
            )}
            <div className="cart-item-body">
              <div className="cart-item-name">{menuItem.name}</div>
              <div className="cart-item-price">{formatPrice(parseFloat(menuItem.price) * quantity)}</div>
            </div>
            <div className="qty-controls">
              <button className="qty-btn" onClick={() => updateQty(menuItem.id, quantity - 1)}>
                <Minus size={14} />
              </button>
              <span className="qty-num">{quantity}</span>
              <button className="qty-btn" onClick={() => updateQty(menuItem.id, quantity + 1)}>
                <Plus size={14} />
              </button>
            </div>
            <button className="remove-btn" onClick={() => removeItem(menuItem.id)}>
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      <div className="cart-footer">
        <div className="total-row">
          <span className="total-label">{tr('total', lang)}</span>
          <span className="total-amount">{formatPrice(total)}</span>
        </div>
        <button className="btn-primary btn-lg" onClick={() => navigate('/checkout')}>
          {tr('checkout', lang)}
        </button>
        <button className="btn-ghost btn-sm" onClick={clearCart} style={{ marginTop: '8px' }}>
          <Trash2 size={14} /> {tr('clearCart', lang)}
        </button>
      </div>
    </div>
  )
}
