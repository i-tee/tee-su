import { en } from './en'
import { ru } from './ru'

export type Locale = 'en' | 'ru'
export type Translations = typeof en

// Без явного типа — TypeScript сам разберётся
export const locales = { en, ru }

export const defaultLocale: Locale = 'en'
