import { useState, useMemo, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ShoppingBag, Search, X } from 'lucide-react'
import { fetchMenu } from '../api'
import type { Category, MenuItem, Lang } from '../types'
import { useCartStore, useLangStore } from '../store'
import { tr } from '../i18n'
import { formatPrice } from '../utils'

export default function MenuPage() {
  const { lang } = useLangStore()
  const { data, isLoading, isError, refetch } = useQuery<Category[]>({ queryKey: ['menu'], queryFn: fetchMenu })
  const [activeCategory, setActiveCategory] = useState<number | null>(null)
  const [search, setSearch] = useState('')
  const { addItem, items: cartItems } = useCartStore()
  const sectionRefs = useRef<Record<number, HTMLElement | null>>({})

  const filtered = useMemo(() => {
    if (!data) return []
    let cats = activeCategory ? data.filter(c => c.id === activeCategory) : data
    if (search.trim()) {
      const q = search.toLowerCase()
      cats = cats
        .map(c => ({ ...c, items: c.items.filter(i => i.name.toLowerCase().includes(q) || i.description?.toLowerCase().includes(q)) }))
        .filter(c => c.items.length > 0)
    }
    return cats
  }, [data, activeCategory, search])

  const getCartQty = (id: number) => cartItems.find(i => i.menuItem.id === id)?.quantity ?? 0

  function handleCategoryClick(id: number | null) {
    setActiveCategory(id)
    if (id !== null && sectionRefs.current[id]) {
      sectionRefs.current[id]!.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  if (isLoading) return (
    <div className="flex-center full-height">
      <div className="loader" />
    </div>
  )

  if (isError) return (
    <div className="flex-center full-height flex-col gap-4">
      <p className="text-muted">{tr('error', lang)}</p>
      <button className="btn-primary" onClick={() => refetch()}>{tr('retry', lang)}</button>
    </div>
  )

  return (
    <div className="page">
      {/* Search */}
      <div className="search-wrap">
        <Search size={16} className="search-icon" />
        <input
          className="search-input"
          placeholder={tr('search', lang)}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {search && <button className="search-clear" onClick={() => setSearch('')}><X size={14} /></button>}
      </div>

      {/* Category tabs */}
      <div className="cat-tabs">
        <button
          className={`cat-tab ${activeCategory === null ? 'active' : ''}`}
          onClick={() => handleCategoryClick(null)}
        >
          {tr('allCategories', lang)}
        </button>
        {data?.map(cat => (
          <button
            key={cat.id}
            className={`cat-tab ${activeCategory === cat.id ? 'active' : ''}`}
            onClick={() => handleCategoryClick(cat.id)}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Menu items */}
      <div className="menu-content">
        {filtered.length === 0 ? (
          <div className="flex-center" style={{ paddingTop: '3rem' }}>
            <p className="text-muted">—</p>
          </div>
        ) : (
          filtered.map(cat => (
            <section
              key={cat.id}
              className="cat-section"
              ref={el => { sectionRefs.current[cat.id] = el }}
            >
              <h2 className="cat-title">{cat.name}</h2>
              <div className="items-grid">
                {cat.items.map(item => (
                  <MenuCard
                    key={item.id}
                    item={item}
                    qty={getCartQty(item.id)}
                    onAdd={() => addItem(item)}
                    lang={lang}
                  />
                ))}
              </div>
            </section>
          ))
        )}
      </div>
    </div>
  )
}

function MenuCard({ item, qty, onAdd, lang }: { item: MenuItem; qty: number; onAdd: () => void; lang: Lang }) {
  return (
    <div className={`menu-card ${!item.available ? 'unavailable' : ''}`}>
      <div className="card-img-wrap">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="card-img"
            loading="lazy"
            crossOrigin="anonymous"
            onError={(e) => {
              const target = e.currentTarget
              target.style.display = 'none'
              const placeholder = target.nextElementSibling as HTMLElement
              if (placeholder) placeholder.style.display = 'flex'
            }}
          />
        ) : null}
        <div className="card-img-placeholder" style={{ display: item.imageUrl ? 'none' : 'flex' }}>
          🍽️
        </div>
      </div>
      <div className="card-body">
        <div className="card-name">{item.name}</div>
        {item.description && <div className="card-desc">{item.description}</div>}
        <div className="card-footer">
          <span className="card-price">{formatPrice(item.price)}</span>
          {item.available ? (
            <button className={`card-add ${qty > 0 ? 'in-cart' : ''}`} onClick={onAdd}>
              {qty > 0 ? (
                <span className="qty-badge">{qty} <ShoppingBag size={12} /></span>
              ) : (
                <span>+</span>
              )}
            </button>
          ) : (
            <span className="unavailable-badge">{tr('unavailable', lang)}</span>
          )}
        </div>
      </div>
    </div>
  )
}
