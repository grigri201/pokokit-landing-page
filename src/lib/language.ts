export type LanguageMode = 'zh' | 'en'

export function resolveLanguageMode(locales: readonly string[]): LanguageMode {
  const primaryLocale = locales.find((locale) => locale.trim().length > 0)

  if (!primaryLocale) {
    return 'en'
  }

  return primaryLocale.toLowerCase().startsWith('zh') ? 'zh' : 'en'
}
