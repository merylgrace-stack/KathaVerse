import { useLanguage } from '../lib/language'
import { en, type Strings } from './en'
import { ml } from './ml'

export type { Strings }

const BUNDLES: Record<'en' | 'ml', Strings> = { en, ml }

/** UI strings for the language currently selected in the app. */
export function useStrings(): Strings {
  const { lang } = useLanguage()
  return BUNDLES[lang]
}

export { en, ml }
