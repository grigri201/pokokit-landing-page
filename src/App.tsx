import { useEffect, useState } from 'react'
import { resolveLanguageMode, type LanguageMode } from './lib/language'
import { HomeRoute } from './routes/HomeRoute'

type ThemeMode = 'light' | 'dark'

function getInitialTheme(): ThemeMode {
  try {
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
  } catch {
    return 'light'
  }
}

function getInitialLanguage(): LanguageMode {
  try {
    const navigatorLanguages = window.navigator.languages
    const locales =
      navigatorLanguages.length > 0
        ? navigatorLanguages
        : [window.navigator.language]

    return resolveLanguageMode(locales)
  } catch {
    return 'en'
  }
}

function redirectUnsupportedPathToRoot() {
  if (window.location.pathname !== '/' || window.location.hash) {
    window.history.replaceState(null, '', '/')
  }
}

function App() {
  const [themeMode, setThemeMode] = useState<ThemeMode>(getInitialTheme)
  const [languageMode, setLanguageMode] = useState<LanguageMode>(getInitialLanguage)

  useEffect(() => {
    redirectUnsupportedPathToRoot()

    window.addEventListener('hashchange', redirectUnsupportedPathToRoot)
    window.addEventListener('popstate', redirectUnsupportedPathToRoot)

    return () => {
      window.removeEventListener('hashchange', redirectUnsupportedPathToRoot)
      window.removeEventListener('popstate', redirectUnsupportedPathToRoot)
    }
  }, [])

  useEffect(() => {
    document.documentElement.dataset.theme = themeMode
  }, [themeMode])

  useEffect(() => {
    document.documentElement.lang = languageMode === 'zh' ? 'zh-CN' : 'en'
  }, [languageMode])

  return (
    <HomeRoute
      languageMode={languageMode}
      themeMode={themeMode}
      onLanguageToggle={() =>
        setLanguageMode((currentLanguage) =>
          currentLanguage === 'zh' ? 'en' : 'zh',
        )
      }
      onThemeToggle={() =>
        setThemeMode((currentTheme) =>
          currentTheme === 'light' ? 'dark' : 'light',
        )
      }
    />
  )
}

export default App
