import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  User, Package, MapPin, Globe, Phone, Info, LogOut,
  ChevronRight, Plus, Trash2, ChevronLeft, Loader2,
  Wallet, Home, Briefcase, MoreHorizontal, Eye, EyeOff
} from 'lucide-react'
import { useAuthStore, useLangStore } from '../store'
import { tr } from '../i18n'
import {
  clientLogin, clientRegister,
  fetchClientOrders, fetchClientAddresses,
  addClientAddress, deleteClientAddress, updateClientMe
} from '../api'
import { useOrderTracking } from '../hooks/useOrderTracking'
import type { Order } from '../types'

type Screen = 'main' | 'orders' | 'order-detail' | 'addresses' | 'add-address' | 'edit-profile'

// ── Label icons ───────────────────────────────────────────────────────────────
const LABEL_ICONS = { home: Home, work: Briefcase, other: MoreHorizontal }
const LABEL_COLORS = { home: '#c9952a', work: '#4a9eca', other: '#9a8f7e' }

// ── Status colors ─────────────────────────────────────────────────────────────
const STATUS_COLORS: Record<string, string> = {
  NEW: '#9a8f7e', CONFIRMED: '#4a9eca', COOKING: '#e6a817',
  READY: '#27ae60', DELIVERED: '#27ae60', CANCELLED: '#c0392b'
}

export default function ProfilePage() {
  const { token, client } = useAuthStore()

  if (!token || !client) return <AuthScreen />
  return <ProfileScreen />
}

// ══════════════════════════════════════════════════════════════════════════════
// AUTH SCREEN
// ══════════════════════════════════════════════════════════════════════════════

