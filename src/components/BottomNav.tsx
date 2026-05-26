import { useNavigate, useLocation } from 'react-router-dom'
import { UtensilsCrossed, ShoppingBag, MapPin } from 'lucide-react'
import { useCartStore, useLangStore } from '../store'
import { tr } from '../i18n'

export default function BottomNav() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { lang } = useLangStore()
  const totalItems = useCartStore(s => s.totalItems())

  const tabs = [
    { path: '/', icon: UtensilsCrossed, label: tr('menu', lang) },
    { path: '/cart', icon: ShoppingBag, label: tr('cart', lang), badge: totalItems },
    { path: '/tracking', icon: MapPin, label: tr('tracking', lang) },
  ]

  return (
    <nav className="bottom-nav">
      {tabs.map(({ path, icon: Icon, label, badge }) => (
        <button
          key={path}
          className={`nav-tab ${pathname === path || (path === '/cart' && pathname === '/checkout') ? 'active' : ''}`}
          onClick={() => navigate(path)}
        >
          <div className="nav-icon-wrap">
            <Icon size={22} strokeWidth={pathname === path ? 2.2 : 1.5} />
            {badge != null && badge > 0 && <span className="nav-badge">{badge}</span>}
          </div>
          <span className="nav-label">{label}</span>
        </button>
      ))}
    </nav>
  )
}
