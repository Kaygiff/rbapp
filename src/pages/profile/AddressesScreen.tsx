import { useState } from 'react'
import { ChevronLeft, Plus, Trash2, Loader2, Home, Briefcase, MoreHorizontal } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthStore, useLangStore } from '../../store'
import { fetchClientAddresses, addClientAddress, deleteClientAddress } from '../../api'
import { tr } from '../../i18n'

const LABEL_ICONS = { home: Home, work: Briefcase, other: MoreHorizontal }
const LABEL_COLORS = { home: '#c9952a', work: '#4a9eca', other: '#9a8f7e' }

export default function AddressesScreen({ onBack }: { onBack: () => void }) {
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
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['client-addresses'] })
      setShowAdd(false)
      setNewAddr('')
    },
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
                <button
                  key={l}
                  className={`label-tab ${newLabel === l ? 'active' : ''}`}
                  onClick={() => setNewLabel(l)}
                  style={newLabel === l ? { borderColor: LABEL_COLORS[l], color: LABEL_COLORS[l] } : {}}
                >
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
          <button
            className="btn-primary"
            style={{ marginTop: '8px' }}
            onClick={() => addMutation.mutate()}
            disabled={!newAddr.trim() || addMutation.isPending}
          >
            {addMutation.isPending ? tr('loading', lang) : tr('save', lang)}
          </button>
        </div>
      )}

      {isLoading && (
        <div className="flex-center" style={{ paddingTop: '2rem' }}>
          <Loader2 size={24} className="spin" />
        </div>
      )}

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
              <button className="remove-btn" onClick={() => deleteMutation.mutate(addr.id)}>
                <Trash2 size={16} />
              </button>
            </div>
          )
        })}
        {!isLoading && addresses?.length === 0 && (
          <p className="text-muted" style={{ paddingTop: '1rem', textAlign: 'center' }}>
            {tr('noAddresses', lang)}
          </p>
        )}
      </div>
    </div>
  )
}
