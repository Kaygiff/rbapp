import { useState } from 'react'
import { ChevronLeft, Loader2 } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { useAuthStore, useLangStore } from '../../store'
import { updateClientMe } from '../../api'
import { tr } from '../../i18n'

export default function EditProfileScreen({ onBack }: { onBack: () => void }) {
  const { lang } = useLangStore()
  const { token, client, updateClient, logout } = useAuthStore()
  const [firstName, setFirstName] = useState(client?.firstName ?? '')
  const [lastName, setLastName] = useState(client?.lastName ?? '')
  const [saved, setSaved] = useState(false)

  const mutation = useMutation({
    mutationFn: () => updateClientMe(token!, { firstName, lastName }),
    onSuccess: (data) => { updateClient(data); setSaved(true); setTimeout(() => setSaved(false), 2000) },
    onError: (err) => {
      if ((err as Error).message === 'Unauthorized') logout()
    },
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
