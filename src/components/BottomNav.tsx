import { useNavigate, useLocation } from 'react-router-dom'
import { UtensilsCrossed, ShoppingBag, User } from 'lucide-react'
import { useCartStore, useLangStore, useAuthStore } from '../store'
import { tr } from '../i18n'

export default function BottomNav() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { lang } = useLangStore()
  const totalItems = useCartStore(s => s.totalItems())
  const isLoggedIn = useAuthStore(s => !!s.token)

  const tabs = [
    { path: '/', icon: UtensilsCrossed, label: tr('menu', lang) },
    { path: '/cart', icon: ShoppingBag, label: tr('cart', lang), badge: totalItems },
    { path: '/profile', icon: User, label: tr('profile', lang), dot: isLoggedIn },
  ]

  return (
    <nav className="bottom-nav">
      {tabs.map(({ path, icon: Icon, label, badge, dot }) => {
        const active = pathname === path || (path === '/cart' && pathname === '/checkout')
        return (
          <button key={path} className={`nav-tab ${active ? 'active' : ''}`} onClick={() => navigate(path)}>
            <div className="nav-icon-wrap">
              <Icon size={22} strokeWidth={active ? 2.2 : 1.5} />
              {badge != null && badge > 0 && <span className="nav-badge">{badge}</span>}
              {dot && !badge && <span className="nav-dot" />}
            </div>
            <span className="nav-label">{label}</span>
          </button>
        )
      })}
    </nav>
  )
}
