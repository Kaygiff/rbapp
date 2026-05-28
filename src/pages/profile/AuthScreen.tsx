import { useState } from 'react'
import { User, Eye, EyeOff, Loader2 } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { useAuthStore, useLangStore } from '../../store'
import { clientLogin, clientRegister } from '../../api'
import { tr } from '../../i18n'

export default function AuthScreen() {
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

  return (
    <div className="page">
      <div className="auth-card">
        <div className="auth-logo"><User size={40} strokeWidth={1} /></div>
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
              placeholder="+993 61 00 00 00"
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

          <button
            className="btn-primary btn-lg"
            onClick={() => { if (validate()) mutation.mutate() }}
            disabled={mutation.isPending}
          >
            {mutation.isPending
              ? <Loader2 size={18} className="spin" />
              : mode === 'login' ? tr('login', lang) : tr('register', lang)}
          </button>
        </div>
      </div>
    </div>
  )
}
