import { useLangStore } from '../store'
import type { Lang } from '../types'

export default function Header() {
  const { lang, setLang } = useLangStore()
  const langs: Lang[] = ['ru', 'tk', 'en']

  return (
    <header className="app-header">
      <div className="header-logo">
        <span className="logo-text">Resulberdy</span>
      </div>
      <div className="lang-switcher">
        {langs.map(l => (
          <button
            key={l}
            className={`lang-btn ${lang === l ? 'active' : ''}`}
            onClick={() => setLang(l)}
          >
            {l.toUpperCase()}
          </button>
        ))}
      </div>
    </header>
  )
}
