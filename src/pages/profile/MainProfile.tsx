import {
  User, Package, MapPin, Globe, Phone, Info, LogOut,
  ChevronRight, Wallet,
} from 'lucide-react'
import { useAuthStore, useLangStore } from '../../store'
import { tr } from '../../i18n'
import { formatPrice } from '../../utils'
import type { Screen } from './types'

export default function MainProfile({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const { lang, setLang } = useLangStore()
  const { client, logout } = useAuthStore()
  const fullName = [client?.firstName, client?.lastName].filter(Boolean).join(' ') || '—'

  return (
    <div className="page">
      <div className="profile-hero" onClick={() => onNavigate('edit-profile')}>
        <div className="profile-avatar">
          {client?.firstName?.[0]?.toUpperCase() ?? <User size={28} />}
        </div>
        <div className="profile-hero-info">
          <div className="profile-name">{fullName}</div>
          <div className="profile-phone">{client?.phone}</div>
        </div>
        <ChevronRight size={18} className="text-muted" />
      </div>

      <div className="balance-card">
        <div className="balance-label">
          <Wallet size={16} />
          <span>{tr('balance', lang)}</span>
        </div>
        <div className="balance-amount">{formatPrice(client?.balance ?? '0')}</div>
        <div className="balance-sub">{tr('balanceSub', lang)}</div>
      </div>

      <div className="profile-sections">
        <div className="profile-section">
          <ProfileRow icon={Package} label={tr('myOrders', lang)} onClick={() => onNavigate('orders')} />
          <ProfileRow icon={MapPin} label={tr('myAddresses', lang)} onClick={() => onNavigate('addresses')} />
        </div>

        <div className="profile-section">
          <div className="profile-row lang-row">
            <div className="profile-row-left">
              <div className="profile-row-icon"><Globe size={18} /></div>
              <span className="profile-row-label">{tr('language', lang)}</span>
            </div>
            <div className="lang-switcher">
              {(['ru', 'tk', 'en'] as const).map(l => (
                <button key={l} className={`lang-btn ${lang === l ? 'active' : ''}`} onClick={() => setLang(l)}>
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="profile-section">
          <ProfileRow icon={Phone} label={tr('callOperator', lang)} onClick={() => window.open('tel:+99300000000')} />
          <ProfileRow icon={Info} label={tr('aboutUs', lang)} onClick={() => {}} />
        </div>

        <div className="profile-section">
          <button className="profile-row logout-row" onClick={logout}>
            <div className="profile-row-left">
              <div className="profile-row-icon logout-icon"><LogOut size={18} /></div>
              <span className="profile-row-label logout-label">{tr('logout', lang)}</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}

export function ProfileRow({ icon: Icon, label, onClick }: { icon: React.ComponentType<{ size: number }>; label: string; onClick: () => void }) {
  return (
    <button className="profile-row" onClick={onClick}>
      <div className="profile-row-left">
        <div className="profile-row-icon"><Icon size={18} /></div>
        <span className="profile-row-label">{label}</span>
      </div>
      <ChevronRight size={16} className="text-muted" />
    </button>
  )
}
