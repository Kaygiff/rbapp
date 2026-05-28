import type { Lang } from './types'
import type { MenuItem, Category } from './types'

/**
 * Возвращает локализованное название блюда.
 * Если перевод не заполнен — fallback на русский (name).
 */
export function itemName(item: MenuItem, lang: Lang): string {
  if (lang === 'tk' && item.nameTk) return item.nameTk
  if (lang === 'en' && item.nameEn) return item.nameEn
  return item.nameRu ?? item.name
}

/**
 * Возвращает локализованное описание блюда.
 */
export function itemDesc(item: MenuItem, lang: Lang): string | null {
  if (lang === 'tk' && item.descriptionTk) return item.descriptionTk
  if (lang === 'en' && item.descriptionEn) return item.descriptionEn
  return item.description
}

/**
 * Возвращает локализованное название категории.
 */
export function catName(cat: Category, lang: Lang): string {
  if (lang === 'tk' && cat.nameTk) return cat.nameTk
  if (lang === 'en' && cat.nameEn) return cat.nameEn
  return cat.name
}