function AuthScreen() {
  const { lang } = useLangStore()
  const { setAuth } = useAuthStore()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [errors, setErrors] = useState<Record<string, boolean>>({})

  const mutation = useMutation({
    mutationFn: () =>
      mode === 'login'
        ? clientLogin({ phone, password })
        : clientRegister({ phone, password, firstName, lastName }),
    onSuccess: (data) => setAuth(data.token, data.client),
  })

  function validate() {
    const e: Record<string, boolean> = {}
    if (!phone.trim()) e.phone = true
    if (!password || password.length < 6) e.password = true
    if (mode === 'register' && !firstName.trim()) e.firstName = true
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function submit() {
    if (!validate()) return
    mutation.mutate()
  }

  return (
    <div className="page">
      <div className="auth-card">
        <div className="auth-logo">
          <User size={40} strokeWidth={1} />
        </div>
        <h2 className="auth-title">
          {mode === 'login' ? tr('login', lang) : tr('register', lang)}
        </h2>

        <div className="auth-tabs">
          <button className={`auth-tab ${mode === 'login' ? 'active' : ''}`} onClick={() => setMode('login')}>
            {tr('login', lang)}
          </button>
          <button className={`auth-tab ${mode === 'register' ? 'active' : ''}`} onClick={() => setMode('register')}>
            {tr('register', lang)}
          </button>
        </div>

        <div className="checkout-form">
          {mode === 'register' && (
            <>
              <div className="form-group">
                <label className="form-label">{tr('firstName', lang)}</label>
                <input
                  className={`form-input ${errors.firstName ? 'input-error' : ''}`}
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  placeholder={tr('firstName', lang)}
                />
                {errors.firstName && <span className="field-error">{tr('required', lang)}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">{tr('lastName', lang)}</label>
                <input
                  className="form-input"
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  placeholder={tr('lastName', lang)}
                />
              </div>
            </>
          )}

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

          <div className="form-group">
            <label className="form-label">{tr('password', lang)}</label>
            <div className="pass-wrap">
              <input
                className={`form-input ${errors.password ? 'input-error' : ''}`}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••"
                type={showPass ? 'text' : 'password'}
              />
              <button className="pass-toggle" onClick={() => setShowPass(v => !v)}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <span className="field-error">{tr('passwordMin', lang)}</span>}
          </div>

          {mutation.isError && (
            <p className="field-error text-center">{(mutation.error as Error).message}</p>
          )}

          <button className="btn-primary btn-lg" onClick={submit} disabled={mutation.isPending}>
            {mutation.isPending ? <Loader2 size={18} className="spin" /> : (mode === 'login' ? tr('login', lang) : tr('register', lang))}
          </button>
        </div>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// PROFILE SCREEN (router)
// ══════════════════════════════════════════════════════════════════════════════

function ProfileScreen() {
  const [screen, setScreen] = useState<Screen>('main')
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null)

  if (screen === 'orders') return <OrdersScreen onBack={() => setScreen('main')} onSelect={id => { setSelectedOrderId(id); setScreen('order-detail') }} />
  if (screen === 'order-detail' && selectedOrderId) return <OrderDetailScreen orderId={selectedOrderId} onBack={() => setScreen('orders')} />
  if (screen === 'addresses') return <AddressesScreen onBack={() => setScreen('main')} />
  if (screen === 'edit-profile') return <EditProfileScreen onBack={() => setScreen('main')} />

  return <MainProfile onNavigate={setScreen} />
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN PROFILE
// ══════════════════════════════════════════════════════════════════════════════

function MainProfile({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const { lang, setLang } = useLangStore()
  const { client, logout } = useAuthStore()

  const fullName = [client?.firstName, client?.lastName].filter(Boolean).join(' ') || '—'

  return (
    <div className="page">
      {/* Header card */}
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

      {/* Balance */}
      <div className="balance-card">
        <div className="balance-label">
          <Wallet size={16} />
          <span>{tr('balance', lang)}</span>
        </div>
        <div className="balance-amount">
          {parseFloat(client?.balance ?? '0').toLocaleString()} TMT
        </div>
        <div className="balance-sub">{tr('balanceSub', lang)}</div>
      </div>

      {/* Menu sections */}
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

function ProfileRow({ icon: Icon, label, onClick }: { icon: any; label: string; onClick: () => void }) {
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

// ══════════════════════════════════════════════════════════════════════════════
// EDIT PROFILE
// ══════════════════════════════════════════════════════════════════════════════

function EditProfileScreen({ onBack }: { onBack: () => void }) {
  const { lang } = useLangStore()
  const { token, client, updateClient } = useAuthStore()
  const [firstName, setFirstName] = useState(client?.firstName ?? '')
  const [lastName, setLastName] = useState(client?.lastName ?? '')
  const [saved, setSaved] = useState(false)

  const mutation = useMutation({
    mutationFn: () => updateClientMe(token!, { firstName, lastName }),
    onSuccess: (data) => { updateClient(data); setSaved(true); setTimeout(() => setSaved(false), 2000) },
  })

  return (
    <div className="page">
      <button className="back-btn" onClick={onBack}><ChevronLeft size={18} /> {tr('profile', lang)}</button>
      <div className="checkout-form">
        <div className="form-group">
          <label className="form-label">{tr('firstName', lang)}</label>
          <input className="form-input" value={firstName} onChange={e => setFirstName(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">{tr('lastName', lang)}</label>
          <input className="form-input" value={lastName} onChange={e => setLastName(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">{tr('yourPhone', lang)}</label>
          <input className="form-input" value={client?.phone ?? ''} disabled style={{ opacity: 0.5 }} />
        </div>
        {mutation.isError && <p className="field-error text-center">{(mutation.error as Error).message}</p>}
        <button className="btn-primary btn-lg" onClick={() => mutation.mutate()} disabled={mutation.isPending}>
          {saved ? '✓ ' + tr('saved', lang) : mutation.isPending ? tr('loading', lang) : tr('save', lang)}
        </button>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// ORDERS LIST
// ══════════════════════════════════════════════════════════════════════════════

function OrdersScreen({ onBack, onSelect }: { onBack: () => void; onSelect: (id: number) => void }) {
  const { lang } = useLangStore()
  const { token } = useAuthStore()
  const { data: orders, isLoading } = useQuery<Order[]>({
    queryKey: ['client-orders'],
    queryFn: () => fetchClientOrders(token!),
  })

  return (
    <div className="page">
      <button className="back-btn" onClick={onBack}><ChevronLeft size={18} /> {tr('profile', lang)}</button>
      <h2 className="section-title">{tr('myOrders', lang)}</h2>

      {isLoading && <div className="flex-center" style={{ paddingTop: '3rem' }}><Loader2 size={28} className="spin" /></div>}

      {!isLoading && orders?.length === 0 && (
        <div className="flex-center flex-col gap-4" style={{ paddingTop: '3rem' }}>
          <Package size={40} strokeWidth={1} className="text-muted" />
          <p className="text-muted">{tr('noOrders', lang)}</p>
        </div>
      )}

      <div className="orders-list">
        {orders?.map(order => (
          <button key={order.id} className="order-card" onClick={() => onSelect(order.id)}>
            <div className="order-card-top">
              <span className="order-card-id">#{order.id}</span>
              <span className="order-status-badge" style={{ color: STATUS_COLORS[order.status] }}>
                {tr(`status${order.status}`, lang)}
              </span>
            </div>
            <div className="order-card-items">
              {order.items.slice(0, 2).map(i => `${i.name} ×${i.quantity}`).join(', ')}
              {order.items.length > 2 && ` +${order.items.length - 2}`}
            </div>
            <div className="order-card-footer">
              <span className="order-card-total">{parseFloat(order.total).toLocaleString()} TMT</span>
              <span className="order-card-date">{new Date(order.createdAt).toLocaleDateString()}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// ORDER DETAIL + TRACKING
// ══════════════════════════════════════════════════════════════════════════════

const STATUS_ORDER = ['NEW', 'CONFIRMED', 'COOKING', 'READY', 'DELIVERED']
const STATUS_ICONS: Record<string, string> = {
  NEW: '📋', CONFIRMED: '✅', COOKING: '👨‍🍳', READY: '🔔', DELIVERED: '🎉', CANCELLED: '❌'
}

function OrderDetailScreen({ orderId, onBack }: { orderId: number; onBack: () => void }) {
  const { lang } = useLangStore()
  const { data: initialOrder } = useQuery<Order>({
    queryKey: ['order', orderId],
    queryFn: async () => {
      const res = await fetch(`https://resulberdybackend-production.up.railway.app/orders/${orderId}`)
      return res.json()
    },
  })
  const { order, wsStatus } = useOrderTracking(orderId, initialOrder ?? null)

  const isCancelled = order?.status === 'CANCELLED'
  const currentIdx = order ? STATUS_ORDER.indexOf(order.status) : -1

  return (
    <div className="page">
      <button className="back-btn" onClick={onBack}><ChevronLeft size={18} /> {tr('myOrders', lang)}</button>

      {!order && <div className="flex-center" style={{ paddingTop: '3rem' }}><Loader2 size={28} className="spin" /></div>}

      {order && (
        <div className="tracking-card">
          <div className="tracking-header">
            <div>
              <div className="tracking-order-num">{tr('yourOrder', lang)} #{order.id}</div>
              <div className="text-muted" style={{ fontSize: '0.8rem' }}>{new Date(order.createdAt).toLocaleString()}</div>
            </div>
            <div className={`ws-badge ws-${wsStatus}`}>
              {wsStatus === 'connected' ? '●' : wsStatus === 'connecting' ? <Loader2 size={10} className="spin" /> : '○'}
              <span>{tr(wsStatus === 'connected' ? 'connected' : wsStatus === 'connecting' ? 'connecting' : 'disconnected', lang)}</span>
            </div>
          </div>

          {isCancelled ? (
            <div className="cancelled-badge">{STATUS_ICONS.CANCELLED} {tr('statusCANCELLED', lang)}</div>
          ) : (
            <div className="stepper">
              {STATUS_ORDER.map((status, idx) => (
                <div key={status} className={`step ${idx <= currentIdx ? 'done' : ''} ${idx === currentIdx ? 'current' : ''}`}>
                  <div className="step-dot">{idx < currentIdx ? '✓' : STATUS_ICONS[status]}</div>
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
                <span>{(parseFloat(item.price) * item.quantity).toLocaleString()} TMT</span>
              </div>
            ))}
            <div className="summary-total">
              <span>{tr('total', lang)}</span>
              <span>{parseFloat(order.total).toLocaleString()} TMT</span>
            </div>
          </div>

          {order.address && (
            <div className="order-address">
              <MapPin size={14} /> {order.address}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// ADDRESSES
// ══════════════════════════════════════════════════════════════════════════════

function AddressesScreen({ onBack }: { onBack: () => void }) {
  const { lang } = useLangStore()
  const { token } = useAuthStore()
  const qc = useQueryClient()
  const [showAdd, setShowAdd] = useState(false)
  const [newAddr, setNewAddr] = useState('')
  const [newLabel, setNewLabel] = useState<'home' | 'work' | 'other'>('home')

  const { data: addresses, isLoading } = useQuery<any[]>({
    queryKey: ['client-addresses'],
    queryFn: () => fetchClientAddresses(token!),
  })

  const addMutation = useMutation({
    mutationFn: () => addClientAddress(token!, { label: newLabel, address: newAddr }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['client-addresses'] }); setShowAdd(false); setNewAddr('') },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteClientAddress(token!, id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['client-addresses'] }),
  })

  return (
    <div className="page">
      <button className="back-btn" onClick={onBack}><ChevronLeft size={18} /> {tr('profile', lang)}</button>
      <div className="section-header">
        <h2 className="section-title">{tr('myAddresses', lang)}</h2>
        <button className="add-btn" onClick={() => setShowAdd(v => !v)}><Plus size={18} /></button>
      </div>

      {showAdd && (
        <div className="add-address-form">
          <div className="label-tabs">
            {(['home', 'work', 'other'] as const).map(l => {
              const Icon = LABEL_ICONS[l]
              return (
                <button key={l} className={`label-tab ${newLabel === l ? 'active' : ''}`} onClick={() => setNewLabel(l)}
                  style={newLabel === l ? { borderColor: LABEL_COLORS[l], color: LABEL_COLORS[l] } : {}}>
                  <Icon size={14} /> {tr(`label_${l}`, lang)}
                </button>
              )
            })}
          </div>
          <input
            className="form-input"
            value={newAddr}
            onChange={e => setNewAddr(e.target.value)}
            placeholder={tr('address', lang)}
          />
          <button className="btn-primary" style={{ marginTop: '8px' }} onClick={() => addMutation.mutate()} disabled={!newAddr.trim() || addMutation.isPending}>
            {addMutation.isPending ? tr('loading', lang) : tr('save', lang)}
          </button>
        </div>
      )}

      {isLoading && <div className="flex-center" style={{ paddingTop: '2rem' }}><Loader2 size={24} className="spin" /></div>}

      <div className="address-list">
        {addresses?.map(addr => {
          const Icon = LABEL_ICONS[addr.label as keyof typeof LABEL_ICONS] ?? MoreHorizontal
          return (
            <div key={addr.id} className="address-item">
              <div className="address-icon" style={{ color: LABEL_COLORS[addr.label as keyof typeof LABEL_COLORS] }}>
                <Icon size={18} />
              </div>
              <div className="address-body">
                <div className="address-label-text">{tr(`label_${addr.label}`, lang)}</div>
                <div className="address-text">{addr.address}</div>
              </div>
              <button className="remove-btn" onClick={() => deleteMutation.mutate(addr.id)}><Trash2 size={16} /></button>
            </div>
          )
        })}
        {!isLoading && addresses?.length === 0 && (
          <p className="text-muted" style={{ paddingTop: '1rem', textAlign: 'center' }}>{tr('noAddresses', lang)}</p>
        )}
      </div>
    </div>
  )
}
